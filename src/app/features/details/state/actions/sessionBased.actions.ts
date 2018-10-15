import { Store } from '../../../../../store/model';
import { GET_EXPERIMENT_SUCCESS } from '../types';
import {
  ApiResponseExperiment,
  ApiResponseSession,
  ApiResponseCassandraExperiment,
  ApiResponseCassandraSession,
} from '../../../../shared/api.shared.model';
import {
  cassandraSessionBasedUrl,
  mongoSessionBasedUrl,
} from '../../../../../config/apiurls';
import {
  getExperiment, getSessions,
} from '../../../../../helpers/getData.shared';
import {
  prepareCassandraExperiment,
  prepareCassandraSubject,
  prepareCassandraMeasurement,
  prepareCassandraStymulus,
  prepareCassandraSession,
} from '../../../../../helpers/prepareData.cassandra';

export const getExperimentFromCassandraSessionBased = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const cassandraExperiment: ApiResponseCassandraExperiment = await getExperiment(id, cassandraSessionBasedUrl);
    const experiment: ApiResponseExperiment = prepareCassandraExperiment(cassandraExperiment);
    if (cassandraExperiment.stymulus) {
      experiment.stymulus = cassandraExperiment.stymulus.map(s => prepareCassandraStymulus(s));
    }
    const cassandraSessions: ApiResponseCassandraSession[]
      = await getSessions(id, cassandraSessionBasedUrl);
    const sessions: ApiResponseSession[] = cassandraSessions.map(s => {
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

    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}

export const getExperimentFromMongoSessionBased = (
  id: string | number,
) => {
  return async (dispatch: any, getState: () => Store) => {
    const experiment: ApiResponseExperiment = await getExperiment(id, mongoSessionBasedUrl);
    const sessions: ApiResponseSession[] = await getSessions(id, mongoSessionBasedUrl);
    experiment.sessions = sessions;
    dispatch({
      payload: experiment,
      type: GET_EXPERIMENT_SUCCESS,
    });
  }
}
