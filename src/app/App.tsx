import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import './App.css';
import Header from './features/header/header';
import ContentContainer from './shared/components/contentContainer/contentContainer';
import ExperimentForm from './features/experimentForm/experimentForm';
import Table from './features/table/table';
import Details from './features/details/details';
import 'react-table/react-table.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <ContentContainer>
          <Switch>
            <Route path="/form" component={ExperimentForm} />
            <Route path="/table" component={Table} />
            <Route path="/details" component={Details} />
            <Redirect from={'/'} to={"/table"} />
          </Switch>
        </ContentContainer>
      </div>
    );
  }
}

export default App;
