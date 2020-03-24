import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Card from '../../common/Card';
import { axios_get, axios_post } from '../../../helpers';
import { logout } from '../../../store/actions/auth';

import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { faArrowLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // shift
      shifts: [],
      shiftsOptions: [],
      shiftSelected: null,
      // group
      groups: [],
      groupsOptions: [],
      groupSelected: null,
      // proccessname
      proccessnames: [],
      proccessnamesOptions: [],
      proccessnameSelected: null,
      // proccessname
      linenumbers: [],
      linenumbersOptions: [],
      linenumberSelected: null,
      // proccessname
      modeltypes: [],
      modeltypesOptions: [],
      modeltypeSelected: null,
      // planned activity
      plannedactivities: [],
      plannedactivitiesToSend: [],
      // unplanned activity
      unplannedactivities: [],
      unplannedactivitiesOptions: [],
      unplannedactivitiesToSend: [],
      unplannedactivitiesJumlah: 0,
      // params
      targetAmount: 1515,
      actualAmount: 0,
      okAmount: 0,
      startAt: (new Date()).getTime(),
      finishAt: (new Date()).getTime() + 3600000,
      // operation number
      operationnumbers: [],
      operationnumbersOptions: []
    }
    this.handleChangeShift = this.handleChangeShift.bind(this);
    this.handleChangeGroup = this.handleChangeGroup.bind(this);
    this.handleChangeProccessname = this.handleChangeProccessname.bind(this);
    this.handleChangeLinenumber = this.handleChangeLinenumber.bind(this);
    this.handleChangeModeltype = this.handleChangeModeltype.bind(this);
    // handle general
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeFinish = this.handleChangeFinish.bind(this);
    // activities
    this.handleChangePlanned = this.handleChangePlanned.bind(this);
    this.handleChangeNumberUnplannedActivitiesJumlah = this.handleChangeNumberUnplannedActivitiesJumlah.bind(this);
  }

  componentDidMount = async () => {
    try {
      const shifts = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/shift`,
        this.props.store.auth.access_token
      );
      const groups = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/group`,
        this.props.store.auth.access_token
      );
      const proccessnames = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/proccess-name`,
        this.props.store.auth.access_token
      );
      const linenumbers = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/line-number`,
        this.props.store.auth.access_token
      );
      const modeltypes = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/model-type`,
        this.props.store.auth.access_token
      );
      const operationnumbers = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/operation-number`,
        this.props.store.auth.access_token
      );
      const plannedactivities = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/planned-activity`,
        this.props.store.auth.access_token
      );
      const unplannedactivities = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/unplanned-activity`,
        this.props.store.auth.access_token
      );
      this.setState({
        shifts, groups, proccessnames, linenumbers, modeltypes, operationnumbers, plannedactivities, unplannedactivities,
        shiftsOptions: shifts.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        groupsOptions: groups.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        proccessnamesOptions: proccessnames.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        linenumbersOptions: linenumbers.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        modeltypesOptions: modeltypes.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        unplannedactivitiesOptions: unplannedactivities.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        operationnumbersOptions: operationnumbers.map(item => ({ value: item.id, label: `${item.name} ${item.description}` }))
      }, () => {
        this.state.plannedactivities.forEach(item => {
          this.setState(prevState => ({
            plannedactivitiesToSend: [...prevState.plannedactivitiesToSend, { activity: item.id, minute: 0 }]
          }))
        });
      });
    }
    catch(err) {
      const { statusCode } = err.response.data;
      if (statusCode === 401) {
        alert('session habis');
        this.props.dispatch(logout());
        this.props.history.push('/login');
      }
    }
  }

  isFormValid = () => {
    const coreFieldIsValid =
      this.state.shiftSelected !== null &&
      this.state.groupSelected !== null &&
      this.state.proccessnameSelected !== null &&
      this.state.linenumberSelected !== null &&
      this.state.modeltypeSelected !== null &&
      this.state.actualAmount !== 0;
    let secondaryFieldIsValid = true;
    for (let i = 0; i < this.state.unplannedactivitiesToSend.length; i++) {
      if (this.state.unplannedactivitiesToSend[i].activity === null) {
        secondaryFieldIsValid = false;
        break;
      }
    }
    return coreFieldIsValid && secondaryFieldIsValid;
  }

  // select handle
  handleChangeShift = shiftSelected => { this.setState({ shiftSelected }) }
  handleChangeGroup = groupSelected => { this.setState({ groupSelected }) }
  handleChangeProccessname = proccessnameSelected => { this.setState({ proccessnameSelected }) }
  handleChangeLinenumber = linenumberSelected => { this.setState({ linenumberSelected }) }
  handleChangeModeltype = modeltypeSelected => { this.setState({ modeltypeSelected }) }

  // time handle
  handleChangeStart = startAt => { this.setState({ startAt: startAt.getTime() }) };

  handleChangeFinish = finishAt => { this.setState({ finishAt: finishAt.getTime() }) };

  // number handle
  handleChangeNumber = e => {
    if (parseInt(e.target.value) >= 0) {
      this.setState({
        [e.target.name]: parseInt(e.target.value)
      });
    }
  }

  handleChangePlanned = e => {
    if (parseInt(e.target.value) >= 0) {
      let plannedactivitiesToSendTemp = [ ...this.state.plannedactivitiesToSend ];
      plannedactivitiesToSendTemp[e.target.dataset.index] = {
        activity: e.target.dataset.idplannedactivity,
        minute: parseInt(e.target.value)
      };
      this.setState(
        { plannedactivitiesToSend: plannedactivitiesToSendTemp }
      );
    }
  }

  handleChangeNumberUnplannedActivitiesJumlah = e => {
    const newLength = parseInt(e.target.value);
    const prevLength = parseInt(this.state.unplannedactivitiesJumlah);
    if (newLength >= 0) {
      this.setState({ unplannedactivitiesJumlah: parseInt(e.target.value) }, () => {
        if (newLength > prevLength) {
          let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
          unplannedactivitiesToSendTemp[unplannedactivitiesToSendTemp.length] = {
            minute: 0,
            activityObj: null,
            activity: null,
            operationNumber: null,
            operationNumberObj: null,
            description: ''
          }
          this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
        }
        else {
          let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
          unplannedactivitiesToSendTemp.pop();
          this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
        }
        
      });
    }
    else if (newLength === 0) {
      this.setState({ unplannedactivitiesToSend: [] });
    }
  }

  handleChangeUnplannedActivity = (selected, index) => {
    let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
    unplannedactivitiesToSendTemp[index].activity = selected.value;
    unplannedactivitiesToSendTemp[index].activityObj = selected;
    this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
  }

  handleChangeUnplannedOperationNumber = (selected, index) => {
    let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
    unplannedactivitiesToSendTemp[index].operationNumber = selected.value;
    unplannedactivitiesToSendTemp[index].operationNumberObj = selected;
    this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
  }

  handleChangeUnplannedMinute = e => {
    if (parseInt(e.target.value) >= 0) {
      let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
      unplannedactivitiesToSendTemp[e.target.dataset.index].minute = parseInt(e.target.value);
      this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
    }
  }

  handleChangeUnplannedDescription = e => {
    let unplannedactivitiesToSendTemp = [ ...this.state.unplannedactivitiesToSend ];
    unplannedactivitiesToSendTemp[e.target.dataset.index].description = e.target.value;
    this.setState({ unplannedactivitiesToSend: unplannedactivitiesToSendTemp });
  }

  renderPlannedActivity = () => {
    let plannedactivitiesForm = [];
    const plannedactivityElem = (index, id, name) => {
      const minute = this.state.plannedactivitiesToSend[index] ? this.state.plannedactivitiesToSend[index].minute : 0;
      return (
        <div className="form-group" key={index}>
          <label htmlFor={'input' + id}>{name}</label>
          <input
            id={'input' + id}
            data-index={index}
            data-idplannedactivity={id}
            type="number"
            className="form-control classPlannedActivity"
            value={minute}
            onChange={this.handleChangePlanned}
            />
            <small className="form-text text-muted">menit</small>
        </div>
      )
    };
    this.state.plannedactivities.forEach((item, i) => {
      plannedactivitiesForm.push(plannedactivityElem(i, item.id, item.name));
    });
    return plannedactivitiesForm;
  }

  renderUnplannedActivity = () => {
    let unplannedactivitiesForm = [];
    const unplannedactivityElem = (index, id, name) => {
      const activity = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].activityObj : null;
      const operationnumber = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].operationNumberObj : null;
      const minute = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].minute : 0;
      const description = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].description : '';
      return (
        <div key={index}>
          <h6 style={{fontWeight: 'bold'}}>{'Activity ' + (index + 1)}</h6>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputShift">Activity</label>
                <Select
                  menuPlacement="auto"
                  id="inputShift"
                  placeholder="Pilih Aktivitas"
                  value={activity}
                  onChange={(value) => this.handleChangeUnplannedActivity(value, index)}
                  options={this.state.unplannedactivitiesOptions} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputShift">Op No.</label>
                <Select
                  menuPlacement="auto"
                  id="inputShift"
                  placeholder="Pilih OP"
                  value={operationnumber}
                  onChange={(value) => this.handleChangeUnplannedOperationNumber(value, index)}
                  options={this.state.operationnumbersOptions} />
                <small className="form-text text-muted">dapat dikosongkan</small>
              </div>
            </div>
          </div>
          <div className="row" key={index}>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor={'input' + id + 'waktu'}>Waktu</label>
                <input
                  id={'input' + id + 'waktu'}
                  data-index={index}
                  type="number"
                  className="form-control"
                  value={minute}
                  onChange={this.handleChangeUnplannedMinute}
                  />
                <small className="form-text text-muted">menit</small>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group" key={index}>
                <label htmlFor={'input' + id + 'description'}>Remarks</label>
                <input
                  id={'input' + id + 'description'}
                  data-index={index}
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={this.handleChangeUnplannedDescription}
                  />
              </div>
            </div>
          </div>
        </div>
      )
    };
    for (let i = 0; i < this.state.unplannedactivitiesJumlah ; i++) {
      unplannedactivitiesForm.push(unplannedactivityElem(i));
    }
    return unplannedactivitiesForm;
  }

  generateUnique = () => {
    const length = 5;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const str = (new Date()).getTime().toString(16);
    return (result + str.substr(str.length - 8)).toUpperCase();
  }

  handleSubmit = async e => {
    e.preventDefault();
    if (this.isFormValid()) {
      const { targetAmount, actualAmount, okAmount, startAt, finishAt } = this.state;
      const reqBody = {
        code: this.generateUnique(),
        shift: this.state.shiftSelected.value,
        group: this.state.groupSelected.value,
        proccessName: this.state.proccessnameSelected.value,
        lineNumber: this.state.linenumberSelected.value,
        modelType: this.state.modeltypeSelected.value,
        targetAmount, actualAmount, okAmount, startAt, finishAt,
        plannedActivities: this.state.plannedactivitiesToSend,
        unplannedactivities: this.state.unplannedactivitiesToSend
      }
      try {
        console.log(this.state.unplannedactivitiesToSend)
        // const newProduction = await axios_post(
        //   `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production`,
        //   reqBody, this.props.store.auth.access_token
        // );
        // this.props.history.push('./detail/' + newProduction.id);
      }
      catch(err) {
        const { statusCode } = err.response.data;
        if (statusCode === 401) {
          alert('session habis');
          this.props.dispatch(logout());
          this.props.history.push('/login');
        }
      }
    }
    else {
      alert("form tidak valid")
    }
  }

  render() {
    return (
      <Card title="Add" col={6}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <form
          onSubmit={this.handleSubmit}
          noValidate>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Condition</h5>
          <div className="form-group">
            <label htmlFor="inputModel">Model</label>
            <Select
              id="inputModel"
              placeholder="Pilih Model"
              value={this.state.modeltypeSelected}
              onChange={this.handleChangeModeltype}
              options={this.state.modeltypesOptions} />
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputShift">Shift</label>
                <Select
                  id="inputShift"
                  placeholder="Pilih Shift"
                  value={this.state.shiftSelected}
                  onChange={this.handleChangeShift}
                  options={this.state.shiftsOptions} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputGroup">Group</label>
                <Select
                  id="inputGroup"
                  placeholder="Pilih Group"
                  value={this.state.groupSelected}
                  onChange={this.handleChangeGroup}
                  options={this.state.groupsOptions} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputProccessName">Proccess Name</label>
                <Select
                  id="inputProccessName"
                  placeholder="Pilih Proccess Name"
                  value={this.state.proccessnameSelected}
                  onChange={this.handleChangeProccessname}
                  options={this.state.proccessnamesOptions} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputLineNumber">Line Number</label>
                <Select
                  id="inputLineNumber"
                  placeholder="Pilih Line Number"
                  value={this.state.linenumberSelected}
                  onChange={this.handleChangeLinenumber}
                  options={this.state.linenumbersOptions} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputTarget">Target</label>
                <input
                  id="inputTarget"
                  type="number"
                  className="form-control"
                  name="targetAmount"
                  value={this.state.targetAmount}
                  onChange={this.handleChangeNumber}
                  />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputAktual">Aktual</label>
                <input
                  id="inputAktual"
                  type="number"
                  className="form-control"
                  name="actualAmount"
                  value={this.state.actualAmount}
                  onChange={this.handleChangeNumber}
                  />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputOk">OK</label>
                <input
                  id="inputOk"
                  type="number"
                  className="form-control"
                  name="okAmount"
                  value={this.state.okAmount}
                  onChange={this.handleChangeNumber}
                  />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputStartAt">Start</label>
            <DatePicker
              id="inputStartAt"
              className="form-control"
              selected={this.state.startAt}
              onChange={this.handleChangeStart}
              showTimeSelect
              dateFormat="dd/MM/yyyy p"
              timeIntervals={1}
              showDisabledMonthNavigation
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputFinishAt">Finish</label>
            <DatePicker
              id="inputFinishAt"
              className="form-control"
              selected={this.state.finishAt}
              onChange={this.handleChangeFinish}
              showTimeSelect
              dateFormat="dd/MM/yyyy p"
              timeIntervals={1}
              showDisabledMonthNavigation
            />
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Planning Down Time</h5>
          <div className="row">
            {this.renderPlannedActivity().map((component, i) => {
              return (<div className="col-4" key={i}>{component}</div>);
            })}
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Unplanning Down Time</h5>
          <div className="form-group">
            <label htmlFor="inputJumlahUnplannedActivities">Jumlah Unplanned Activity</label>
            <input
              id="inputJumlahUnplannedActivities"
              type="number"
              className="form-control"
              value={this.state.unplannedactivitiesJumlah}
              onChange={this.handleChangeNumberUnplannedActivitiesJumlah} />
          </div>
          <div className="ml-5">
            {this.renderUnplannedActivity().map(component => {
              return component;
            })}
          </div>
          <div className="d-flex">
            <Link to="/dashboard/production"
              className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
            </Link>
            <button type="submit"
              className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faPlusSquare} /></i>&nbsp;Tambahkan
            </button>
          </div>
        </form> :
        <div className="text-center">
          <span>access denied</span>
        </div>}                         
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(Add);
