import * as React from 'react';
import './App.css';
import Header from './features/header/header';
import ContentContainer from './shared/components/contentContainer/contentContainer';
import ExperimentForm from './features/experimentForm/experimentForm';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <ContentContainer>
          <ExperimentForm />
        </ContentContainer>
      </div>
    );
  }
}

export default App;
