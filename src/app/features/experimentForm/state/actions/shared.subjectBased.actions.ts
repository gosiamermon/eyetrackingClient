import history from '../../../../../history';
import { Experiment } from '../../../../shared/model';
import {
  ApiMeasurement,
  ApiSession,
  ApiSubject,
} from '../../../../shared/api.subjectBased.model';
import {
  prepareStymulusForCalibration,
  prepareStymulusForMeasurements,
} from '../../../../../helpers/prepareData.shared';
import {
  prepareSubjects,
  prepareSession
} from '../../../../../helpers/prepareData.subjectBased';
import { saveImagesToDisk } from '../../../../../helpers/saveData.shared';
import { saveExperiment } from '../../../../../helpers/saveData.subjectBased';


export const saveExperimentToSubjectBasedDatabase = async (url: string, experiment: Experiment) => {

  const savedImages = await saveImagesToDisk(url, experiment.stymulus);

  const { apiCalibrationStymulus, calibrationSet } = prepareStymulusForCalibration(experiment);
  const { apiStymulus, measurementsSet } =
    prepareStymulusForMeasurements(apiCalibrationStymulus, experiment, savedImages);

  const apiSubjects: ApiSubject[] = prepareSubjects(experiment, apiStymulus);
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

    const apiSession: ApiSession = await prepareSession(
      session,
      apiMeasurements,
      apiCalibration,
    );

    const subject = apiSubjects.find(s => s.name === session.subjectName);
    if (!subject) {
      alert(`No subject name like ${session.subjectName}`)
      return;
    }
    subject.experiment.sessions.push(apiSession);
  }
  await saveExperiment(url, apiSubjects);
  history.push("/table");
};