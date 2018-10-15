// import { ADD_EXPERIMENT } from './types';
import { Experiment } from '../../../../shared/model';
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
import { saveExperimentToMssqlClassic } from './mssql.classic.actions';
import { saveExperimentToClassicDatabase } from './shared.classic.actions';
import { saveExperimentToExperimentBasedDatabase } from './shared.experimentBased.actions';
import { saveExperimentToSessionBasedDatabase } from './shared.sessionBased.actions';
import {
  cassandraClassicUrl,
  mongoClassicUrl,
  cassandraExperimentBasedUrl,
  mongoExperimentBasedUrl,
  cassandraSessionBasedUrl,
  mongoSessionBasedUrl,
} from '../../../../../config/apiurls';


export const addExperiment = (experiment: Experiment) => {
  return async (dispatch: any, getState: () => Store) => {
    const state = getState();
    const database = state.header.database;

    switch (database) {
      case MSSQL_CLASSIC:
        dispatch(saveExperimentToMssqlClassic(experiment));
        break;
      case CASSANDRA_CLASSIC:
        dispatch(saveExperimentToClassicDatabase(cassandraClassicUrl, experiment));
        break;
      case MONGO_CLASSIC:
        dispatch(saveExperimentToClassicDatabase(mongoClassicUrl, experiment));
        break;
      case CASSANDRA_EXPERIMENT_BASED:
        dispatch(saveExperimentToExperimentBasedDatabase(cassandraExperimentBasedUrl, experiment));
        break;
      case MONGO_EXPERIMENT_BASED:
        dispatch(saveExperimentToExperimentBasedDatabase(mongoExperimentBasedUrl, experiment));
        break;
      case CASSANDRA_SESSION_BASED:
        dispatch(saveExperimentToSessionBasedDatabase(cassandraSessionBasedUrl, experiment));
        break;
      case MONGO_SESSION_BASED:
        dispatch(saveExperimentToSessionBasedDatabase(mongoSessionBasedUrl, experiment));
        break;
    }
  }
};
