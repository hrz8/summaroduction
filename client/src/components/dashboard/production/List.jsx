import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Moment from 'react-moment';
import Card from '../../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faInfoCircle, faEdit, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { axios_get } from '../../../helpers';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      productions: [],
      proccessnames: [],
      proccessnamesoptions: [{ value: '', label: '-- Semua --' }],
      proccessnamesselected: null,
      modeltypes: [],
      modeltypesoptions: [{ value: '', label: '-- Semua --' }],
      modeltypesselected: null,
      // searchProccessName: '',
      // searchModelType: '',
      searchStartDate: null,
      searchEndDate: null,
      downloadTapped: false
    }
    this.handleChangeProccessName = this.handleChangeProccessName.bind(this);
    this.handleChangeModelType = this.handleChangeModelType.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount = async () => {
    await this.drawTable();
    const proccessnames = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/proccess-name`,
      this.props.store.auth.access_token
    );
    const modeltypes = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/model-type`,
      this.props.store.auth.access_token
    );
    this.setState(prevState => ({
      proccessnames, modeltypes,
      proccessnamesoptions: [...prevState.proccessnamesoptions, ...proccessnames.map(item => ({ value: item.id, label: item.name }))],
      modeltypesoptions: [...prevState.modeltypesoptions, ...modeltypes.map(item => ({ value: item.id, label: item.name }))]
    }));
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleChangeProccessName(proccessnamesselected) {
    this.setState({ proccessnamesselected });
  }

  handleChangeModelType(modeltypesselected) {
    this.setState({ modeltypesselected });
  }

  handleStartDateChange = searchStartDate => {
    this.setState({
      searchStartDate
    }, () => {
      if (!this.state.searchStartDate) {
        this.setState({ searchEndDate: null });
      }
    });
  };

  handleEndDateChange = date => {
    let searchEndDate = new Date();
    if (date && new Date().toDateString() !== date.toDateString()) {
      date.setHours(23,59,0,0);
      searchEndDate = date;
    }
    if (this.state.searchStartDate) {
      this.setState({ searchEndDate });
    }
  };

  drawTable = async (url = `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`) => {
    try {
      const productions = await axios_get(
        url,
        this.props.store.auth.access_token
      );
      this.setState({ productions }, () => console.log(this.state));
    }
    catch(err) {
      throw err;
    }
  }

  handleSearch() {
    if (this.state.searchStartDate && !this.state.searchEndDate) {      
      alert("masukkan end date");
      return;
    }
    let queryString = `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`;
    const query = { 
      q: this.state.q,
      searchProccessName: this.state.proccessnamesselected && this.state.proccessnamesselected.value,
      searchModelType: this.state.modeltypesselected && this.state.modeltypesselected.value,
      searchStartDate: (new Date(this.state.searchStartDate)).getTime(),
      searchEndDate: (new Date(this.state.searchEndDate)).getTime()
    };
    if (query.q) {
      queryString += `&filter=code:${query.q}`;
    }
    if (query.searchProccessName) {
      let v = `proccessName:${query.searchProccessName}`;
      queryString += (query.q) ? `;${v}` : `&filter=${v}`;
    }
    if (query.searchModelType) {
      let v = `modelType:${query.searchModelType}`;
      queryString += (query.q || query.searchProccessName) ? `;${v}` : `&filter=${v}`;
    }
    if (query.searchStartDate && query.searchEndDate) {
      let v = `date:${query.searchStartDate}-${query.searchEndDate}`;
      queryString += (query.q || query.searchProccessName || query.searchModelType) ? `;${v}` : `&filter=${v}`;
    }
    this.drawTable(queryString);
  }

  exportCSV() {
    this.csvLink.link.click();
  }

  render() {
    const columns = [
      {
        Header: 'Date',
        Cell: ({ original }) => (
          <Moment format="dddd DD/MM/YYYY">
            {original.startAt}
          </Moment>
        ),
        width: 200
      },
      {
        Header: 'Kode',
        Cell: ({ original }) => (
          <Link to={{pathname: `/dashboard/production/detail/${original.id}`}}>
            {original.code}
          </Link>
        ),
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
            <li>NG: {(((original.actualAmount - original.okAmount) / original.actualAmount) * 100).toFixed(2)}%</li>
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
            <div className="col-md-2 pr-md-1 mb-md-0 mb-2">
              <label className="sr-only" htmlFor="search-dt">Cari</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="q"
                  className="form-control bg-grey focus"
                  id="search-dt"
                  placeholder="Kode..."
                  value={this.state.q}
                  onChange={this.handleChange}></input>
                <i><FontAwesomeIcon icon={faSearch} /></i>
              </div>
            </div>
            <div className="col-md-2 p-md-1 mb-md-0 mb-2">
              <Select
                placeholder="Pilih Proccess"
                onChange={this.handleChangeProccessName}
                options={this.state.proccessnamesoptions}
              />
            </div>
            <div className="col-md-2 p-md-1 mb-md-0 mb-2">
              <Select
                placeholder="Pilih Model"
                onChange={this.handleChangeModelType}
                options={this.state.modeltypesoptions}
              />
            </div>
            <div className="col-md-2 p-md-1 mb-md-0 mb-2">
              <DatePicker
                placeholderText="Start Date (00:00)"
                className="form-control"
                selected={this.state.searchStartDate}
                onChange={this.handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showDisabledMonthNavigation
                isClearable
              />
            </div>
            <div className="col-md-2 p-md-1 mb-md-0 mb-2">
              <DatePicker
                placeholderText="End Date (23:59)"
                className="form-control"
                selected={this.state.searchEndDate}
                onChange={this.handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                minDate={this.state.searchStartDate}
                showDisabledMonthNavigation
                isClearable
              />
            </div>
            <div className="col-md-2 p-md-1 text-center text-md-left">
              <button
                className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.handleSearch}>
                <FontAwesomeIcon icon={faSearch} />&ensp;Cari
              </button>
            </div>
            <div className="col-md-2 p-md-1 pl-md-3 text-center text-md-left">
              <button
                className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.exportCSV}
                disabled={!this.state.downloadTapped}
                >
                <FontAwesomeIcon icon={faDownload} />&ensp;Download
              </button>
              <CSVLink 
                  data={[
                    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
                    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
                    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
                  ]} 
                  headers={[
                    { label: "First Name", key: "firstname" },
                    { label: "Last Name", key: "lastname" },
                    { label: "Email", key: "email" }
                  ]}
                  filename={`summary_production_${(new Date()).getTime()}.csv`}
                  target="_blank"
                  style={{ display: 'none' }}
                  ref={(r) => this.csvLink = r}
                  >
                  Download
              </CSVLink>
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
