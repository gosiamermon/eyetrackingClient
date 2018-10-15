import { GET_EXPERIMENT_SUCCESS } from './types';
import { Action } from '../../../shared/model';
import { Details } from '../model';

const initialState: Details = {
  experiment: {
    endDate: "",
    id: 0,
    name: "",
    sessions: [],
    startDate: "",
    stymulus: [],
  },
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case GET_EXPERIMENT_SUCCESS:
      return { ...state, experiment: action.payload }
    default:
      return state;
  };
}
