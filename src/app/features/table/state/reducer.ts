import { GET_EXPERIMENTS_SUCCESS } from './types';
import { Action } from '../../../shared/model';
import { Table } from '../model';

const initialState: Table = {
  experiments: [],
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case GET_EXPERIMENTS_SUCCESS:
      return { ...state, experiments: action.payload }
    default:
      return state;
  };
}
