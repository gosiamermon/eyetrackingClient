import history from '../../../../../history';
import { Experiment } from '../../../../shared/model';
import { ApiSubject } from '../../../../shared/api.shared.model';
import { ApiMeasurement, ApiSession, ApiExperiment, ApiMongoExperiment, ApiMongoSubject } from '../../../../shared/api.experimentBased.model';
import {
  prepareStymulusForCalibration,
  prepareStymulusForMeasurements,
  prepareSubjects,
  prepareMongoSubjects,
} from '../../../../../helpers/prepareData.shared';
import { prepareSession, prepareExperiment, prepareMongoSession, prepareMongoExperiment } from '../../../../../helpers/prepareData.experimentBased';
import { saveExperiment } from '../../../../../helpers/saveData.experimentBased';
import { saveImagesToDisk } from '../../../../../helpers/saveData.shared';


export const saveExperimentToExperimentBasedCassandra = async (url: string, experiment: Experiment) => {
  const savedImages = await saveImagesToDisk(url, experiment.stymulus);
  const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
  const { apiStymulus, measurementsSet } =
    prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);

  const sessions: ApiSession[] = [];

  const apiSubjects: ApiSubject[] = prepareSubjects(experiment.sessionData);
  for (const session of experiment.sessionData) {

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
    const subject = apiSubjects.find(s => s.name === session.subjectName);
    if (!subject) {
      alert("The name of the subject in the session_data file didn't match any name in measurements file!");
      return;
    }
    const apiSession: ApiSession = await prepareSession(
      session,
      subject,
      apiMeasurements,
      apiCalibration,
    );
    sessions.push(apiSession);
  }
  const apiExperiment: ApiExperiment = prepareExperiment(experiment, apiStymulus, sessions, apiSubjects);
  await saveExperiment(url, apiExperiment);
  history.push("/table");
};


export const saveExperimentToExperimentBasedMongo = async (url: string, experiment: Experiment) => {

  const savedImages = await saveImagesToDisk(url, experiment.stymulus);
  const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
  const { apiStymulus, measurementsSet } =
    prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);

  const apiSubjects: ApiMongoSubject[] = prepareMongoSubjects(experiment.sessionData);
  for (const session of experiment.sessionData) {

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

    const apiSession: ApiSession = await prepareMongoSession(
      session,
      apiMeasurements,
      apiCalibration,
    );

    const subject = apiSubjects.find(s => s.name === session.subjectName);
    if (!subject) {
      alert(`No subject name like ${session.subjectName}`)
      return;
    }
    subject.sessions.push(apiSession)
  }
  const apiExperiment: ApiMongoExperiment = prepareMongoExperiment(experiment, apiStymulus, apiSubjects);
  await saveExperiment(url, apiExperiment);
  history.push("/table");
};