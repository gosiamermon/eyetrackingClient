import { SET_QUERY_RESPONSE } from './types';
import { Action } from '../../../shared/model';
import { Translator } from '../model';

const initialState: Translator = {
  response: null,
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_QUERY_RESPONSE:
      return { ...state, response: action.payload }
    default:
      return state;
  };
}
