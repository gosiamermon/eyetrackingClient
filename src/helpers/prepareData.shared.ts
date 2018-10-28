import { Experiment, MeasurementsSet, SessionData } from '../app/shared/model';
import { ApiExperiment, ApiSession, ApiSubject } from '../app/shared/api.shared.model';
import { CPE, CPS, G } from '../config/constants';
import { ApiStymulus } from '../app/shared/api.shared.model';
import { ApiMongoSubject } from '../app/shared/api.experimentBased.model';

export const prepareStymulusForCalibration = (
  experiment: Experiment,
): { apiCalibrationStymulus: ApiStymulus[], calibrationSet: MeasurementsSet[] } => {

  const measurementsSet: MeasurementsSet[] = [];
  const apiStymulus: ApiStymulus[] = [];

  let apiStymulusAssigned = false;
  for (const data of experiment.calibrationData) {
    let stymulusId = 0;

    const calibrationMeasurements = data.measurements;
    let firstCPSTimestamp = 0;
    let tempStymulus: any = {};
    let tempMeasurements = [];

    for (let i = 0; i < calibrationMeasurements.length; i++) {
      const measurement = calibrationMeasurements[i];

      if (measurement.type === CPS) {
        stymulusId++;
        if (!apiStymulusAssigned) {
          firstCPSTimestamp = firstCPSTimestamp ? firstCPSTimestamp :
            Number(measurement.timestamp);

          tempStymulus.startTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
          tempStymulus.stymulusType = measurement.stymulusType;
          tempStymulus.x = Number(measurement.x);
          tempStymulus.y = Number(measurement.y);
          tempStymulus.id = stymulusId;
        }
      } else if (measurement.type === CPE) {
        if (!apiStymulusAssigned) {
          tempStymulus.endTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
          apiStymulus.push(Object.assign({}, tempStymulus));
        }

        tempStymulus = {};

      } else if (measurement.type === G) {

        tempMeasurements.push({
          isCalibration: 1,
          stymulusId,
          timestamp: Number(measurement.timestamp),
          x: Number(measurement.x),
          y: Number(measurement.y),
        });
      }
    }
    measurementsSet.push({
      measurements: Object.assign([], tempMeasurements),
      sessionId: data.sessionId,
    })
    tempMeasurements = [];
    apiStymulusAssigned = true;
  }
  return { calibrationSet: measurementsSet, apiCalibrationStymulus: apiStymulus };
};

export const prepareStymulusForMeasurements = (
  apiStymulus: ApiStymulus[],
  experiment: Experiment,
  images: Array<{
    fileName: string,
    link: string,
  }>,
): { apiStymulus: ApiStymulus[], measurementsSet: MeasurementsSet[] } => {
  const measurementsSet: MeasurementsSet[] = [];

  let apiStymulusAssigned = false;
  for (const data of experiment.measurementsData) {
    let stymulusId = apiStymulus.length;

    const measurements = data.measurements.filter(d => d.type === G);
    let firstCPSTimestamp = 0;
    let tempStymulus: any = {};
    let tempMeasurements = [];
    let previousImageName = "";

    for (let i = 0; i < measurements.length; i++) {
      const measurement = measurements[i];
      const tempImage = images.find((img) => img.fileName === measurement.imageFileName);

      if (previousImageName !== measurement.imageFileName || i === measurements.length - 1) {
        stymulusId++;

        if (!apiStymulusAssigned) {
          if (tempStymulus.startTime !== undefined) {
            tempStymulus.endTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
            apiStymulus.push(Object.assign({}, tempStymulus));

            tempStymulus = {};
          }
          previousImageName = measurement.imageFileName;
          firstCPSTimestamp = firstCPSTimestamp ? firstCPSTimestamp :
            Number(measurement.timestamp);

          tempStymulus.startTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
          tempStymulus.stymulusType = measurement.stymulusType;
          tempStymulus.link = tempImage ? tempImage.link : undefined;
          tempStymulus.id = stymulusId;
        }
      }
      tempMeasurements.push({
        isCalibration: 0,
        stymulusId,
        timestamp: Number(measurement.timestamp),
        x: Number(measurement.x),
        y: Number(measurement.y),
      });
    }
    measurementsSet.push({
      measurements: Object.assign([], tempMeasurements),
      sessionId: data.sessionId,
    })
    tempMeasurements = [];
    apiStymulusAssigned = true;
  }
  return { apiStymulus, measurementsSet };
};

export const prepareExperiment = (
  experiment: Experiment,
  stymulus: ApiStymulus[],
): ApiExperiment => {
  return {
    endDate: experiment.endDate,
    name: experiment.name,
    startDate: experiment.startDate,
    stymulus,
  };
};

export const prepareSubject = (session: SessionData): ApiSubject => {
  return {
    age: Number(session.age),
    educationLevel: session.educationLevel,
    name: session.subjectName,
    sex: session.sex,
    visionDefect: Number(session.visionDefect),
  };
};

export const prepareMongoSubjects = (sessions: SessionData[]): ApiMongoSubject[] => {
  const uniqueSubjectsData = sessions.filter((session, index, arr) => {
    return arr.map(mapSession => mapSession.subjectName).indexOf(session.subjectName) === index;
  });

  return uniqueSubjectsData.map(session => prepareMongoSubject(session));
}

export const prepareMongoSubject = (session: SessionData): ApiMongoSubject => {
  return {
    age: Number(session.age),
    educationLevel: session.educationLevel,
    name: session.subjectName,
    sessions: [],
    sex: session.sex,
    visionDefect: Number(session.visionDefect),
  };
};

export const prepareSubjects = (sessions: SessionData[]): ApiSubject[] => {
  const uniqueSubjectsData = sessions.filter((session, index, arr) => {
    return arr.map(mapSession => mapSession.subjectName).indexOf(session.subjectName) === index;
  });

  return uniqueSubjectsData.map(session => prepareSubject(session));
}

export const prepareSession = (
  session: SessionData,
  experimentId?: number,
  subjectId?: number,
): ApiSession => {
  if (experimentId && subjectId) {
    return {
      deviceError: Number(session.deviceError),
      deviceFrequency: Number(session.deviceFrequency),
      deviceProducer: session.deviceProducer,
      deviceType: session.deviceType,
      endDate: session.endDate,
      experimentId,
      startDate: session.startDate,
      subjectId,
      subjectName: session.subjectName,
    };
  } else {
    return {
      deviceError: Number(session.deviceError),
      deviceFrequency: Number(session.deviceFrequency),
      deviceProducer: session.deviceProducer,
      deviceType: session.deviceType,
      endDate: session.endDate,
      startDate: session.startDate,
      subjectName: session.subjectName,
    }
  }
};

export function calculateTime(firstCPSTimestamp: number, timestamp: string) {
  const time = (Number(timestamp) - firstCPSTimestamp) / 1000;
  return time;
};

export const prepareExperimentsFromCassandra = (experiments: any[]) => {
  return experiments.map(exp => {
    exp.startDate = exp.startdate;
    delete exp.startdate;
    exp.endDate = exp.enddate;
    delete exp.enddate;
    return exp;
  });
}