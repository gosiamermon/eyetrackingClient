import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { Store } from '../../../store/model';
import { Experiment } from './model';
import { getExperiments } from './state/actions';
import { getExperiment, get10TimesFromAllDatabases } from '../details/state/actions';
import history from '../../../history';
import './table.css';

interface Props {
  getExperiments: () => void;
  getExperiment: (id: string | number) => void;
  get10TimesFromAllDatabases: () => void;
  experiments: Experiment[];
}

class Table extends React.Component<Props> {
  public componentWillMount() {
    this.props.getExperiments();
  }

  public render() {
    const columns = this.prepareColumns();
    const { experiments } = this.props;
    return (
      <div className="table-container">
        <Button onClick={this.get10TimesFromAllDatabases}>Pobierz z wszystkich baz 10 razy</Button>
        <Link className="table__link" to={"/form"}>Nowy eksperyment</Link>
        <ReactTable columns={columns} data={experiments} />
      </div>
    );
  };

  private get10TimesFromAllDatabases = () => {
    this.props.get10TimesFromAllDatabases();
  }


  private showDetails = (id: string | number) => {
    this.props.getExperiment(id);
    history.push("/details");
  }

  private prepareColumns() {
    const columns = [
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
      },
      {
        Header: "Start date",
        accessor: (e: Experiment) => moment(e.startDate).format('YYYY-MM-DD'),
        filterable: true,
        id: "startDate",
      },
      {
        Header: "End date",
        accessor: (e: Experiment) => moment(e.endDate).format('YYYY-MM-DD'),
        filterable: true,
        id: "endDate",
      },
      {
        Cell: (row: any) => {
          return (
            <div className="text-center">
              <button
                className="btn btn-info"
                onClick={this.showDetails.bind(this, row.value)}
              >
                details
              </button>
            </div>
          )
        },
        Header: "Details",
        accessor: "id",
        filterable: false,
      }
    ]
    return columns;
  }
}

const mapStateToProps = (state: Store) => ({
  experiments: state.table.experiments,
});

const mapDispatchToProps = {
  get10TimesFromAllDatabases,
  getExperiment,
  getExperiments,
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);

