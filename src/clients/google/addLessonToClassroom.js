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
  dueDate,
  lessonPlan: {
    doNowPrompt,
    doNowStarterCodeUrl,
    exitTicketPrompt,
    independentPracticeStarterCodeUrl,
    objective,
    vocabulary,
  },
  programDetails: {startTime, endTime},
  lesson: {
    isProject,
    lessonId,
    materials: {guidedNotes, homework, rubric, slides},
    title,
  },
}) {
  const startDateTime = dateTime(date, startTime);
  const endDateTime = dateTime(date, endTime);
  const dueDateTime = dateTime(dueDate || date, endTime);

  const [
    doNowAssignment,
    slidesAssignment,
    exitTicketQuestion
  ] = await Promise.all([
    addDoNow({
      courseId,
      lessonId,
      prompt: doNowPrompt,
      startDateTime,
      starterCodeUrl: doNowStarterCodeUrl,
    }),

    addSlides({
      courseId,
      dueDateTime,
      guidedNotes,
      homework,
      independentPracticeStarterCodeUrl,
      isProject,
      lessonId,
      objective,
      rubric,
      slides,
      startDateTime,
      title,
      vocabulary,
    }),

    addExitTicket({
      courseId,
      endDateTime,
      lessonId,
      prompt: exitTicketPrompt,
    }),
  ]);

  return {
    doNow: doNowAssignment,
    slides: slidesAssignment,
    exitTicket: exitTicketQuestion,
  };
}

async function addDoNow({
  courseId,
  lessonId,
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
    title: `${lessonId} Do Now`,
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
  dueDateTime,
  lessonId,
  independentPracticeStarterCodeUrl,
  isProject,
  objective,
  rubric,
  slides,
  startDateTime,
  title,
  vocabulary,
}) {
  const dueDateTimeWithGracePeriod = addMinutes(dueDateTime, 10);

  let description = `Objective: ${objective}`;
  if (vocabulary) {
    description = `${description}\nVocabulary: ${vocabulary}`
  }

  const resource = {
    description,
    dueDate: apiDate(dueDateTimeWithGracePeriod),
    dueTime: apiTime(dueDateTimeWithGracePeriod),
    materials: [{driveFile: {driveFile: {id: slides.id}}}],
    maxPoints: isProject ? 100 : 0,
    scheduledTime: apiTimestamp(addMinutes(startDateTime, -5)),
    title: `${lessonId} ${title}`,
    workType: 'ASSIGNMENT',
  };

  if (independentPracticeStarterCodeUrl) {
    resource.materials.push({link: {url: independentPracticeStarterCodeUrl}});
  }

  if (rubric) {
    resource.materials.push({driveFile: {driveFile: {id: rubric.id}}});
  }

  const {client: {classroom}} = await loadAndConfigureGapi();
  await classroom.courses.courseWork.create({courseId, resource});
}

async function addExitTicket({
  courseId,
  endDateTime,
  lessonId,
  prompt,
}) {
  if (!prompt) return;

  const dueDateTime = addMinutes(endDateTime, 10);

  const resource = {
    description: prompt,
    dueDate: apiDate(dueDateTime),
    dueTime: apiTime(dueDateTime),
    maxPoints: 0,
    scheduledTime: apiTimestamp(addMinutes(endDateTime, -10)),
    title: `${lessonId} Exit Ticket`,
    workType: 'SHORT_ANSWER_QUESTION',
  };

  const {client: {classroom}} = await loadAndConfigureGapi();
  await classroom.courses.courseWork.create({courseId, resource});
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
