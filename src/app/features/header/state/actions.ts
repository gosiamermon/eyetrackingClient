import { SET_DATABASE } from './types';

export const setDatabase = (database: string) => {
  return {
    payload: database,
    type: SET_DATABASE,
  };
}
