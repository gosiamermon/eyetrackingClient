import history from '../../../../../history';
import { Experiment } from '../../../../shared/model';
import { ApiSubject } from '../../../../shared/api.shared.model';
import { ApiMeasurement, ApiSession, ApiExperiment } from '../../../../shared/api.sessionBased.model';
import { Store } from '../../../../../store/model';
import {
  prepareStymulusForCalibration,
  prepareStymulusForMeasurements,
  prepareSubject,
} from '../../../../../helpers/prepareData.shared';
import { prepareSession, prepareExperiment } from '../../../../../helpers/prepareData.sessionBased';
import { saveExperiment, saveSession } from '../../../../../helpers/saveData.sessionBased';
import { saveImagesToDisk } from '../../../../../helpers/saveData.shared';


export const saveExperimentToSessionBasedDatabase = (url: string, experiment: Experiment) => {
  return async (dispatch: any, getState: () => Store) => {

    const savedImages = await saveImagesToDisk(url, experiment.stymulus);
    const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
    const { apiStymulus, measurementsSet } =
      prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);

    const apiExperiment: ApiExperiment = prepareExperiment(experiment, apiStymulus);
    const savedExperiment = await saveExperiment(url, apiExperiment);

    for (const session of experiment.sessionData) {

      const apiSubject: ApiSubject = await prepareSubject(session);

      const currentCalibration = calibrationSet.find(calibration => calibration.sessionId === session.id);
      if (!currentCalibration) {
        alert("Couldn't save calibration measurements!");
        return;
      }
      const apiCalibration: ApiMeasurement[] = currentCalibration.measurements.map(m => {
        return {
          stymulusId: m.stymulusId,
          timestamp: m.timestamp,
          x: m.x,
          y: m.y,
        };
      });

      const currentMeasurements = measurementsSet.find(calibration => calibration.sessionId === session.id);
      if (!currentMeasurements) {
        alert("Couldn't save calibration measurements!");
        return;
      }
      const apiMeasurements: ApiMeasurement[] = currentMeasurements.measurements.map(m => {
        return {
          stymulusId: m.stymulusId,
          timestamp: m.timestamp,
          x: m.x,
          y: m.y,
        };
      });
      const apiSession: ApiSession = await prepareSession(
        session,
        apiSubject,
        apiMeasurements,
        apiCalibration,
        savedExperiment.id
      );
      await saveSession(url, apiSession);
    }
    history.push("/table");
  };
};