import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import App from './app/App';
import './index.css';
import configureStore from './store/configureStore';
import history from './history';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
