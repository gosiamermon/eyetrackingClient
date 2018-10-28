import { ApiSubject, ApiSession, ApiMeasurement } from '../app/shared/api.subjectBased.model';
import { SessionData, Experiment } from '../app/shared/model';
import { ApiStymulus } from '../app/shared/api.shared.model';

export const prepareSubject = (
  session: SessionData,
  experiment: Experiment,
  stymulus: ApiStymulus[],
): ApiSubject => {
  return {
    age: Number(session.age),
    educationLevel: session.educationLevel,
    experiment: {
      endDate: experiment.endDate,
      name: experiment.name,
      sessions: [],
      startDate: experiment.startDate,
      stymulus,
    },
    name: session.subjectName,
    sex: session.sex,
    visionDefect: Number(session.visionDefect),
  };
};

export const prepareSubjects = (
  experiment: Experiment,
  stymulus: ApiStymulus[],
): ApiSubject[] => {
  const uniqueSubjectsData = experiment.sessionData.filter((session, index, arr) => {
    return arr.map(mapSession => mapSession.subjectName).indexOf(session.subjectName) === index;
  });

  return uniqueSubjectsData.map(session => prepareSubject(session, experiment, stymulus));
}

export const prepareSession = (
  session: SessionData,
  measurements: ApiMeasurement[],
  calibration: ApiMeasurement[],
): ApiSession => {
  return {
    calibration,
    deviceError: Number(session.deviceError),
    deviceFrequency: Number(session.deviceFrequency),
    deviceProducer: session.deviceProducer,
    deviceType: session.deviceType,
    endDate: session.endDate,
    measurements,
    startDate: session.startDate,
  };
};