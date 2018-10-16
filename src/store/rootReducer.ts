import { combineReducers } from 'redux';
import Header from '../app/features/header/state/reducer';
import Table from '../app/features/table/state/reducer';
import Details from '../app/features/details/state/reducer';
import Translator from '../app/features/translator/state/reducer';

const rootReducer = combineReducers({
  details: Details,
  header: Header,
  table: Table,
  translator: Translator,
});

export default rootReducer;
