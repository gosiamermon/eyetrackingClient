import { SET_DATABASE } from './types';
import { MSSQL_CLASSIC } from '../../../../config/databases';
import { Action } from '../../../shared/model';
import { Header } from '../model';

const initialState: Header = {
  database: MSSQL_CLASSIC,
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_DATABASE:
      return { ...state, database: action.payload }
    default:
      return state;
  };
}
