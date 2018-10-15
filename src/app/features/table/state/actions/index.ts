import { Store } from '../../../../../store/model';
import {
  MSSQL_CLASSIC,
  CASSANDRA_CLASSIC,
  MONGO_CLASSIC,
  CASSANDRA_EXPERIMENT_BASED,
  MONGO_EXPERIMENT_BASED,
  CASSANDRA_SESSION_BASED,
  MONGO_SESSION_BASED,
} from '../../../../../config/databases';
import {
  cassandraClassicUrl,
  mongoClassicUrl,
  cassandraExperimentBasedUrl,
  mongoExperimentBasedUrl,
  cassandraSessionBasedUrl,
  mongoSessionBasedUrl,
  mssqlClassicUrl,
} from '../../../../../config/apiurls';
import { getExperimentsData } from './shared.actions';
import { prepareExperimentsFromCassandra } from '../../../../../helpers/prepareData.shared';

export const getExperiments = () => {
  return async (dispatch: any, getState: () => Store) => {
    const state = getState();
    const database = state.header.database;

    switch (database) {
      case MSSQL_CLASSIC:
        dispatch(getExperimentsData(mssqlClassicUrl));
        break;
      case CASSANDRA_CLASSIC:
        dispatch(getExperimentsData(cassandraClassicUrl, prepareExperimentsFromCassandra));
        break;
      case MONGO_CLASSIC:
        dispatch(getExperimentsData(mongoClassicUrl));
        break;
      case CASSANDRA_EXPERIMENT_BASED:
        dispatch(getExperimentsData(cassandraExperimentBasedUrl, prepareExperimentsFromCassandra));
        break;
      case MONGO_EXPERIMENT_BASED:
        dispatch(getExperimentsData(mongoExperimentBasedUrl));
        break;
      case CASSANDRA_SESSION_BASED:
        dispatch(getExperimentsData(cassandraSessionBasedUrl, prepareExperimentsFromCassandra));
        break;
      case MONGO_SESSION_BASED:
        dispatch(getExperimentsData(mongoSessionBasedUrl));
        break;
    }
  }
};