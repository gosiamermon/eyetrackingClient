import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Store } from '../../../store/model';
import { Input, Button } from 'reactstrap';
import { queryTypesMapping } from '../../../config/constants';
import { executeQuery } from './state/actions';
import './translator.css';

interface Props {
  executeQuery: (query: string) => void;
  response: any;
}

interface State {
  queryFirstPart: string;
  querySecondPart: string;
  queryThirdPart: string;
  queryFourthPart: string;
  queryFifthPart: string;
  executionDisabled: boolean;
  showWhere: boolean;
}

class Translator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      executionDisabled: true,
      queryFifthPart: "",
      queryFirstPart: "SELECT",
      queryFourthPart: "",
      querySecondPart: "",
      queryThirdPart: "FROM",
      showWhere: true,
    };
    this.setQueryType = this.setQueryType.bind(this);
    this.execureQuery = this.execureQuery.bind(this);
  };

  public render() {
    const { response } = this.props;
    const columns = this.prepareColumns(response);
    console.log(response)
    const { queryThirdPart, executionDisabled, showWhere } = this.state;
    return (
      <div>
        <div className="translator-form">
          <Input
            className="form-element"
            onChange={this.setQueryType}
            type="select"
            name="queryType"
            id="queryType"
          >
            <option id="select" selected={true}>SELECT</option>
            <option id="insert">INSERT INTO</option>
            <option id="update">UPDATE</option>
            <option id="delete">DELETE</option>
          </Input>
          <Input
            onChange={this.setTextPart.bind(this, "querySecondPart")}
            className="form-element"
            type="text"
          />
          <span className="form-element">{queryThirdPart}</span>
          <Input
            onChange={this.setTextPart.bind(this, "queryFourthPart")}
            className="form-element"
            type="text"
          />
          {
            showWhere &&
            <div className="where-clause">
              <span className="form-element">WHERE</span>
              <Input
                onChange={this.setTextPart.bind(this, "queryFifthPart")}
                className="form-element"
                type="text"
              />
            </div>
          }
        </div>
        <div className="translator-button">
          <Button onClick={this.execureQuery} disabled={executionDisabled}>Execute query</Button>
        </div>
        {
          columns.length > 0 &&
          <ReactTable columns={columns} data={response} />
        }
      </div>
    )
  }

  private prepareColumns(response: any) {
    const columns: any = []
    if (response && response.length) {
      const row = response[0];
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          columns.push({
            Header: key,
            accessor: key,
            filterable: true,
          })
        }
      }
    }
    return columns;
  }

  private execureQuery() {
    const {
      queryFourthPart,
      queryFifthPart,
      queryFirstPart,
      querySecondPart,
      queryThirdPart,

    } = this.state;
    let fullQuery = `${queryFirstPart} ${querySecondPart} ${queryThirdPart} ${queryFourthPart}`;
    if (queryFifthPart) {
      fullQuery += ` WHERE ${queryFifthPart}`;
    }
    this.props.executeQuery(fullQuery);
  }

  private setTextPart(field: string, e: any) {
    const newState = {
      ...this.state,
      [field]: e.target.value,
    };
    this.setState(newState);
    this.setState({
      executionDisabled: this.checkAllRequiredFields(),
    });
  };

  private checkAllRequiredFields() {
    const {
      queryFourthPart,
      querySecondPart,
    } = this.state;
    if (querySecondPart && queryFourthPart) {
      return false;
    }
    return true;
  }

  private setQueryType(e: any) {
    let queryThirdPart;
    let queryFifthPart = this.state.queryFifthPart;
    let showWhere = true;
    for (const node of e.target.children) {
      if (node.value === e.target.value) {
        queryThirdPart = queryTypesMapping[node.getAttribute('id')];

        if (e.target.value === 'INSERT INTO') {
          showWhere = false;
          queryFifthPart = "";
        }
      }
    }
    this.setState({
      queryFifthPart,
      queryFirstPart: e.target.value,
      queryThirdPart,
      showWhere,
    });
  }
}

const mapStateToProps = (state: Store) => ({
  response: state.translator.response,
});

const mapDispatchToProps = {
  executeQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(Translator);

