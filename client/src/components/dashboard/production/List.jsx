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
          <Link to={{pathname: `/dashboard/production/detail/${original.id}`}}><Moment format="DD/MM/YYYY">
            {original.startAt}
          </Moment></Link>
        ),
        width: 100
      },
      {
        Header: 'Code',
        accessor: 'code',
        width: 150
      },
      {
        Header: 'Proccess Name',
        accessor: 'proccessName.name',
        width: 150
      },
      {
        Header: 'Model',
        accessor: 'modelType.name',
        width: 100
      },
      {
        Header: 'Shift',
        Cell: ({ original }) => (
          <span>{original.shift.name + ' - ' + original.shift.description}</span>
        ),
        width: 150
      },
      {
        Header: 'Group',
        Cell: ({ original }) => (
          <span>{original.group.name + ' - ' + original.group.description}</span>
        ),
        width: 110
      },
      {
        Header: 'Line',
        Cell: ({ original }) => (
          <span>{original.lineNumber.name + ' - ' + original.lineNumber.description}</span>
        ),
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
          <span>{parseInt(original.actualAmount) - parseInt(original.okAmount)}</span>
        ),
        width: 100
      },
      {
        Header: 'Operating Time (minute)',
        Cell: ({ original }) => (
          <span>{((new Date(original.finishAt)).getTime() - (new Date(original.startAt)).getTime()) / 60000}</span>
        ),
        width: 250
      },
      {
        Header: 'Down Time (minute)',
        Cell: ({ original }) => {
          let dtAmountP = 0;
          let dtAmountU = 0;
          original.plannedActivities.forEach(item => {
            dtAmountP += item.minute;
          })
          original.unplannedActivities.forEach(item => {
            dtAmountU += item.minute;
          })
          return (
            <ul>
              <li>Planning: {dtAmountP}</li>
              <li>Unplanning: {dtAmountU}</li>
              <li className="font-weight-bold">Total: {dtAmountP + dtAmountU}</li>
            </ul>
          )
        },
        width: 180
      },
      {
        Header: 'Running Time (minute)',
        Cell: ({ original }) => {
          const totalTime = ((new Date(original.finishAt)).getTime() - (new Date(original.startAt)).getTime()) / 60000;
          let dtAmount = 0;
          original.plannedActivities.forEach(item => {
            dtAmount += item.minute;
          })
          original.unplannedActivities.forEach(item => {
            dtAmount += item.minute;
          })
          return (
            <span>{totalTime - dtAmount}</span>
          )
        },
        width: 180
      },
      {
        Header: 'Total Time Needed (minute)',
        Cell: ({ original }) => (
          <span>{((original.targetAmount * original.cycleTime) / 60).toFixed()}</span>
        ),
        width: 250
      },
      {
        Header: '% Quality',
        Cell: ({ original }) =>  (
          <ul>
            <li>NG: {(((parseInt(original.actualAmount) - parseInt(original.okAmount)) / original.actualAmount) * 100).toFixed(2)}%</li>
            <li>OK: {((original.okAmount / original.actualAmount) * 100).toFixed(2)}%</li>
          </ul>
        ),
        width: 180
      },
      {
        Header: '% Summary',
        Cell: ({ original }) => {
          const opTime = ((new Date(original.finishAt)).getTime() - (new Date(original.startAt)).getTime()) / 60000;
          let planDtTime = 0;
          let unplanDtTime = 0;
          original.plannedActivities.forEach(item => {
            planDtTime += item.minute;
          });
          original.unplannedActivities.forEach(item => {
            unplanDtTime += item.minute;
          });
          const totalDtTime = planDtTime + unplanDtTime;
          const runTime = opTime - totalDtTime;
          const needTime = ((original.targetAmount * original.cycleTime) / 60).toFixed();
          const eff = ((runTime / needTime) * 100).toFixed(2);
          const avail = ((runTime / (opTime - planDtTime)) * 100).toFixed(2);
          const performance = ((((original.cycleTime * original.actualAmount) / 60) / needTime) * 100).toFixed(2);
          const qRate = ((original.okAmount / original.actualAmount) * 100).toFixed(2);
          const oee = ((avail * performance * qRate * 100) / 1000000).toFixed(2);
          return (
            <ul>
              <li>Eff: {eff}%</li>
              <li>Avail: {avail}%</li>
              <li>Performance: {performance}%</li>
              <li>Quality Rate: {qRate}%</li>
              <li className="font-weight-bold">OEE: {oee}%</li>
            </ul>
          )
        },
        width: 210
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
