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

export async function loadCourses() {
  const {client: {classroom}} = await loadAndConfigureGapi();
  const {result: {courses}} = await classroom.courses.list({teacherId: 'me'});
  return courses;
}
