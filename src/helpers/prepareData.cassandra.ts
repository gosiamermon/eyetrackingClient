import {
  ApiResponseExperiment,
  ApiResponseCassandraExperiment,
  ApiResponseSession,
  ApiResponseCassandraSession,
  ApiResponseCassandraSubject,
  ApiResponseSubject,
  ApiResponseCassandraMeasurement,
  ApiResponseMeasurement,
  ApiResponseCassandraStymulus,
  ApiResponseStymulus,
} from '../app/shared/api.shared.model';

export function prepareCassandraExperiment(
  experiment: ApiResponseCassandraExperiment
): ApiResponseExperiment {
  return {
    endDate: experiment.enddate,
    id: experiment.id,
    name: experiment.name,
    startDate: experiment.startdate
  };
}

export function prepareCassandraStymulus(
  stymulus: ApiResponseCassandraStymulus
): ApiResponseStymulus {
  return {
    endTime: stymulus.endtime,
    id: stymulus.id,
    link: stymulus.link,
    startTime: stymulus.starttime,
    stymulusType: stymulus.stymulustype,
    x: stymulus.x,
    y: stymulus.y,
  };
}

export function prepareCassandraSession(
  session: ApiResponseCassandraSession
): ApiResponseSession {
  return {
    deviceError: session.deviceerror,
    deviceFrequency: session.devicefrequency,
    deviceProducer: session.deviceproducer,
    deviceType: session.devicetype,
    endDate: session.enddate,
    experimentId: session.experimentid,
    id: session.id,
    startDate: session.startdate,
    subjectId: session.subjectid,
  };
}

export function prepareCassandraSubject(
  subject: ApiResponseCassandraSubject
): ApiResponseSubject {
  return {
    age: subject.age,
    educationLevel: subject.educationlevel,
    id: subject.id,
    sex: subject.sex,
    visionDefect: subject.visiondefect
  };
}

export function prepareCassandraMeasurement(
  measurement: ApiResponseCassandraMeasurement
): ApiResponseMeasurement {
  return {
    id: measurement.id,
    isCalibration: measurement.iscalibration,
    sessionId: measurement.sessionid,
    stymulusId: measurement.stymulusid,
    timestamp: measurement.timestamp,
    x: measurement.x,
    y: measurement.y,
  };
}