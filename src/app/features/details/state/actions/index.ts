import { Store } from '../../../../../store/model';
import {
  MSSQL_CLASSIC,
  CASSANDRA_CLASSIC,
  MONGO_CLASSIC,
  CASSANDRA_EXPERIMENT_BASED,
  MONGO_EXPERIMENT_BASED,
  MONGO_SESSION_BASED,
  CASSANDRA_SESSION_BASED,
} from '../../../../../config/databases';
import {
  getExperimentFromMssql,
  getExperimentFromCassandraClassic,
  getExperimentFromMongoClassic,
} from './classic.actions';
import {
  getExperimentFromCassandraExperimentBased,
  getExperimentFromMongoExperimentBased
} from './experimentBased.actions';
import {
  getExperimentFromMongoSessionBased,
  getExperimentFromCassandraSessionBased,
} from './sessionBased.actions';

export const getExperiment = (id: string | number) => {
  return async (dispatch: any, getState: () => Store) => {
    const state = getState();
    const database = state.header.database;
    switch (database) {
      case MSSQL_CLASSIC:
        dispatch(getExperimentFromMssql(id));
        break;
      case CASSANDRA_CLASSIC:
        dispatch(getExperimentFromCassandraClassic(id));
        break;
      case MONGO_CLASSIC:
        dispatch(getExperimentFromMongoClassic(id));
        break;
      case CASSANDRA_EXPERIMENT_BASED:
        dispatch(getExperimentFromCassandraExperimentBased(id));
        break;
      case MONGO_EXPERIMENT_BASED:
        dispatch(getExperimentFromMongoExperimentBased(id));
        break;
      case CASSANDRA_SESSION_BASED:
        dispatch(getExperimentFromCassandraSessionBased(id));
        break;
      case MONGO_SESSION_BASED:
        dispatch(getExperimentFromMongoSessionBased(id));
        break;
    }
  }
};