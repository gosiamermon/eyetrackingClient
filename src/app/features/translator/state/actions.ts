import { SET_QUERY_RESPONSE } from './types';
import { Store } from '../../../../store/model';
import {
  MSSQL_CLASSIC,
  CASSANDRA_CLASSIC,
  MONGO_CLASSIC,
  CASSANDRA_EXPERIMENT_BASED,
  MONGO_EXPERIMENT_BASED,
  CASSANDRA_SESSION_BASED,
  MONGO_SESSION_BASED,
} from '../../../../config/databases';
import {
  mssqlClassicUrl,
  cassandraClassicUrl,
  mongoClassicUrl,
  cassandraExperimentBasedUrl,
  mongoExperimentBasedUrl,
  cassandraSessionBasedUrl,
  mongoSessionBasedUrl,
} from '../../../../config/apiurls';

const executeQueryForDatabase = (query: string, url: string) => {
  return async (dispatch: any, getState: () => Store) => {
    let response;

    try {
      response = await fetch(`${url}queriesTranslator`, {
        body: JSON.stringify({ query }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
        mode: "cors",
      })
    } catch (e) {
      alert("Couldn't execute query!");
      return;
    }

    dispatch({
      payload: await response.json(),
      type: SET_QUERY_RESPONSE,
    });
  }
}

export const executeQuery = (query: string) => {
  return async (dispatch: any, getState: () => Store) => {
    const state = getState();
    const database = state.header.database;
    switch (database) {
      case MSSQL_CLASSIC:
        dispatch(executeQueryForDatabase(query, mssqlClassicUrl));
        break;
      case CASSANDRA_CLASSIC:
        dispatch(executeQueryForDatabase(query, cassandraClassicUrl));
        break;
      case MONGO_CLASSIC:
        dispatch(executeQueryForDatabase(query, mongoClassicUrl));
        break;
      case CASSANDRA_EXPERIMENT_BASED:
        dispatch(executeQueryForDatabase(query, cassandraExperimentBasedUrl));
        break;
      case MONGO_EXPERIMENT_BASED:
        dispatch(executeQueryForDatabase(query, mongoExperimentBasedUrl));
        break;
      case CASSANDRA_SESSION_BASED:
        dispatch(executeQueryForDatabase(query, cassandraSessionBasedUrl));
        break;
      case MONGO_SESSION_BASED:
        dispatch(executeQueryForDatabase(query, mongoSessionBasedUrl));
        break;
    }
  }
};