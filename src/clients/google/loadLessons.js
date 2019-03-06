import escapeQuotes from 'escape-quotes';
import isNil from 'lodash-es/isNil';
import last from 'lodash-es/last';
import map from 'lodash-es/map';
import merge from 'lodash-es/merge';

import {loadAndConfigureGapi} from '../../services/gapi';

import {loadEachPage} from './requests';

const LESSON_MATERIAL_ABBREVIATIONS = {
  'GN': 'guidedNotes',
  'HW': 'homework',
  'LP': 'slides',
};

export default async function loadLessons({id: unitId}) {
  const {client: {drive}} = await loadAndConfigureGapi();

  const lessonMap = new Map();
  const eachPage = loadEachPage(pageToken => drive.files.list({
    q: `'${escapeQuotes(unitId)}' in parents`,
    fields: ['files(exportLinks,id,mimeType,name,webViewLink)']
  }));

  for await (const {files} of eachPage) {
    for (const file of files) {
      const lesson = identifyLessonFile(file);

      if (lesson) {
        const {lessonId} = lesson;
        lessonMap.set(lessonId, merge(lesson, lessonMap.get(lessonId)));
      }
    }
  }

  return sortLessons(Array.from(lessonMap.values()));
}

function identifyLessonFile(file) {
  const parsedFilename =
    /^(\d+\.(\d+)|PR?(\d?)) (?:([A-Z]{2}) )?(.+)(?: \d{4}-\d{4})?$/.exec(file.name);
  if (parsedFilename) {
    const [
      fullMatch,
      lessonId,
      lessonNumber,
      projectNumber,
      typeAbbreviation,
      title,
    ] = parsedFilename;

    if (isNil(fullMatch)) return;

    const lessonProps = {
      isProject: /\.P/.test(lessonId),
      lessonId,
      number: Number(lessonNumber || projectNumber || 1),
      title,
    }

    if (typeAbbreviation in LESSON_MATERIAL_ABBREVIATIONS) {
      const type = LESSON_MATERIAL_ABBREVIATIONS[typeAbbreviation];
      return {
        ...lessonProps,
        materials: {[type]: file},
      };
    } else if (!typeAbbreviation) {
      if (/\.PR/.test(lessonId)) {
        return {
          ...lessonProps,
          lessonId: lessonId.replace(/\.PR/, '.P'),
          materials: {rubric: file}
        };
      } else if (file.mimeType === 'application/vnd.google-apps.presentation') {
        return {
          ...lessonProps,
          materials: {slides: file}
        };
      }
    }
  }
}

function sortLessons(lessons) {
  return lessons.sort(
    (
      {isProject: lesson1IsProject, number: number1},
      {isProject: lesson2IsProject, number: number2}
    ) => {
      if (lesson1IsProject && !lesson2IsProject) return 1;
      if (lesson2IsProject && !lesson1IsProject) return -1;

      return number1 - number2;
    }
  );
}
