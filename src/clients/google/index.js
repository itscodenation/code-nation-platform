import escapeQuotes from 'escape-quotes';
import filter from 'lodash-es/filter';
import last from 'lodash-es/last';
import map from 'lodash-es/map';
import parse from 'url-parse';
import property from 'lodash-es/property';
import sortBy from 'lodash-es/sortBy';

import {getGapiSync, loadAndConfigureGapi} from '../../services/gapi';

import {loadAllPages} from './requests';

const MASTER_CURRICULUM_FOLDER_ID =
  process.env.REACT_APP_MASTER_CURRICULUM_FOLDER_ID;

const IRREGULAR_UNIT_NAMES = {
  'End of Year Challenge Unit 18-19': 9.5,
  'Extension Unit: Animations and Collisions 18-19': 10,
  'Midyear Challenge and Review Unit 18-19': 5.5,
};

export {default as addLessonToClassroom} from './addLessonToClassroom';
export {default as copyLesson} from './copyLesson';
export {default as loadLessons} from './loadLessons';

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
