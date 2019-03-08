import AFHConvert from 'ascii-fullwidth-halfwidth-convert';
import compact from 'lodash-es/compact';
import defaultTo from 'lodash-es/defaultTo';
import filter from 'lodash-es/filter';
import find from 'lodash-es/find';
import first from 'lodash-es/first';
import flatMap from 'lodash-es/flatMap';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';
import map from 'lodash-es/map';
import maxBy from 'lodash-es/maxBy';
import sortBy from 'lodash-es/sortBy';
import trim from 'lodash-es/trim';
import without from 'lodash-es/without';

import {loadAndConfigureGapi} from '../../services/gapi';

const afhConverter = new AFHConvert();

export default async function extractLessonPlanFromSlides(lesson) {
  const {client: {slides}} = await loadAndConfigureGapi();
  const {result: presentation} = await slides.presentations.get({
    presentationId: lesson.materials.slides.id,
  });
  const decoratedSlides = map(presentation.slides, extractDataFromSlide);
  return {
    ...extractDoNow(decoratedSlides),
    ...extractObjectiveAndVocabulary(decoratedSlides),
    ...extractIndependentPractice(decoratedSlides),
    ...extractExitTicket(decoratedSlides),
  };
}

function extractExitTicket(decoratedSlides) {
  for (const {data: {header, body}} of decoratedSlides)  {
    if (/^exit ticket\b/i.test(header)) {
      return {exitTicketPrompt: body};
    }
  }
}

function extractDoNow(decoratedSlides) {
  const doNowSlides = filter(
    decoratedSlides,
    ({data: {header}}) => /^do now\b/i.test(header),
  );
  const bestDoNowSlide = defaultTo(
    find(doNowSlides, ({data: {urls}}) => urls.length > 0),
    doNowSlides[0]
  );

  if (!isNil(bestDoNowSlide)) {
    return {
      doNowPrompt: bestDoNowSlide.data.body,
      doNowStarterCodeUrl: first(bestDoNowSlide.data.urls),
    }
  }
}

function extractObjectiveAndVocabulary(decoratedSlides) {
  for (const {data: {textElements}} of decoratedSlides) {
    const objectiveElement = find(
      textElements,
      ({content}) => /^coders will/i.test(trim(content)),
    );
    if (!isNil(objectiveElement)) {
      const objective = trim(objectiveElement.content).replace(
        /^coders will\W+/is,
        'Coders will ',
      )
      let vocabulary;
      const vocabularyElement = find(
        textElements,
        ({content}) => /^vocab(?:ulary)?:/i.test(trim(content)),
      );
      if (!isNil(vocabularyElement)) {
        vocabulary = trim(vocabularyElement.content)
          .replace(/^vocab(?:ulary)?:\s*/i, '');
      }
      return {objective, vocabulary};
    }
  }
}

function extractIndependentPractice(decoratedSlides) {
  for (const {data: {header, urls}} of decoratedSlides) {
    if (/^your turn/i.test(header)) {
      if (!isEmpty(urls)) {
        return {independentPracticeStarterCodeUrl: first(urls)};
      }
    }
  }
}

function extractDataFromSlide(source) {
  const textElements = extractTextElements(source.pageElements);
  let headerElement, header;
  headerElement = maxBy(textElements, 'maximumTextSize');
  header = headerElement.content;
  if (headerElement.content.includes('\n')) {
    headerElement = header = null;
  }

  const labelElement = maxBy(
    textElements,
    'position.left',
  );

  const body = map(
    sortBy(
      without(textElements, labelElement, headerElement),
      'position.top',
    ),
    'content'
  ).join('\n\n');

  const urls = flatMap(textElements, 'urls');

  return {
    source,
    data: {header, body, urls, textElements}
  }
}

function extractTextElements(pageElements) {
  return compact(
    map(pageElements, (pageElement) => {
      if (
        get(pageElement, 'shape.shapeType') === 'TEXT_BOX' &&
          isObject(get(pageElement, 'shape.text'))
      ) {
        const textFragments = [];
        const urls = [];
        let maximumTextSize = 0;
        for (const textElement of pageElement.shape.text.textElements) {
          if (isString(get(textElement, 'textRun.content'))) {
            const text = get(textElement, 'textRun.content');
            if (get(textElement, 'textRun.style.fontFamily') === 'Consolas') {
              textFragments.push(afhConverter.toFullWidth(text));
            } else {
              textFragments.push(text);
            }
            maximumTextSize = Math.max(
              maximumTextSize,
              get(textElement, 'textRun.style.fontSize.magnitude', 0),
            );
            const url = get(textElement, 'textRun.style.link.url');
            if (!isNil(url)) {
              urls.push(url);
            }
          } else if (isObject(textElement.paragraphMarker)) {
            const bullet = get(textElement, 'paragraphMarker.bullet.glyph');
            if (bullet) {
              textFragments.push(`${bullet} `);
            }
          }
        }
        return {
          content: trim(textFragments.join('')).replace(/\n{3,}/g, "\n\n"),
          urls,
          maximumTextSize,
          position: {
            top: pageElement.transform.translateY,
            left: pageElement.transform.translateX,
          },
        };
      }
    })
  );
}
