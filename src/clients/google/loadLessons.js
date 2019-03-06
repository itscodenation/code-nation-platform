import escapeQuotes from 'escape-quotes';
import last from 'lodash-es/last';
import map from 'lodash-es/map';

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
