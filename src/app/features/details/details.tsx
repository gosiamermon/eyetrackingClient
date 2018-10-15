import * as React from 'react';
import * as moment from 'moment';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Legend } from 'recharts';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { Store } from '../../../store/model';
import { Experiment, Session } from './model';
import './details.css';

interface Props {
  experiment: Experiment;
}

interface State {
  currentSessionId: string | number | null;
}

class Details extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentSessionId: null,
    }
  }

  public render() {
    const columns = this.prepareColumns();
    const { experiment } = this.props;
    const { currentSessionId } = this.state;
    let currentSession: Session | undefined;
    if (experiment.sessions) {
      experiment.sessions.map((session, index) => {
        session.id = session.id ? session.id : index;
      });
      currentSession = experiment.sessions.find(s => s.id === currentSessionId);
      if (currentSession) {
        this.prepareMeasurementsToDisplay(currentSession);
      }
    }
    return (
      <div className="details-container">
        <div className="details__table-container">
          <Link className="details__back-link" to={"/table"}>Lista eksperymentów</Link>
          <ReactTable columns={columns} data={experiment.sessions} />
        </div>
        {currentSession &&
          <div className="charts">
            <span className="chart-title">Calibration measurements</span>
            <LineChart width={500} height={300} data={currentSession.calibration}>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Legend verticalAlign="top" height={36} />
              <Line name="X" type="monotone" dataKey="x" stroke="#8884d8" />
              <Line name="Y" type="monotone" dataKey="y" stroke="#82ca9d" />
            </LineChart>
            <span className="chart-title">Study measurements</span>
            <LineChart width={500} height={300} data={currentSession.measurements}>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Legend verticalAlign="top" height={36} />
              <Line name="X" type="monotone" dataKey="x" stroke="#8884d8" />
              <Line name="Y" type="monotone" dataKey="y" stroke="#82ca9d" />
            </LineChart>
          </div>
        }
      </div>
    );
  }

  private prepareMeasurementsToDisplay(currentSession: Session) {
    currentSession.measurements = currentSession.measurements.map(m => {
      m.timestamp = moment(m.timestamp).valueOf();
      return m;
    });
    currentSession.calibration = currentSession.calibration.map(m => {
      m.timestamp = moment(m.timestamp).valueOf();
      return m;
    });
    currentSession.measurements[0].time = 0;
    currentSession.calibration[0].time = 0;
    for (let i = 1; i < currentSession.measurements.length; i++) {
      const measurement = currentSession.measurements[i];
      measurement.time = (measurement.timestamp - currentSession.measurements[0].timestamp) / 1000;
    }
    for (let i = 1; i < currentSession.calibration.length; i++) {
      const calibration = currentSession.calibration[i];
      calibration.time = (calibration.timestamp - currentSession.calibration[0].timestamp) / 1000;
    }
  }

  private prepareColumns() {
    const columns = [
      {
        Header: "Device type",
        accessor: "deviceType",
        filterable: true,
      },
      {
        Header: "Device producer",
        accessor: "deviceProducer",
        filterable: true,
      },
      {
        Header: "Device frequency",
        accessor: "deviceFrequency",
        filterable: true,
      },
      {
        Header: "Subject vision defect",
        accessor: (s: Session) => s.subject.visionDefect ? "Yes" : "No",
        filterable: true,
        id: "visionDefect",
      },
      {
        Header: "Subject age",
        accessor: (s: Session) => s.subject.age,
        filterable: true,
        id: "age",
      },
      {
        Header: "Subject education",
        accessor: (s: Session) => s.subject.educationLevel,
        filterable: true,
        id: "education",
      },
      {
        Header: "Subject sex",
        accessor: (s: Session) => s.subject.sex,
        filterable: true,
        id: "sex",
      },
      {
        Cell: (row: any) => {
          return (
            <div className="text-center">
              <button
                className="btn btn-info"
                onClick={this.showCharts.bind(this, row.value)}
              >
                details
              </button>
            </div>
          )
        },
        Header: "Show charts",
        accessor: "id",
        filterable: false,
      }
    ]
    return columns;
  }

  private showCharts = (id: string | number) => {
    this.setState({
      currentSessionId: id,
    });
  };

}

const mapStateToProps = (state: Store) => ({
  experiment: state.details.experiment,
});


export default connect(mapStateToProps, null)(Details);

