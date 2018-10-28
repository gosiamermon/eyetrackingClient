import history from '../../../../../history';
import {
  Experiment,
  DataPerStymulus,
} from '../../../../shared/model';
import { mssqlClassicUrl } from '../../../../../config/apiurls';
import {
  prepareStymulusForCalibration,
  prepareMeasurements,
  prepareStymulusForMeasurements,
  prepareExperiment,
} from '../../../../../helpers/prepareData.mssql';
import { prepareSubjects, prepareSession } from '../../../../../helpers/prepareData.shared'
import {
  saveExperiment,
  saveStymulus,
} from '../../../../../helpers/saveData.mssql';
import {
  saveImagesToDisk,
  saveSession,
  saveSubject,
  saveMeasurements,
  saveAllExperiment,
} from '../../../../../helpers/saveData.shared';
import { ApiSession } from '../../../../shared/api.shared.model';

export const saveExperimentToMssqlClassic = async (experiment: Experiment) => {
  const savedExperiment = await saveExperiment(experiment);
  const savedImages = await saveImagesToDisk(mssqlClassicUrl, experiment.stymulus);

  const calibrationStymulusIds: number[] = [];
  const measurementsStymulusIds: number[] = [];

  /// tutaj zapisuje subject, robie unique z SubjectName w pliku i zapisuje unikalnych badanych
  /// zwracam tutaj zmapowaną nazwę użytkownika do userName z pliku.
  /// podczas tego zapisu sprawdzam czy takowy subject juz istnieje w bazie, jesli tak, to pobieram jego id

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
      savedImages,
      savedExperiment.id,
      savedSession.id,
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

export const saveExperimentInOneQueryToMssqlClassic = async (experiment: Experiment) => {
  const preparedExperiment = prepareExperiment(experiment);
  const savedImages = await saveImagesToDisk(mssqlClassicUrl, experiment.stymulus);

  const preparedSubjects = await prepareSubjects(experiment.sessionData);
  const preparedSessions: ApiSession[] = [];
  for (const session of experiment.sessionData) {

    const preparedSession = prepareSession(session);

    const calibrationPerStymulus: DataPerStymulus[] | undefined = prepareStymulusForCalibration(
      experiment,
      session,
    );

    if (!calibrationPerStymulus) {
      alert("Coundn't prepare calibration per stymulus!");
      return;
    }

    const measurementsPerStymulus: DataPerStymulus[] | undefined = prepareStymulusForMeasurements(
      experiment,
      session,
      savedImages
    );
    if (!measurementsPerStymulus) {
      alert("Coundn't prepare calibration per stymulus!");
      return;
    }

    preparedSession.calibrationPerStymulus = calibrationPerStymulus;
    preparedSession.measurementsPerStymulus = measurementsPerStymulus;
    preparedSessions.push(preparedSession);
  }
  preparedExperiment.subjects = preparedSubjects;
  preparedExperiment.sessions = preparedSessions;
  await saveAllExperiment(mssqlClassicUrl, preparedExperiment);
  history.push("/table");
};
