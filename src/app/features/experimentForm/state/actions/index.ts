// import { ADD_EXPERIMENT } from './types';
import { Experiment } from '../../../../shared/model';
import { Store } from '../../../../../store/model';
import {
  MSSQL_CLASSIC,
  CASSANDRA_CLASSIC,
  MONGO_CLASSIC,
  CASSANDRA_EXPERIMENT_BASED,
  MONGO_EXPERIMENT_BASED,
  CASSANDRA_SUBJECT_BASED,
  MONGO_SUBJECT_BASED,
  databases,
} from '../../../../../config/databases';
import { saveExperimentInOneQueryToMssqlClassic } from './mssql.classic.actions';
import { saveExperimentInOneQueryToClassicDatabase } from './shared.classic.actions';
import {
  saveExperimentToExperimentBasedCassandra,
  saveExperimentToExperimentBasedMongo
} from './shared.experimentBased.actions';
import { saveExperimentToSubjectBasedDatabase } from './shared.subjectBased.actions';
import {
  cassandraClassicUrl,
  mongoClassicUrl,
  cassandraExperimentBasedUrl,
  mongoExperimentBasedUrl,
  cassandraSubjectBasedUrl,
  mongoSubjectBasedUrl,
} from '../../../../../config/apiurls';


export const saveExperiment10Times = (experiment: Experiment) => {
  return async (dispatch: any, getState: () => Store) => {
    for (const database of databases) {
      for (let i = 0; i < 10; i++) {
        switch (database) {
          // case MSSQL_CLASSIC:
          //   await saveExperimentInOneQueryToMssqlClassic(experiment);
          //   break;
          case CASSANDRA_CLASSIC:
            await saveExperimentInOneQueryToClassicDatabase(cassandraClassicUrl, experiment);
            break;
          case MONGO_CLASSIC:
            await saveExperimentInOneQueryToClassicDatabase(mongoClassicUrl, experiment);
            break;
          // case CASSANDRA_EXPERIMENT_BASED:
          //   await saveExperimentToExperimentBasedCassandra(cassandraExperimentBasedUrl, experiment);
          //   break;
          // case MONGO_EXPERIMENT_BASED:
          //   await saveExperimentToExperimentBasedMongo(mongoExperimentBasedUrl, experiment);
          //   break;
          // case CASSANDRA_SUBJECT_BASED:
          //   await saveExperimentToSubjectBasedDatabase(cassandraSubjectBasedUrl, experiment);
          //   break;
          // case MONGO_SUBJECT_BASED:
          //   await saveExperimentToSubjectBasedDatabase(mongoSubjectBasedUrl, experiment);
          //   break;
        }
        console.log(`How many times? ${i + 1}`);
      }
    }
  }
}

export const addExperiment = (experiment: Experiment, db: string | null = null) => {
  return async (dispatch: any, getState: () => Store) => {
    const state = getState();
    const database = db ? db : state.header.database;

    switch (database) {
      case MSSQL_CLASSIC:
        await saveExperimentInOneQueryToMssqlClassic(experiment);
        break;
      case CASSANDRA_CLASSIC:
        await saveExperimentInOneQueryToClassicDatabase(cassandraClassicUrl, experiment);
        break;
      case MONGO_CLASSIC:
        await saveExperimentInOneQueryToClassicDatabase(mongoClassicUrl, experiment);
        break;
      case CASSANDRA_EXPERIMENT_BASED:
        await saveExperimentToExperimentBasedCassandra(cassandraExperimentBasedUrl, experiment);
        break;
      case MONGO_EXPERIMENT_BASED:
        await saveExperimentToExperimentBasedMongo(mongoExperimentBasedUrl, experiment);
        break;
      case CASSANDRA_SUBJECT_BASED:
        await saveExperimentToSubjectBasedDatabase(cassandraSubjectBasedUrl, experiment);
        break;
      case MONGO_SUBJECT_BASED:
        await saveExperimentToSubjectBasedDatabase(mongoSubjectBasedUrl, experiment);
        break;
    }
  }
};
