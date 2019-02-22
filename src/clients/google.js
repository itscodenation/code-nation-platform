import escapeQuotes from 'escape-quotes';
import filter from 'lodash-es/filter';
import {getGapiSync, loadAndConfigureGapi} from '../services/gapi';
import map from 'lodash-es/map';
import sortBy from 'lodash-es/sortBy';

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
  const {result: {files}} = await drive.files.list({
    q: `'${escapeQuotes(MASTER_CURRICULUM_FOLDER_ID)}' in parents`
  });

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
  const {result: {files}} = await drive.files.list({
    q: `'${escapeQuotes(unitId)}' in parents`,
  });

  const lessonMap = new Map();

  for (const file of files) {
    const parsedFilename =
      /^(?:\d+)\.(\d+|PR?\d?) (?:([A-Z]{2}) )?(?:.+)$/.exec(file.name);
    if (parsedFilename) {
      const [, fullLessonIndex, typeAbbreviation] = parsedFilename;
      let lessonIndex = fullLessonIndex;
      let type;
      if (typeAbbreviation in LESSON_MATERIAL_ABBREVIATIONS) {
        type = LESSON_MATERIAL_ABBREVIATIONS[typeAbbreviation];
      } else if (!typeAbbreviation) {
        if (fullLessonIndex.startsWith('PR')) {
          type = 'rubric';
          lessonIndex = fullLessonIndex.replace(/^PR/, 'P');
        } else if (
          file.mimeType === 'application/vnd.google-apps.presentation'
        ) {
          type = 'slides';
        }
      }

      if (type) {
        if (!lessonMap.has(lessonIndex)) {
          lessonMap.set(lessonIndex, {lessonIndex});
        }
        const lesson = lessonMap.get(lessonIndex);
        lesson[type] = file;
      }
    }
  }

  return Array.from(lessonMap.values()).sort(
    ({lessonIndex: lessonIndex1}, {lessonIndex: lessonIndex2}) => {
      const lesson1IsProject = lessonIndex1.startsWith('P');
      const lesson2IsProject = lessonIndex2.startsWith('P');

      if (lesson1IsProject && !lesson2IsProject) return 1;
      if (lesson2IsProject && !lesson1IsProject) return -1;

      const numericIndex1 = Number(/\d+$/.exec(lessonIndex1)[0]);
      const numericIndex2 = Number(/\d+$/.exec(lessonIndex2)[0]);

      console.log({lessonIndex1, lessonIndex2, numericIndex1, numericIndex2});

      return numericIndex1 - numericIndex2;
    }
  );
}

export async function loadCourses() {
  const {client: {classroom}} = await loadAndConfigureGapi();
  const {result: {courses}} = await classroom.courses.list({teacherId: 'me'});
  return courses;
}
