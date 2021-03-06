import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../common/Card';
import moment from 'moment';
import { axios_get, oee, handle_error } from '../../../helpers';

import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.productionId,
      cycleTime: 0,
      code: null,
      // shift
      shiftSelected: '',
      // group
      groupSelected: '',
      // proccessname
      proccessnameSelected: '',
      // proccessname
      linenumberSelected: '',
      // proccessname
      modeltypeSelected: '',
      // planned activity
      plannedactivities: [],
      plannedactivitiesToSend: [],
      // unplanned activity
      unplannedactivities: [],
      unplannedactivitiesToSend: [],
      // params
      targetAmount: 1515,
      actualAmount: 0,
      okAmount: 0,
      reuseAmount: 0,
      startAt: (new Date()).getTime(),
      finishAt: (new Date()).getTime() + 3600000,
      // operation number
      operationnumbers: [],
      operationnumbersOptions: []
    }
    // activities
    this.handleChangeNumberUnplannedActivitiesJumlah = this.handleChangeNumberUnplannedActivitiesJumlah.bind(this);
  }

  componentDidMount = async () => {
    try {
      const mainData = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/production/${this.state.id}?populate=shift,group,proccessName,lineNumber,modelType,plannedActivities.activity,unplannedActivities.activity,unplannedActivities.operationNumber`,
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
      const { code, cycleTime, targetAmount, actualAmount, okAmount, reuseAmount, startAt, finishAt } = mainData;
      this.setState({
        code, cycleTime, operationnumbers, plannedactivities, unplannedactivities,
        // shift
        shiftSelected: `${mainData.shift.name} - ${mainData.shift.description}`,
        // group
        groupSelected: `${mainData.group.name} - ${mainData.group.description}`,
        // proccess name
        proccessnameSelected: `${mainData.proccessName.name} ${mainData.proccessName.description}`,
        // line number
        linenumberSelected: `${mainData.lineNumber.name} - ${mainData.lineNumber.description}`,
        // model type
        modeltypeSelected: `${mainData.modelType.name} ${mainData.modelType.description}`,
        // operation
        targetAmount, actualAmount, okAmount, reuseAmount, startAt, finishAt,
        // activity
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
              activity: item.activity.name,
              operationNumber: item.operationNumber ? item.operationNumber.name : ''
            }
          ]
          }))
        });
      });
    }
    catch (err) {
      handle_error(err.response.data.statusCode);
    }
  }

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
      const activity = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].activity : '';
      const operationnumber = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].operationNumber : '';
      const minute = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].minute : 0;
      const description = this.state.unplannedactivitiesToSend[index] ? this.state.unplannedactivitiesToSend[index].description : '';
      return (
        <div key={index}>
          <h6 style={{fontWeight: 'bold'}}>{'Activity ' + (index + 1)}</h6>
          <div className="ml-5">
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>Activity</label>
                  <input
                    type="text"
                    className="form-control"
                    value={activity}
                    disabled />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Op No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={operationnumber}
                    disabled />
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
                    disabled />
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
                    disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    };
    for (let i = 0; i < this.state.unplannedactivitiesToSend.length ; i++) {
      unplannedactivitiesForm.push(unplannedactivityElem(i));
    }
    return unplannedactivitiesForm;
  }

  render() {
    const dataOee = oee(this.state);
    console.log(dataOee)
    return (
      <Card title="Detail" col={11}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <>
          <div className="text-center">
            <h4 className="font-weight-bold">{this.state.code}</h4>            
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Summary&nbsp;<small>CT: {this.state.cycleTime}s</small></h5>
          <div className="table-responsive">
            <table className="table">
                <thead>
                  <tr>
                    <th className="font-reset">OK</th>
                    <th className="font-reset">OK(+RE)</th>
                    <th className="font-reset">NG</th>
                    <th className="font-reset">Efficiency</th>
                    <th className="font-reset">Availability</th>
                    <th className="font-reset">Performance</th>
                    <th className="font-reset">QualityRate</th>
                    <th className="font-reset">QualityRate2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-italic">
                    <td className="font-reset">{dataOee.qRate}%</td>
                    <td className="font-reset">{dataOee.qRate2}%</td>
                    <td className="font-reset">{dataOee.ngRate}%</td>
                    <td className="font-reset">{dataOee.eff}%</td>
                    <td className="font-reset">{dataOee.avail}%</td>
                    <td className="font-reset">{dataOee.performance}%</td>
                    <td className="font-reset">{dataOee.qRate}%</td>
                    <td className="font-reset">{dataOee.qRate2}%</td>
                  </tr>
                  <tr className="font-italic">
                    <td colSpan="7" className="font-weight-bold font-medium">OEE</td>
                    <td className="font-weight-bold color-secondary font-medium">{dataOee.oee}%</td>
                  </tr>
                  <tr className="font-italic">
                    <td colSpan="7" className="font-weight-bold font-medium">OEE2</td>
                    <td className="font-weight-bold color-secondary font-medium">{dataOee.oee2}%</td>
                  </tr>
                  <tr className="font-italic">
                    <td colSpan="7" className="font-weight-bold font-medium">OEE3</td>
                    <td className="font-weight-bold color-secondary font-medium">{dataOee.oee3}%</td>
                  </tr>
                </tbody>
              </table>
          </div>
          <h5 style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Condition</h5>
          <div className="form-group">
            <label htmlFor="inputModel">Model</label>
            <input
              id="inputModel"
              type="text"
              className="form-control"
              value={this.state.modeltypeSelected}
              disabled />
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputShift">Shift</label>
                <input
                  id="inputShift"
                  type="text"
                  className="form-control"
                  value={this.state.shiftSelected}
                  disabled />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputGroup">Group</label>
                <input
                  id="inputGroup"
                  type="text"
                  className="form-control"
                  value={this.state.groupSelected}
                  disabled />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputProccessName">Proccess Name</label>
                <input
                  id="inputProccessName"
                  type="text"
                  className="form-control"
                  value={this.state.proccessnameSelected}
                  disabled />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="inputLineNumber">Line Number</label>
                <input
                  id="inputLineNumber"
                  type="text"
                  className="form-control"
                  value={this.state.linenumberSelected}
                  disabled />
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
          <div className="row">
          <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputRef">Ref Time</label>
                <input
                  id="inputRef"
                  className="form-control"
                  value={dataOee.refTime}
                  disabled
                />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputPBT">PBT</label>
                <input
                  id="inputPBT"
                  className="form-control"
                  value={dataOee.pbtTime}
                  disabled
                />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="inputAPT">APT</label>
                <input
                  id="inputAPT"
                  className="form-control"
                  value={dataOee.busyTime}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
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
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="inputAktual">Input</label>
                <input
                  id="inputAktual"
                  type="number"
                  className="form-control"
                  name="actualAmount"
                  value={this.state.actualAmount}
                  disabled
                  />
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="inputNG">NG</label>
                <input
                  id="inputNG"
                  type="number"
                  className="form-control"
                  name="ngAmount"
                  value={dataOee.ng}
                  disabled
                  />
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
            <div className="col-2">
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
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="inputReuse">Reuse</label>
                <input
                  id="inputReuse"
                  type="number"
                  className="form-control"
                  name="reuseAmount"
                  value={this.state.reuseAmount}
                  disabled
                  />
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="inputFY">Final OK</label>
                <input
                  id="inputFY"
                  type="number"
                  className="form-control"
                  name="fyAmount"
                  value={this.state.reuseAmount + this.state.okAmount}
                  disabled
                  />
                  <small className="form-text text-muted">pcs</small>
              </div>
            </div>
          </div>
          <h5><span style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Planning Down Time</span> <span className="font-italic font-weight-bold color-secondary">{dataOee.planDtTime} menit</span></h5>
          <div className="row">
            {this.renderPlannedActivity().map((component, i) => {
              return (<div className="col-4" key={i}>{component}</div>);
            })}
          </div>
          <h5><span style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Unplanning Down Time</span> <span className="font-italic font-weight-bold color-secondary">{dataOee.unplanDtTime} menit</span></h5>
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
        </> :
        <div className="text-center">
          <span>access denied</span>
        </div>}                         
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(Detail);
