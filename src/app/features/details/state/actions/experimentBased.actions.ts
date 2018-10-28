import { Store } from '../../../../../store/model';
import { GET_EXPERIMENT_SUCCESS } from '../types';
import {
  ApiResponseExperiment,
  ApiResponseSession,
  ApiResponseCassandraExperiment,
} from '../../../../shared/api.shared.model';
import { ApiResponseMongoExperiment } from '../../../../shared/api.experimentBased.model';
import {
  cassandraExperimentBasedUrl,
  mongoExperimentBasedUrl
} from '../../../../../config/apiurls';
import {
  getExperiment,
} from '../../../../../helpers/getData.shared';
import {
  prepareCassandraExperiment,
  prepareCassandraSubject,
  prepareCassandraMeasurement,
  prepareCassandraStymulus,
  prepareCassandraSession,
} from '../../../../../helpers/prepareData.cassandra';

export const getExperimentFromCassandraExperimentBased = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const cassandraExperiment: ApiResponseCassandraExperiment = await getExperiment(id, cassandraExperimentBasedUrl);
    const experiment: ApiResponseExperiment = prepareCassandraExperiment(cassandraExperiment);
    if (cassandraExperiment.stymulus) {
      experiment.stymulus = cassandraExperiment.stymulus.map(s => prepareCassandraStymulus(s));
    }
    if (cassandraExperiment.sessions) {
      const sessions: ApiResponseSession[] = cassandraExperiment.sessions.map(s => {
        const preparedSession: ApiResponseSession = prepareCassandraSession(s)
        if (s.subject) {
          preparedSession.subject = prepareCassandraSubject(s.subject);
        }
        if (s.measurements && s.measurements.length) {
          preparedSession.measurements = s.measurements.map((m) => prepareCassandraMeasurement(m));
        }
        if (s.calibration && s.calibration.length) {
          preparedSession.calibration = s.calibration.map((m) => prepareCassandraMeasurement(m));
        }
        return preparedSession;
      });
      experiment.sessions = sessions;
    }
    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}

export const getExperimentFromMongoExperimentBased = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const experiment: ApiResponseMongoExperiment = await getExperiment(id, mongoExperimentBasedUrl);
    let sessions: ApiResponseSession[] = [];
    experiment.subjects.forEach(subject => {
      const subjectSessions = subject.sessions.map(session => {
        session.subject = {
          age: subject.age,
          educationLevel: subject.educationLevel,
          name: subject.name,
          sex: subject.sex,
          visionDefect: subject.visionDefect
        }
        return session;
      });
      sessions = [...sessions, ...subjectSessions]
    });
    const preparedExperiment: ApiResponseExperiment = {
      endDate: experiment.endDate,
      id: experiment.id,
      name: experiment.name,
      sessions,
      startDate: experiment.startDate,
      stymulus: experiment.stymulus,
    }
    dispatch({
      payload: preparedExperiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}
