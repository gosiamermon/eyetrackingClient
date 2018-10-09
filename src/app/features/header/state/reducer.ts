import { SET_DATABASE } from './types';
import { Action } from '../../../shared/interfaces';
import { Header } from '../model';

const initialState: Header = {
  database: "MSSQL"
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_DATABASE:
      return { ...state, database: action.payload }
    default:
      return state;
  };
}
