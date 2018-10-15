import * as React from 'react';
import { connect } from 'react-redux';
import { Input, Label } from 'reactstrap';
import { setDatabase } from '../../state/actions';
import { getExperiments } from '../../../table/state/actions';
import { databases } from '../../../../../config/databases';
import './databaseSelect.css';

interface Props {
  database: string;
  setDatabase: (database: string) => void;
  getExperiments: () => void;
}

interface State {
  dropdownOpen: boolean;
}

class DatabaseSelect extends React.Component<Props, State> {

  public render() {
    return (
      <div className="header__select">
        <Label className="header__select-label" for="database-type">Baza danych</Label>
        <Input onChange={this.onSelect} className="header__input" type="select" name="select" id="database-type">
          <option disabled={true}>Select</option>
          {
            databases.map((base, index) => (
              <option key={index}>{base}</option>
            ))
          }
        </Input>
      </div>
    )
  }

  private onSelect = (e: any) => {
    this.props.setDatabase(e.target.value);
    this.props.getExperiments();
  }
}

const mapDispatchToProps = {
  getExperiments,
  setDatabase,
}

const mapStateToProps = (state: any) => ({
  database: state.header.database,
})

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseSelect);
