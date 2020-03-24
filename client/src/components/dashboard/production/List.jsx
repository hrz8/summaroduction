import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Moment from 'react-moment';
import Card from '../../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faInfoCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { axios_get } from '../../../helpers';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      productions: []
    }
  }

  componentDidMount = async () => {
    await this.drawTable();
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  drawTable = async () => {
    try {
      const productions = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`,
        this.props.store.auth.access_token
      );
      this.setState({ productions });
    }
    catch(err) {
      throw err;
    }
  }

  render() {
    const columns = [
      {
        Header: 'Date',
        Cell: ({ original }) => (
          <Moment format="DD/MM/YYYY">
            {original.createdAt}
          </Moment>
        ),
        width: 100
      },
      {
        Header: 'Code',
        accessor: 'code',
        width: 150
      },
      {
        Header: 'Shift',
        Cell: ({ original }) => (
          <div>{original.shift.name + ' - ' + original.shift.description}</div>
        ),
        width: 150
      },
      {
        Header: 'Group',
        Cell: ({ original }) => (
          <div>{original.group.name + ' - ' + original.group.description}</div>
        ),
        width: 110
      },
      {
        Header: 'Proccess Name',
        accessor: 'proccessName.name',
        width: 170
      },
      {
        Header: 'Line',
        Cell: ({ original }) => (
          <div>{original.lineNumber.name + ' - ' + original.lineNumber.description}</div>
        ),
        width: 100
      },
      {
        Header: 'Model',
        accessor: 'modelType.name',
        width: 100
      },
      {
        Header: 'Target',
        accessor: 'targetAmount',
        width: 100
      },
      {
        Header: 'N',
        accessor: 'actualAmount',
        width: 100
      },
      {
        Header: 'OK',
        accessor: 'okAmount',
        width: 100
      },
      {
        Header: 'NG',
        Cell: ({ original }) => (
          <div>{parseInt(original.actualAmount) - parseInt(original.okAmount)}</div>
        ),
        width: 100
      },
      {
        Header: 'Action',
        sortable: false,
        width: 250,
        Cell: ({ original }) => (
          <>
            <Link to={{pathname: `/dashboard/production/detail/${original.id}`}}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faInfoCircle} />&nbsp;Detil
            </Link>
            <Link to={{pathname: `/dashboard/production/edit/${original.id}`}}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faEdit} />&nbsp;Edit
            </Link>
            {this.props.store.auth.role === "su" ?
            <button
              className="btn btn-cc btn-cc-secondary btn-cc-radius-normal p-1 mb-1"
              data-id={original.id}
              data-name={original.name}
              onClick={this.handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} />&nbsp;Hapus
            </button> : <></>}
          </>
        )
      },
    ];
    return (
      <Card title={"Production"} col={12}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <>
          <div className="row align-items-center">
            <div className="col-md-3 pr-md-1 mb-md-0 mb-2">
              <label className="sr-only" htmlFor="search-dt">Cari</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="q"
                  className="form-control bg-grey focus"
                  id="search-dt"
                  placeholder="Cari..."
                  value={this.state.q}
                  onChange={this.handleChange}></input>
                <i><FontAwesomeIcon icon={faSearch} /></i>
              </div>
            </div>
            <div className="col-md-2 p-md-1 text-center text-md-left">
              <button
                className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.handleSearch}>
                <FontAwesomeIcon icon={faSearch} />&ensp;Cari
              </button>
            </div>
            <div className="col-md-3 ml-md-auto text-center text-md-right">
              <Link
                to="/dashboard/production/add"
                className="btn btn-cc btn-cc-primary btn-cc-radius-extra ml-0 py-2 px-5 px-md-2">
                <FontAwesomeIcon icon={faPlus} />&ensp;Tambah
              </Link>
            </div>
          </div>
          <ReactTable 
            data={this.state.productions}
            columns={columns}
            pageSize={10}
            minRows={2} />
        </> :
        <div className="text-center">
          <span>access denied</span>
        </div>}
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(List);
