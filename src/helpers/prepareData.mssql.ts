import { Experiment, SessionData, DataPerStymulus } from '../app/shared/model';
import { ApiExperiment, ApiMeasurement } from '../app/shared/api.shared.model';
import { calculateTime } from './prepareData.shared';
import { CPE, CPS, G } from '../config/constants';

export const prepareExperiment = (experiment: Experiment): ApiExperiment => {
  return {
    endDate: experiment.endDate,
    name: experiment.name,
    startDate: experiment.startDate,
  };
};

export const prepareMeasurements = (
  data: DataPerStymulus,
  stymulusId: number,
): ApiMeasurement[] => {
  return data.measurements.map((measurement) => {
    return {
      isCalibration: measurement.isCalibration,
      sessionId: measurement.sessionId,
      stymulusId,
      timestamp: measurement.timestamp,
      x: measurement.x,
      y: measurement.y,
    };
  });
};

export const prepareStymulusForCalibration = (
  experiment: Experiment,
  session: SessionData,
  experimentId: number,
  sessionId: number,
): DataPerStymulus[] | undefined => {
  const filteredData = experiment.calibrationData.find(data => {
    return data.sessionId === session.id;
  });
  if (!filteredData) {
    return;
  }

  const calibrationMeasurements = filteredData.measurements;
  const dataPerStymulus: DataPerStymulus[] = [];
  let firstCPSTimestamp = 0;
  let tempStymulus: any = {};
  let tempMeasurements = [];

  for (let i = 0; i < calibrationMeasurements.length; i++) {
    const measurement = calibrationMeasurements[i];

    if (measurement.type === CPS) {
      firstCPSTimestamp = firstCPSTimestamp ? firstCPSTimestamp :
        Number(measurement.timestamp);

      tempStymulus.startTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
      tempStymulus.stymulusType = measurement.stymulusType;
      tempStymulus.experimentId = experimentId;
      tempStymulus.x = Number(measurement.x);
      tempStymulus.y = Number(measurement.y);

    } else if (measurement.type === CPE) {

      tempStymulus.endTime = calculateTime(firstCPSTimestamp, measurement.timestamp);

      dataPerStymulus.push({
        measurements: Object.assign([], tempMeasurements),
        stymulus: Object.assign({}, tempStymulus),
      });

      tempStymulus = {};
      tempMeasurements = [];

    } else if (measurement.type === G) {

      tempMeasurements.push({
        isCalibration: 1,
        sessionId,
        timestamp: Number(measurement.timestamp),
        x: Number(measurement.x),
        y: Number(measurement.y),
      });
    }
  }
  return dataPerStymulus;
};

export const prepareStymulusForMeasurements = (
  experiment: Experiment,
  session: SessionData,
  experimentId: number,
  sessionId: number,
  images: Array<{
    fileName: string,
    link: string,
  }>,
): DataPerStymulus[] | undefined => {
  const sessionData = experiment.measurementsData.find(data => {
    return data.sessionId === session.id;
  });
  if (!sessionData) {
    return;
  }

  const measurements = sessionData.measurements.filter(d => d.type === G);
  const dataPerStymulus: DataPerStymulus[] = [];
  let firstCPSTimestamp = 0;
  let tempStymulus: any = {};
  let tempMeasurements = [];
  let previousImageName = "";

  for (let i = 0; i < measurements.length; i++) {
    const measurement = measurements[i];
    const tempImage = images.find((img) => img.fileName === measurement.imageFileName);

    if (previousImageName !== measurement.imageFileName || i === measurements.length - 1) {
      if (tempStymulus.startTime !== undefined) {
        tempStymulus.endTime = calculateTime(firstCPSTimestamp, measurement.timestamp);

        dataPerStymulus.push({
          measurements: Object.assign([], tempMeasurements),
          stymulus: Object.assign({}, tempStymulus),
        });

        tempStymulus = {};
        tempMeasurements = [];
      }
      previousImageName = measurement.imageFileName;
      firstCPSTimestamp = firstCPSTimestamp ? firstCPSTimestamp :
        Number(measurement.timestamp);

      tempStymulus.startTime = calculateTime(firstCPSTimestamp, measurement.timestamp);
      tempStymulus.stymulusType = measurement.stymulusType;
      tempStymulus.experimentId = experimentId;
      tempStymulus.link = tempImage ? tempImage.link : undefined;
    }
    tempMeasurements.push({
      isCalibration: 0,
      sessionId,
      timestamp: Number(measurement.timestamp),
      x: Number(measurement.x),
      y: Number(measurement.y),
    });
  }
  return dataPerStymulus;
}
