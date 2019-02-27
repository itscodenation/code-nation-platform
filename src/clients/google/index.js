import escapeQuotes from 'escape-quotes';
import filter from 'lodash-es/filter';
import last from 'lodash-es/last';
import map from 'lodash-es/map';
import parse from 'url-parse';
import property from 'lodash-es/property';
import sortBy from 'lodash-es/sortBy';

import {getGapiSync, loadAndConfigureGapi} from '../../services/gapi';

const MASTER_CURRICULUM_FOLDER_ID =
  process.env.REACT_APP_MASTER_CURRICULUM_FOLDER_ID;

const IRREGULAR_UNIT_NAMES = {
  'End of Year Challenge Unit 18-19': 9.5,
  'Extension Unit: Animations and Collisions 18-19': 10,
  'Midyear Challenge and Review Unit 18-19': 5.5,
};

const LESSON_MATERIAL_ABBREVIATIONS = {
  'GN': 'guidedNotes',
  'HW': 'homework',
  'LP': 'slides',
};

export {default as copyLesson} from './copyLesson';

export async function init() {
  return loadAndConfigureGapi();
}

export async function signIn() {
  const gapi = getGapiSync();
  const auth = gapi.auth2.getAuthInstance();
  return auth.signIn({prompt: 'select_account'});
};

function getUnitSequence(name) {
  if (name in IRREGULAR_UNIT_NAMES) {
    return IRREGULAR_UNIT_NAMES[name];
  }
  const match = /^Unit (\d+): /.exec(name);
  if (match) {
    return Number(match[1]);
  }
  return null;
}

export async function loadUnits() {
  const {client: {drive}} = await loadAndConfigureGapi();

  const files = await loadAllPages(
    pageToken => drive.files.list({
      pageToken,
      q: `'${escapeQuotes(MASTER_CURRICULUM_FOLDER_ID)}' in parents`,
    }),
    property('files'),
  );

  return map(
    sortBy(
      filter(
        map(
          files,
          file => ({file, sequence: getUnitSequence(file.name)}),
        ),
        'sequence'
      ),
      'sequence',
    ),
    'file'
  );
}

export async function loadLessons({id: unitId}) {
  const {client: {drive}} = await loadAndConfigureGapi();

  const lessonMap = new Map();
  const eachPage = loadEachPage(pageToken => drive.files.list({
    q: `'${escapeQuotes(unitId)}' in parents`,
    fields: ['files(exportLinks,id,mimeType,name,webViewLink)']
  }));

  for await (const {files} of eachPage) {
    for (const file of files) {
      const {type, index} = identifyLessonFile(file) || {};

      if (type) {
        if (!lessonMap.has(index)) {
          lessonMap.set(index, {});
        }
        const lesson = lessonMap.get(index);
        lesson[type] = file;
      }
    }
  }

  return sortLessons(Array.from(lessonMap.entries()));
}

function identifyLessonFile(file) {
  const parsedFilename =
    /^(?:\d+)\.(\d+|PR?\d?) (?:([A-Z]{2}) )?(?:.+)$/.exec(file.name);
  if (parsedFilename) {
    const [, index, typeAbbreviation] = parsedFilename;
    if (typeAbbreviation in LESSON_MATERIAL_ABBREVIATIONS) {
      return {
        index,
        type: LESSON_MATERIAL_ABBREVIATIONS[typeAbbreviation],
      };
    } else if (!typeAbbreviation) {
      if (index.startsWith('PR')) {
        return {
          index: index.replace(/^PR/, 'P'),
          type: 'rubric',
        };
      } else if (file.mimeType === 'application/vnd.google-apps.presentation') {
        return {
          index,
          type: 'slides',
        };
      }
    }
  }
}

function sortLessons(lessons) {
  return map(
    lessons.sort(
      ([index1], [index2]) => {
        const lesson1IsProject = index1.startsWith('P');
        const lesson2IsProject = index2.startsWith('P');

        if (lesson1IsProject && !lesson2IsProject) return 1;
        if (lesson2IsProject && !lesson1IsProject) return -1;

        const numericIndex1 = Number(/\d+$/.exec(index1)[0]);
        const numericIndex2 = Number(/\d+$/.exec(index2)[0]);

        return numericIndex1 - numericIndex2;
      }
    ),
    last
  );
}

export async function getFolderDetails({url}) {
  const {pathname} = parse(url);
  const fileId = last(pathname.split('/'));

  const {client: {drive}} = await loadAndConfigureGapi();
  const {result} = await drive.files.get({fileId});
  return result;
}

export async function loadCourses() {
  const {client: {classroom}} = await loadAndConfigureGapi();
  return loadAllPages(
    pageToken => classroom.courses.list({teacherId: 'me'}),
    property('courses'),
  );
}

async function loadAllPages(getPage, getItems) {
  const items = [];
  for await (const result of loadEachPage(getPage)) {
    items.push(...getItems(result));
  }

  return items;
}

async function* loadEachPage(getPage) {
  let pageToken;
  do {
    const {result} = await getPage(pageToken);
    yield result;
    pageToken = result.nextPageToken;
  } while (pageToken);
}
