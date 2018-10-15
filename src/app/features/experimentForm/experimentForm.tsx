import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Papa from 'papaparse';
import { SessionData, Calibration, Measurement, Stymulus, Experiment } from '../../shared/model';
import { measurementFileTypes, stymulusFileTypes } from '../../../config/fileTypes';
import { addExperiment } from './state/actions/';
import './experimentForm.css';

interface Props {
  addExperiment: (experiment: Experiment) => void;
}

interface State {
  name: string;
  startDate: string;
  endDate: string;
  sessionData: SessionData[];
  calibrationData: Array<{
    sessionId: string;
    measurements: Calibration[];
  }>,
  measurementsData: Array<{
    sessionId: string;
    measurements: Measurement[];
  }>,
  stymulus: Stymulus[];
  saveDisabled: boolean;
}

class ExperimentForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      calibrationData: [],
      endDate: "",
      measurementsData: [],
      name: "",
      saveDisabled: true,
      sessionData: [],
      startDate: "",
      stymulus: [],
    }
  }

  public render() {
    return (
      <div className="form-container">
        <Link className="form__link" to="/table">Powrót</Link>
        <Form className="form">
          <FormGroup className="form-group">
            <Label className="form-group__label" for="experimentName">Experiment name</Label>
            <Input onChange={this.onTextFieldChange.bind(this, "name")} type="text" name="experimentName" id="experimentName" />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="startDate">
              Start date
            </Label>
            <Input onChange={this.onTextFieldChange.bind(this, "startDate")} type="date" name="startDate" id="startDate" />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="endDate">
              End date
            </Label>
            <Input onChange={this.onTextFieldChange.bind(this, "endDate")} type="date" name="endDate" id="endDate" />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="sessionsData">Sessions data</Label>
            <Input
              onChange={this.onSessionDataChange}
              type="file"
              accept=".tsv,.csv,text/plain"
              name="sessionsData"
              id="sessionsData"
            />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="stymulus">Stymulus</Label>
            <Input
              onChange={this.onStymulusChange}
              type="file"
              accept="image/*"
              multiple={true}
              name="stymulus"
              id="stymulus"
            />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="calibration">Calibration measurements</Label>
            <Input
              onChange={this.onMeasurementsChange.bind(this, "calibrationData")}
              type="file"
              accept=".csv,.txt"
              multiple={true}
              name="calibration"
              id="calibration"
            />
          </FormGroup>
          <FormGroup className="form-group">
            <Label className="form-group__label" for="measurements">Measurements</Label>
            <Input
              onChange={this.onMeasurementsChange.bind(this, "measurementsData")}
              type="file"
              accept=".csv,.txt"
              multiple={true}
              name="measurements"
              id="measurements"
            />
          </FormGroup>
          <Button onClick={this.saveExperiment} className="save-button" disabled={this.state.saveDisabled}>Zapisz</Button>
        </Form>
      </div>
    );
  }

  private saveExperiment = () => {
    const {
      name,
      startDate,
      endDate,
      sessionData,
      calibrationData,
      measurementsData,
      stymulus
    } = this.state;

    this.props.addExperiment({
      calibrationData,
      endDate,
      measurementsData,
      name,
      sessionData,
      startDate,
      stymulus
    });
  }

  private checkAllRequiredFields() {
    const {
      startDate,
      endDate,
      measurementsData,
      calibrationData,
      sessionData,
      stymulus,
      name
    } = this.state;
    if (startDate.length && endDate.length && measurementsData &&
      calibrationData && sessionData && stymulus && name) {
      return true;
    }
    return false;
  }

  private onTextFieldChange = (fieldName: string, e: any) => {
    const newState = {};
    newState[fieldName] = e.target.value;
    this.setState(newState);
    if (this.checkAllRequiredFields()) {
      this.setState({
        saveDisabled: false,
      })
    }
  };

  private onMeasurementsLoad = (fieldName: string, fileName: string, e: any) => {
    const text = e.target.result;
    const measurements: Calibration[] | Measurement[] = Papa.parse(text, { header: true }).data;

    const sessionIdData = /(?<=[\$])([0-9]*)(?=\.)/.exec(fileName)
    const measurementsData = {
      measurements,
      sessionId: sessionIdData ? sessionIdData[0] : fileName,
    }
    const newState = {};
    newState[fieldName] = [...this.state[fieldName], measurementsData];
    this.setState(newState);
    if (this.checkAllRequiredFields()) {
      this.setState({
        saveDisabled: false,
      })
    }
  };

  private onSessionDataLoad = (e: any) => {
    const text = e.target.result;
    const sessionData: SessionData[] = Papa.parse(text, { header: true }).data;
    this.setState({
      sessionData,
    });
    if (this.checkAllRequiredFields()) {
      this.setState({
        saveDisabled: false,
      })
    }
  };

  private onImageLoad = (name: string, e: any) => {
    const imageBinary = e.target.result;
    const stymulus: Stymulus = {
      binaryString: imageBinary,
      fileName: name,
    }

    this.setState({
      stymulus: [...this.state.stymulus, stymulus]
    });
    if (this.checkAllRequiredFields()) {
      this.setState({
        saveDisabled: false,
      })
    }
  };

  private onStymulusChange = (e: any) => {
    this.setState({ stymulus: [] });

    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (stymulusFileTypes.some(type => type === file.type)) {
        const reader = new FileReader();

        reader.onload = this.onImageLoad.bind(this, file.name);
        reader.readAsBinaryString(file);
      } else {
        this.stopLoadingFiles(e, "stymulus");
        alert("File type should be txt, csv or tsv");
        return;
      }
    }
  };

  private stopLoadingFiles(e: any, fieldName: string) {
    const newState = {};
    newState[fieldName] = [];
    this.setState(newState);
    e.target.value = null;
    if (this.checkAllRequiredFields()) {
      this.setState({
        saveDisabled: false,
      })
    }
  }

  private onSessionDataChange = (e: any) => {
    this.setState({
      sessionData: [],
    });
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = this.onSessionDataLoad;
    reader.readAsText(file);
  }

  private onMeasurementsChange = (fieldName: string, e: any) => {
    const newState = {};
    newState[fieldName] = [];
    this.setState(newState);

    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (measurementFileTypes.some(type => type === file.type)) {
        const reader = new FileReader();

        reader.onload = this.onMeasurementsLoad.bind(this, fieldName, file.name);
        reader.readAsText(file);
      } else {
        this.stopLoadingFiles(e, fieldName);
        alert("File type should be txt, csv or tsv");
        return;
      }
    }
  }
}

const mapDispatchToProps = {
  addExperiment,
}

export default connect(null, mapDispatchToProps)(ExperimentForm);
