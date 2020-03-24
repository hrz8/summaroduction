import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Card from '../../common/Card';
import moment from 'moment';
import { axios_get, axios_put } from '../../../helpers';
import { logout } from '../../../store/actions/auth';

import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.productionId,
      code: null,
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
    // activities
    this.handleChangeNumberUnplannedActivitiesJumlah = this.handleChangeNumberUnplannedActivitiesJumlah.bind(this);
  }

  componentDidMount = async () => {
    try {
      const mainData = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production/${this.state.id}?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`,
        this.props.store.auth.access_token
      );
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
      const { code, targetAmount, actualAmount, okAmount, startAt, finishAt } = mainData;
      this.setState({
        code, shifts, groups, proccessnames, linenumbers, modeltypes, operationnumbers, plannedactivities, unplannedactivities,
        // shift
        shiftsOptions: shifts.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        shiftSelected: { value: mainData.shift.id, label: `${mainData.shift.name} - ${mainData.shift.description}` },
        // group
        groupsOptions: groups.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        groupSelected: { value: mainData.group.id, label: `${mainData.group.name} - ${mainData.group.description}` },
        // proccess name
        proccessnamesOptions: proccessnames.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        proccessnameSelected: { value: mainData.proccessName.id, label: `${mainData.proccessName.name} ${mainData.proccessName.description}` },
        // line number
        linenumbersOptions: linenumbers.map(item => ({ value: item.id, label: `${item.name} - ${item.description}` })),
        linenumberSelected: { value: mainData.lineNumber.id, label: `${mainData.lineNumber.name} - ${mainData.lineNumber.description}` },
        // model type
        modeltypesOptions: modeltypes.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        modeltypeSelected: { value: mainData.modelType.id, label: `${mainData.modelType.name} ${mainData.modelType.description}` },
        // operation
        targetAmount, actualAmount, okAmount, startAt, finishAt,
        // activity
        unplannedactivitiesOptions: unplannedactivities.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        unplannedactivitiesJumlah: mainData.unplannedActivities.length,
        operationnumbersOptions: operationnumbers.map(item => ({ value: item.id, label: `${item.name} ${item.description}` }))
      }, () => {
        this.state.plannedactivities.forEach(item => {
          this.setState(prevState => ({
            plannedactivitiesToSend: [...prevState.plannedactivitiesToSend, {
              activity: item.id,
              minute: mainData.plannedActivities.filter(f_item => f_item.activity.id === item.id)[0].minute
            }
          ]
          }))
        });
        mainData.unplannedActivities.forEach(item => {
          this.setState(prevState => ({
            unplannedactivitiesToSend: [...prevState.unplannedactivitiesToSend, {
              minute: item.minute,
              description: item.description,
              activity: item.activity.id,
              activityObj: { value: item.activity.id, label: item.activity.name },
              operationNumber: item.operationNumber ? item.operationNumber.id : null,
              operationNumberObj: item.operationNumber ? { value: item.operationNumber.id, label: item.operationNumber.name } : null
            }
          ]
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
            disabled
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
    const unplannedactivityElem = index => {
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
                <label htmlFor={'inputUn' + index + 'waktu'}>Waktu</label>
                <input
                  id={'inputUn' + index + 'waktu'}
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
                <label htmlFor={'inputUn' + index + 'description'}>Remarks</label>
                <input
                  id={'inputUn' + index + 'description'}
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
        id: this.state.id,
        shift: this.state.shiftSelected.value,
        group: this.state.groupSelected.value,
        proccessName: this.state.proccessnameSelected.value,
        lineNumber: this.state.linenumberSelected.value,
        modelType: this.state.modeltypeSelected.value,
        targetAmount, actualAmount, okAmount, startAt, finishAt,
        plannedActivities: this.state.plannedactivitiesToSend,
        unplannedActivities: this.state.unplannedactivitiesToSend
      }
      try {
        const newProduction = await axios_put(
          `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production/${this.state.id}`,
          reqBody, this.props.store.auth.access_token
        );
        this.props.history.push('./detail/' + newProduction.id);
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
      <Card title="Detail" col={6}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <form
          onSubmit={this.handleSubmit}
          noValidate>
          <div className="text-center">
            <h4 className="font-weight-bold">{this.state.code}</h4>            
          </div>
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
                  disabled
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
                  disabled
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
                  disabled
                  />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputStartAt">Start</label>
                <input
                  id="inputStartAt"
                  className="form-control"
                  value={moment(this.state.startAt).format('DD/MM/YYYY HH:mm')}
                  disabled
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputFinishAt">Finish</label>
                <input
                  id="inputFinishAt"
                  className="form-control"
                  value={moment(this.state.finishAt).format('DD/MM/YYYY HH:mm')}
                  disabled
                />
              </div>
            </div>
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Planning Down Time</h5>
          <div className="row">
            {this.renderPlannedActivity().map((component, i) => {
              return (<div className="col-4" key={i}>{component}</div>);
            })}
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Unplanning Down Time</h5>
          {this.renderUnplannedActivity().map(component => {
            return component;
          })}
          <div className="d-flex">
            <Link to="/dashboard/production"
              className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
            </Link>
            <Link to={{pathname: `/dashboard/production/edit/${this.state.id}`}}
              className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faEdit} /></i>&nbsp;Edit
            </Link>
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
export default connect(mapState)(Detail);
