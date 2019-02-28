import {
  addMilliseconds,
  addMinutes,
  getUnixTime,
  startOfDay,
} from 'date-fns/esm';
import {loadAndConfigureGapi} from '../../services/gapi';
import {sprintf} from 'sprintf-js';

export default async function addLessonToClassroom({
  course: {id: courseId},
  date,
  lessonPlan: {doNowPrompt, doNowStarterCodeUrl},
  programDetails: {startTime, endTime},
  programMaterials,
}) {
  const {isProject, lessonNumber, unitNumber} =
    extractLessonMetadata(programMaterials);

  const startDateTime = dateTime(date, startTime);
  const endDateTime = dateTime(date, endTime);

  await addDoNow({
    courseId,
    lessonNumber,
    prompt: doNowPrompt,
    startDateTime,
    starterCodeUrl: doNowStarterCodeUrl,
    unitNumber,
  });
}

function dateTime(date, msOffset) {
  return addMilliseconds(startOfDay(date), msOffset);
}

function extractLessonMetadata(materials) {
  const [unitString, projectString, lessonString] =
    /\b(\d+)\.(P)?(\d*)\b/.exec(materials.slides.name);

  return {
    unitNumber: Number(unitString),
    lessonNumber: Number(lessonString || ''),
    isProject: Boolean(projectString),
  };
}

async function addDoNow({
  courseId,
  lessonNumber,
  prompt,
  starterCodeUrl,
  startDateTime,
  unitNumber,
}) {
  const {client: {classroom}} = await loadAndConfigureGapi();

  const dueDateTime = addMinutes(startDateTime, 10);

  const resource = {
    description: prompt,
    dueDate: apiDate(dueDateTime),
    dueTime: apiTime(dueDateTime),
    scheduledTime: apiTimestamp(addMinutes(startDateTime, -5)),
    title: sprintf('%02d.%d Do Now', unitNumber, lessonNumber),
    maxPoints: 0,
    workType: 'ASSIGNMENT',
  };

  if (starterCodeUrl) {
    resource.materials = [{
      link: {title: 'Starter code', url: starterCodeUrl},
    }];
  }

  await classroom.courses.courseWork.create({courseId, resource});
}

function apiDate(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function apiTime(date) {

  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
    nanos: date.getUTCMilliseconds() * 1000,
  };
}

function apiTimestamp(date) {
  return {
    seconds: getUnixTime(date),
    nanos: date.getUTCMilliseconds() * 1000,
  };
}
