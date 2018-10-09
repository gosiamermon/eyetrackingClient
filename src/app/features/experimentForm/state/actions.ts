import { Dispatch } from 'redux';
import { ADD_EXPERIMENT } from './types';
import { Experiment } from '../../../shared/interfaces';
import { Store } from '../../../../store/model';
// import {
//   MSSQL_CLASSIC,
//   CASSANDRA_CLASSIC,
//   MONGO_CLASSIC,
//   CASSANDRA_EXPERIMENT_BASED,
//   MONGO_EXPERIMENT_BASED,
//   CASSANDRA_SESSION_BASED,
//   MONGO_SESSION_BASED,
// } from '../../../../config/databases';
// import {
//   mssqlClassicUrl,
//   cassandraClassicUrl,
//   mongoClassicUrl,
//   CassandraExperimentBasedUrl,
//   MongoExperimentBasedUrl,
//   CassandraSessionBasedUrl,
//   MongoSessionBasedUrl,
// } from '../../../../config/apiurls';


export const addExperiment = (experiment: Experiment) =>
  (dispatch: Dispatch, getState: () => Store) => {
    const state = getState();
    const database = state.header.database;


  };
