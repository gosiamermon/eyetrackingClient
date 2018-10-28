import history from '../../../../../history';
import {
  Experiment,
} from '../../../../shared/model';
import { ApiMeasurement, ApiSession } from '../../../../shared/api.shared.model';
import {
  prepareStymulusForCalibration,
  prepareStymulusForMeasurements,
  prepareExperiment,
  prepareSubjects,
  prepareSession
} from '../../../../../helpers/prepareData.shared';
import {
  saveImagesToDisk,
  saveSubject,
  saveSession,
  saveExperiment,
  saveMeasurements,
  saveAllExperiment,
} from '../../../../../helpers/saveData.shared';


export const saveExperimentToClassicDatabase = async (url: string, experiment: Experiment) => {
  const savedImages = await saveImagesToDisk(url, experiment.stymulus);
  const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
  const { apiStymulus, measurementsSet } =
    prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);
  const savedExperiment = await saveExperiment(url, experiment, apiStymulus);

  for (const session of experiment.sessionData) {

    const savedSubject = await saveSubject(url, session);
    const savedSession = await saveSession(url, session, savedExperiment.id, savedSubject.id);

    const currentCalibration = calibrationSet.find(calibration => calibration.sessionId === session.id);
    if (!currentCalibration) {
      alert("Couldn't save calibration measurements!");
      return;
    }
    const apiCalibration: ApiMeasurement[] = currentCalibration.measurements.map(m => {
      return {
        isCalibration: m.isCalibration,
        sessionId: savedSession.id,
        stymulusId: m.stymulusId,
        timestamp: m.timestamp,
        x: m.x,
        y: m.y,
      };
    });
    await saveMeasurements(url, apiCalibration);

    const currentMeasurements = measurementsSet.find(calibration => calibration.sessionId === session.id);
    if (!currentMeasurements) {
      alert("Couldn't save calibration measurements!");
      return;
    }
    const apiMeasurements: ApiMeasurement[] = currentMeasurements.measurements.map(m => {
      return {
        isCalibration: m.isCalibration,
        sessionId: savedSession.id,
        stymulusId: m.stymulusId,
        timestamp: m.timestamp,
        x: m.x,
        y: m.y,
      };
    });
    await saveMeasurements(url, apiMeasurements);
  }
  history.push("/table");
};

export const saveExperimentInOneQueryToClassicDatabase = async (url: string, experiment: Experiment) => {

  const savedImages = await saveImagesToDisk(url, experiment.stymulus);
  const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
  const { apiStymulus, measurementsSet } =
    prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);
  const preparedExperiment = await prepareExperiment(experiment, apiStymulus);

  const preparedSubjects = await prepareSubjects(experiment.sessionData);
  const preparedSessions: ApiSession[] = [];

  for (const session of experiment.sessionData) {

    const preparedSession = prepareSession(session);

    const currentCalibration = calibrationSet.find(calibration => calibration.sessionId === session.id);
    if (!currentCalibration) {
      alert("Couldn't save calibration measurements!");
      return;
    }
    preparedSession.calibration = currentCalibration.measurements;

    const currentMeasurements = measurementsSet.find(calibration => calibration.sessionId === session.id);
    if (!currentMeasurements) {
      alert("Couldn't save calibration measurements!");
      return;
    }
    preparedSession.measurements = currentMeasurements.measurements;
    preparedSessions.push(preparedSession);
  }
  preparedExperiment.subjects = preparedSubjects;
  preparedExperiment.sessions = preparedSessions;
  await saveAllExperiment(url, preparedExperiment);
  history.push("/table");
};