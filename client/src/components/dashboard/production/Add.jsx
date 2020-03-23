import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Card from '../../common/Card';
import { axios_get } from '../../../helpers';
import { logout } from '../../../store/actions/auth';

import 'react-datepicker/dist/react-datepicker.css';

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
      // params
      targetAmount: 1515,
      actualAmount: 0,
      okAmount: 0,
      startAt: new Date(),
      finishAt: new Date(),
      operationnumbers: []
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
      this.setState({
        shifts, groups, proccessnames, linenumbers, modeltypes, operationnumbers, plannedactivities,
        shiftsOptions: shifts.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        groupsOptions: groups.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        proccessnamesOptions: proccessnames.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        linenumbersOptions: linenumbers.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        modeltypesOptions: modeltypes.map(item => ({ value: item.id, label: `${item.name} ${item.description}` }))
      }, () => {
        this.state.plannedactivities.forEach(item => {
          this.setState(prevState => ({
            plannedactivitiesToSend: [...prevState.plannedactivitiesToSend, { id: item.id, minute: 0 }]
          }))
        });
      });
    }
    catch(err) {
      throw err
      // this.props.dispatch(logout());
      // this.props.history.push('/login');
    }
  }

  // select handle
  handleChangeShift = shiftSelected => { this.setState({ shiftSelected }, () => console.log(this.state)) }
  handleChangeGroup = groupSelected => { this.setState({ groupSelected }, () => console.log(this.state)) }
  handleChangeProccessname = proccessnameSelected => { this.setState({ proccessnameSelected }, () => console.log(this.state)) }
  handleChangeLinenumber = linenumberSelected => { this.setState({ linenumberSelected }, () => console.log(this.state)) }
  handleChangeModeltype = modeltypeSelected => { this.setState({ modeltypeSelected }, () => console.log(this.state)) }

  // time handle
  handleChangeStart = startAt => { this.setState({ startAt: startAt.getTime() }, () => console.log(this.state)) };

  handleChangeFinish = finishAt => { this.setState({ finishAt: finishAt.getTime() }, () => console.log(this.state)) };

  // number handle
  handleChangeNumber = e => {
    this.setState({
        [e.target.name]: parseInt(e.target.value)
    }, () => console.log(this.state));
  }

  handleChangePlanned = (e) => {
    let plannedactivitiesToSendTemp = [ ...this.state.plannedactivitiesToSend ];
    plannedactivitiesToSendTemp[e.target.dataset.index] = {
      id: e.target.dataset.idplannedactivity,
      minute: parseInt(e.target.value)
    };
    this.setState(
      { plannedactivitiesToSend: plannedactivitiesToSendTemp }, () => console.log(this.state)
    );
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

  render() {
    return (
      <Card title="Add" col={6}>
          {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
          <form
            // onSubmit={this.handleSubmit}
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
