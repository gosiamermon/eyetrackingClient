import { combineReducers } from 'redux';
import Header from '../app/features/header/state/reducer';

const rootReducer = combineReducers({
  header: Header,
});

export default rootReducer;
