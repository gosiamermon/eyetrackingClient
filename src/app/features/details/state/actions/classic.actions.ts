import { Store } from '../../../../../store/model';
import { GET_EXPERIMENT_SUCCESS } from '../types';
import {
  ApiResponseExperiment,
  ApiResponseSession,
  ApiResponseMeasurement,
  ApiResponseCassandraExperiment,
  ApiResponseCassandraSession,
  ApiResponseCassandraSubject,
  ApiResponseCassandraMeasurement,
} from '../../../../shared/api.shared.model';
import {
  mssqlClassicUrl,
  cassandraClassicUrl,
  mongoClassicUrl,
} from '../../../../../config/apiurls';
import {
  getExperiment,
  getSessions,
  getMeasurements,
  getSubject,
} from '../../../../../helpers/getData.shared';
import {
  prepareCassandraExperiment,
  prepareCassandraSession,
  prepareCassandraSubject,
  prepareCassandraMeasurement,
  prepareCassandraStymulus,
} from '../../../../../helpers/prepareData.cassandra';

export const getExperimentFromMssql = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const experiment: ApiResponseExperiment = await getExperiment(id, mssqlClassicUrl);
    const sessions: ApiResponseSession[] = await getSessions(experiment.id, mssqlClassicUrl);
    for (const session of sessions) {
      const measurements: ApiResponseMeasurement[] = await getMeasurements(session.id, mssqlClassicUrl);
      session.measurements = measurements.filter(m => !m.isCalibration);
      session.calibration = measurements.filter(m => m.isCalibration);

      const subject: any = {
        age: session.subjectAge,
        educationLevel: session.subjectEducationLevel,
        sex: session.subjectSex,
        visionDefect: session.subjectVisionDefect,
      }

      session.subject = subject;
      delete session.subjectAge;
      delete session.subjectEducationLevel;
      delete session.subjectSex;
      delete session.subjectVisionDefect;
    }
    experiment.sessions = sessions;

    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}

export const getExperimentFromCassandraClassic = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const cassandraExperiment: ApiResponseCassandraExperiment = await getExperiment(id, cassandraClassicUrl);
    const experiment: ApiResponseExperiment = prepareCassandraExperiment(cassandraExperiment);
    if (cassandraExperiment.stymulus) {
      experiment.stymulus = cassandraExperiment.stymulus.map(s => prepareCassandraStymulus(s));
    }
    const cassandraSessions: ApiResponseCassandraSession[] = await getSessions(experiment.id, cassandraClassicUrl);
    const sessions: ApiResponseSession[] = cassandraSessions.map(s => prepareCassandraSession(s));
    for (const session of sessions) {
      const cassandraMeasurements: ApiResponseCassandraMeasurement[]
        = await getMeasurements(session.id, cassandraClassicUrl);
      const measurements: ApiResponseMeasurement[] = cassandraMeasurements.map(m => prepareCassandraMeasurement(m));
      session.measurements = measurements.filter(m => !m.isCalibration);
      session.calibration = measurements.filter(m => m.isCalibration);

      if (session.subjectId) {
        const cassandraSubject: ApiResponseCassandraSubject = await getSubject(session.subjectId, cassandraClassicUrl);
        const subject = prepareCassandraSubject(cassandraSubject);
        session.subject = subject;
      }
    }
    experiment.sessions = sessions;
    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}

export const getExperimentFromMongoClassic = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const experiment: ApiResponseExperiment = await getExperiment(id, mongoClassicUrl);
    const sessions: ApiResponseSession[] = await getSessions(experiment.id, mongoClassicUrl);
    for (const session of sessions) {
      const measurements: ApiResponseMeasurement[] = await getMeasurements(session.id, mongoClassicUrl);
      session.measurements = measurements.filter(m => !m.isCalibration);
      session.calibration = measurements.filter(m => m.isCalibration);
    }
    experiment.sessions = sessions;
    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}