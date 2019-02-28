import {
  addMilliseconds,
  addMinutes,
  getUnixTime,
  startOfDay,
} from 'date-fns/esm';
import {loadAndConfigureGapi} from '../../services/gapi';

export default async function addLessonToClassroom({
  course: {id: courseId},
  date,
  lessonPlan: {
    doNowPrompt,
    doNowStarterCodeUrl,
    independentPracticeStarterCodeUrl,
    objective,
    vocabulary,
  },
  programDetails: {startTime, endTime},
  programMaterials: {guidedNotes, homework, slides},
}) {
  const {fullLessonNumber, isProject, title} =
    extractLessonMetadata(slides);

  const startDateTime = dateTime(date, startTime);
  const endDateTime = dateTime(date, endTime);

  await addDoNow({
    courseId,
    fullLessonNumber,
    prompt: doNowPrompt,
    startDateTime,
    starterCodeUrl: doNowStarterCodeUrl,
  });

  await addSlides({
    courseId,
    endDateTime,
    fullLessonNumber,
    guidedNotes,
    homework,
    independentPracticeStarterCodeUrl,
    objective,
    slides,
    startDateTime,
    title,
    vocabulary,
  });
}

async function addDoNow({
  courseId,
  fullLessonNumber,
  prompt,
  starterCodeUrl,
  startDateTime,
}) {
  const {client: {classroom}} = await loadAndConfigureGapi();

  const dueDateTime = addMinutes(startDateTime, 10);

  const resource = {
    description: prompt,
    dueDate: apiDate(dueDateTime),
    dueTime: apiTime(dueDateTime),
    scheduledTime: apiTimestamp(addMinutes(startDateTime, -5)),
    title: `${fullLessonNumber} Do Now`,
    maxPoints: 0,
    workType: 'ASSIGNMENT',
  };

  if (starterCodeUrl) {
    resource.materials = [{link: {url: starterCodeUrl}}];
  }

  await classroom.courses.courseWork.create({courseId, resource});
}

async function addSlides({
  courseId,
  endDateTime,
  fullLessonNumber,
  guidedNotes,
  homework,
  independentPracticeStarterCodeUrl,
  objective,
  slides,
  startDateTime,
  title,
  vocabulary,
}) {
  const dueDateTime = addMinutes(endDateTime, 10);

  const resource = {
    description: `${objective}\n\nVocab: ${vocabulary}`,
    dueDate: apiDate(dueDateTime),
    dueTime: apiTime(dueDateTime),
    materials: [{driveFile: {driveFile: {id: slides.id}}}],
    maxPoints: 0,
    scheduledTime: apiTimestamp(addMinutes(startDateTime, -5)),
    title: `${fullLessonNumber} ${title}`,
    workType: 'ASSIGNMENT',
  };

  if (independentPracticeStarterCodeUrl) {
    resource.materials.push({link: {url: independentPracticeStarterCodeUrl}});
  }

  if (guidedNotes) {
    resource.materials.push({driveFile: {driveFile: {id: guidedNotes.id}}});
  }

  if (homework) {
    resource.materials.push({driveFile: {driveFile: {id: homework.id}}});
  }

  const {client: {classroom}} = await loadAndConfigureGapi();
  await classroom.courses.courseWork.create({courseId, resource});
}


function extractLessonMetadata(slides) {
  const [,
    fullLessonNumber,
    unitString,
    projectString,
    lessonString,
    title
  ] = /\b((\d+)\.(P)?(\d*)) (?:LP )?(.+)(?: \d{4}-\d{4})?$/.exec(slides.name);

  return {
    fullLessonNumber,
    isProject: Boolean(projectString),
    lessonNumber: Number(lessonString || ''),
    title,
    unitNumber: Number(unitString),
  };
}

function dateTime(date, msOffset) {
  return addMilliseconds(startOfDay(date), msOffset);
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
