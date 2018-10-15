import history from '../../../../../history';
import {
  Experiment,
} from '../../../../shared/model';
import { ApiMeasurement } from '../../../../shared/api.shared.model';
import { Store } from '../../../../../store/model';
import {
  prepareStymulusForCalibration,
  prepareStymulusForMeasurements,
} from '../../../../../helpers/prepareData.shared';
import {
  saveImagesToDisk,
  saveSubject,
  saveSession,
  saveExperiment,
  saveMeasurements,
} from '../../../../../helpers/saveData.shared';


export const saveExperimentToClassicDatabase = (url: string, experiment: Experiment) => {
  return async (dispatch: any, getState: () => Store) => {

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
};
