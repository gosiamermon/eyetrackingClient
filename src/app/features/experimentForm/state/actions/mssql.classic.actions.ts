import history from '../../../../../history';
import {
  Experiment,
  DataPerStymulus,
} from '../../../../shared/model';
import { mssqlClassicUrl } from '../../../../../config/apiurls';
import { Store } from '../../../../../store/model';
import {
  prepareStymulusForCalibration,
  prepareMeasurements,
  prepareStymulusForMeasurements,
} from '../../../../../helpers/prepareData.mssql';
import {
  saveExperiment,
  saveStymulus,
} from '../../../../../helpers/saveData.mssql';
import {
  saveImagesToDisk,
  saveSession,
  saveSubject,
  saveMeasurements,
} from '../../../../../helpers/saveData.shared';

export const saveExperimentToMssqlClassic = (experiment: Experiment) => {
  return async (dispatch: any, getState: () => Store) => {
    const savedExperiment = await saveExperiment(experiment);
    const savedImages = await saveImagesToDisk(mssqlClassicUrl, experiment.stymulus);

    const calibrationStymulusIds: number[] = [];
    const measurementsStymulusIds: number[] = [];

    for (const session of experiment.sessionData) {

      const savedSubject = await saveSubject(mssqlClassicUrl, session);
      const savedSession = await saveSession(mssqlClassicUrl, session, savedExperiment.id, savedSubject.id);

      const calibrationPerStymulus: DataPerStymulus[] | undefined = prepareStymulusForCalibration(
        experiment,
        session,
        savedExperiment.id,
        savedSession.id,
      );
      if (!calibrationPerStymulus) {
        alert("Coundn't prepare calibration per stymulus!");
        return;
      }

      let shouldSaveStymulus = false;
      if (!calibrationStymulusIds.length) {
        shouldSaveStymulus = true;
      }

      for (const data of calibrationPerStymulus) {
        if (shouldSaveStymulus) {
          const apiStymulus = data.stymulus;
          const savedStymulus = await saveStymulus(apiStymulus);

          calibrationStymulusIds.push(savedStymulus.id);
        }
        const index = calibrationPerStymulus.indexOf(data);
        const apiCalibration = prepareMeasurements(data, calibrationStymulusIds[index]);
        await saveMeasurements(mssqlClassicUrl, apiCalibration);
      }

      const measurementsPerStymulus: DataPerStymulus[] | undefined = prepareStymulusForMeasurements(
        experiment,
        session,
        savedExperiment.id,
        savedSession.id,
        savedImages
      );
      if (!measurementsPerStymulus) {
        alert("Coundn't prepare calibration per stymulus!");
        return;
      }

      shouldSaveStymulus = false;
      if (!measurementsStymulusIds.length) {
        shouldSaveStymulus = true;
      }

      for (const data of measurementsPerStymulus) {
        if (shouldSaveStymulus) {
          const apiStymulus = data.stymulus;

          const savedStymulus = await saveStymulus(apiStymulus);

          measurementsStymulusIds.push(savedStymulus.id);
        }
        const index = measurementsPerStymulus.indexOf(data);
        const apiMeasurements = prepareMeasurements(data, measurementsStymulusIds[index]);
        await saveMeasurements(mssqlClassicUrl, apiMeasurements);
      }
    }
    history.push("/table");
  };
};
