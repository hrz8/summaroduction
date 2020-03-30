import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Moment from 'react-moment';
import Card from '../../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faInfoCircle, faEdit, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { axios_get, oee, handle_error, axios_delete } from '../../../helpers';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      productions: [],
      productionsExtends: [],
      proccessnames: [],
      proccessnamesoptions: [{ value: '', label: '-- Semua Proccess --' }],
      proccessnamesselected: null,
      modeltypes: [],
      modeltypesoptions: [{ value: '', label: '-- Semua Model --' }],
      modeltypesselected: null,
      shifts: [],
      shiftsoptions: [{ value: '', label: '-- Semua Shift--' }],
      shiftsselected: null,
      linenumbers: [],
      linenumbersoptions: [{ value: '', label: '-- Semua Line --' }],
      linenumbersselected: null,
      groups: [],
      groupsoptions: [{ value: '', label: '-- Semua Group --' }],
      groupsselected: null,
      //dat
      searchStartDate: null,
      searchEndDate: null,
      downloadTapped: false
    }
    this.handleChangeProccessName = this.handleChangeProccessName.bind(this);
    this.handleChangeModelType = this.handleChangeModelType.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
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
    const shifts = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/shift`,
      this.props.store.auth.access_token
    );
    const linenumbers = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/line-number`,
      this.props.store.auth.access_token
    );
    const groups = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/group`,
      this.props.store.auth.access_token
    );
    this.setState(prevState => ({
      proccessnames, modeltypes, shifts, linenumbers, groups,
      proccessnamesoptions: [...prevState.proccessnamesoptions, ...proccessnames.map(item => ({ value: item.id, label: item.name }))],
      modeltypesoptions: [...prevState.modeltypesoptions, ...modeltypes.map(item => ({ value: item.id, label: item.name }))],
      shiftsoptions: [...prevState.shiftsoptions, ...shifts.map(item => ({ value: item.id, label: item.name }))],
      linenumbersoptions: [...prevState.linenumbersoptions, ...linenumbers.map(item => ({ value: item.id, label: item.name }))],
      groupsoptions: [...prevState.groupsoptions, ...groups.map(item => ({ value: item.id, label: item.name }))]
    }));
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleChangeProccessName = proccessnamesselected => {
    this.setState({ proccessnamesselected });
  }

  handleChangeModelType = modeltypesselected => {
    this.setState({ modeltypesselected });
  }

  handleChangeShift = shiftsselected => {
    this.setState({ shiftsselected });
  }

  handleChangeLineNumber = linenumbersselected => {
    this.setState({ linenumbersselected });
  }

  handleChangeGroup = groupsselected => {
    this.setState({ groupsselected });
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
      this.setState({ productions }, () => {
        this.setState({
          productionsExtends: this.state.productions.map(item => {
            const dataOee = oee(item);
            return { ...item, ...dataOee };
          })
        })
      });
    }
    catch (err) {
      handle_error(err.response.data.statusCode);
    }
  }

  handleSearch = async () => {
    if (this.state.searchStartDate && !this.state.searchEndDate) {      
      alert("masukkan end date");
      return;
    }
    let queryString = `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`;
    const query = { 
      q: this.state.q,
      searchProccessName: this.state.proccessnamesselected && this.state.proccessnamesselected.value,
      searchModelType: this.state.modeltypesselected && this.state.modeltypesselected.value,
      searchShift: this.state.shiftsselected && this.state.shiftsselected.value,
      searchLineNumber: this.state.linenumbersselected && this.state.linenumbersselected.value,
      searchGroup: this.state.groupsselected && this.state.groupsselected.value,
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
    if (query.searchShift) {
      let v = `shift:${query.searchShift}`;
      queryString += (query.q || query.searchProccessName || query.searchModelType) ? `;${v}` : `&filter=${v}`;
    }
    if (query.searchLineNumber) {
      let v = `lineNumber:${query.searchLineNumber}`;
      queryString += (query.q || query.searchProccessName || query.searchModelType || query.searchShift) ? `;${v}` : `&filter=${v}`;
    }
    if (query.searchGroup) {
      let v = `group:${query.searchGroup}`;
      queryString += (query.q || query.searchProccessName || query.searchModelType || query.searchShift || query.searchLineNumber) ? `;${v}` : `&filter=${v}`;
    }
    if (query.searchStartDate && query.searchEndDate) {
      let v = `date:${query.searchStartDate}-${query.searchEndDate}`;
      queryString += (query.q || query.searchProccessName || query.searchModelType || query.searchShift || query.searchLineNumber || query.searchGroup) ? `;${v}` : `&filter=${v}`;
    }
    await this.drawTable(queryString);
    this.setState({ downloadTapped: true });
  }

  handleDelete = async e => {
    if (window.confirm(`Hapus data dengan id ${e.target.dataset.id} (${e.target.dataset.name}) ?`)) {
      try {
        const deleted = await axios_delete(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production/${e.target.dataset.id}`, this.props.store.auth.access_token)
        alert(`Data dengan id ${deleted.id} (${deleted.name}) berhasil dihapus.`);
        await this.drawTable();
      }
      catch (err) {
        handle_error(err.response.data.statusCode);
      }
    }
  }

  exportCSV = () => {
    this.cariButton.click();
    setTimeout(() => {
      this.csvLink.link.click();
    }, 1000);
  }

  render = () =>  {
    const columns = [
      {
        Header: 'Kode',
        Cell: ({ original }) => (
          <Link to={{ pathname: `/dashboard/production/detail/${original.id}` }}>
            {original.code}
          </Link>
        ),
        width: 150
      },
      {
        Header: 'Action',
        sortable: false,
        width: 250,
        Cell: ({ original }) => (
          <>
            <Link to={{ pathname: `/dashboard/production/detail/${original.id}` }}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faInfoCircle} />&nbsp;Detil
            </Link>
            <Link to={{ pathname: `/dashboard/production/edit/${original.id}` }}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faEdit} />&nbsp;Edit
            </Link>
            <button
              className="btn btn-cc btn-cc-secondary btn-cc-radius-normal p-1 mb-1"
              data-id={original.id}
              data-name={original.name}
              onClick={this.handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} />&nbsp;Hapus
          </button>
          </>
        )
      },
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
        Header: 'FY (+Reuse)',
        accessor: 'fy',
        width: 150
      },
      {
        Header: 'NG',
        accessor: 'ng',
        width: 100
      },
      {
        Header: 'Reuse',
        accessor: 'reuseAmount',
        width: 100
      },
      {
        Header: 'Operating Time (minute)',
        accessor: 'opTime',
        width: 250
      },
      {
        Header: 'Down Time (minute)',
        Cell: ({ original }) => (
          <ul>
            <li>Planning: {original.planDtTime}</li>
            <li>Unplanning: {original.unplanDtTime}</li>
            <li className="font-weight-bold">Total: {original.totalDtTime}</li>
          </ul>
        ),
        width: 180
      },
      {
        Header: 'Running Time (minute)',
        Cell: ({ original }) => (
          <span>{original.runTime}</span>
        ),
        width: 180
      },
      {
        Header: 'Total Time Needed (minute)',
        Cell: ({ original }) => (
          <span>{original.needTime}</span>
        ),
        width: 250
      },
      {
        Header: '% Quality',
        Cell: ({ original }) =>  (
          <ul>
            <li>NG: {original.ngRate}%</li>
            <li>OK: {original.qRate}%</li>
          </ul>
        ),
        width: 180
      },
      {
        Header: '% Quality (+Reuse)',
        Cell: ({ original }) =>  (
          <ul>
            <li>OK: {original.qRate2}%</li>
          </ul>
        ),
        width: 180
      },
      {
        Header: '% Summary',
        Cell: ({ original }) => (
          <ul>
            <li>Eff: {original.eff}%</li>
            <li>Avail: {original.avail}%</li>
            <li>Performance: {original.performance}%</li>
            <li>Quality Rate: {original.qRate}%</li>
            <li>Quality Rate 2: {original.qRate2}%</li>
            <li className="font-weight-bold">OEE: {original.oee}%</li>
            <li className="font-weight-bold">OEE 2: {original.oee2}%</li>
          </ul>
        ),
        width: 210
      }
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
                <Select
                  placeholder="Pilih Shift"
                  onChange={this.handleChangeShift}
                  options={this.state.shiftsoptions}
                />
              </div>
              <div className="col-md-2 p-md-1 mb-md-0 mb-2">
                <Select
                  placeholder="Pilih Line"
                  onChange={this.handleChangeLineNumber}
                  options={this.state.linenumbersoptions}
                />
              </div>
              <div className="col-md-2 p-md-1 mb-md-0 mb-2">
                <Select
                  placeholder="Pilih Group"
                  onChange={this.handleChangeGroup}
                  options={this.state.groupsoptions}
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
                className="btn btn-cc btn-block btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.handleSearch}
                ref={(r) => this.cariButton = r}>
                <FontAwesomeIcon icon={faSearch} />&ensp;Cari
              </button>
            </div>
            <div className="col-md-2 p-md-1 text-center text-md-left">
              <button
                className="btn btn-cc btn-block btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.exportCSV}
                disabled={!this.state.downloadTapped}
                >
                <FontAwesomeIcon icon={faDownload} />&ensp;Download
              </button>
              <CSVLink 
                  data={this.state.productionsExtends} 
                  headers={[
                    { label: "Date", key: "startAt" },
                    { label: "Kode", key: "code" },
                    { label: "Proccess Name", key: "proccessName.name" },
                    { label: "Shift", key: "shift.name" },
                    { label: "Model", key: "modelType.name" },
                    { label: "Group", key: "group.name" },
                    { label: "Line", key: "lineNumber.name" },
                    { label: "Target", key: "targetAmount" },
                    { label: "Aktual", key: "actualAmount" },
                    { label: "OK", key: "okAmount" },
                    { label: "NG", key: "ng" },
                    { label: "Reuse", key: "reuseAmount" },
                    { label: "Final Amount", key: "fy" },
                    { label: "Operating Time", key: "opTime" },
                    { label: "Planned Down Time", key: "planDtTime" },
                    { label: "Unplanning Down Time", key: "unplanDtTime" },
                    { label: "Total Down Time", key: "totalDtTime" },
                    { label: "Running Time", key: "runTime" },
                    { label: "Total Time Needed", key: "needTime" },
                    { label: "% NG", key: "ngRate" },
                    { label: "% OK", key: "qRate" },
                    { label: "% OK (+Reuse)", key: "qRate2" },
                    { label: "Efficiency", key: "eff" },
                    { label: "Availability", key: "avail" },
                    { label: "Performance", key: "performance" },
                    { label: "Quality Rate", key: "qRate" },
                    { label: "Quality Rate (+Reuse)", key: "qRate2" },
                    { label: "OEE", key: "oee" },
                    { label: "OEE (+Reuse)", key: "oee2" }
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
            data={this.state.productionsExtends}
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
