import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Card from '../../common/Card';
import { axios_get } from '../../../helpers';
import { logout } from '../../../store/actions/auth';

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
      operationnumbers: []
    }
    this.handleChangeShift = this.handleChangeShift.bind(this);
    this.handleChangeGroup = this.handleChangeGroup.bind(this);
    this.handleChangeProccessname = this.handleChangeProccessname.bind(this);
    this.handleChangeLinenumber = this.handleChangeLinenumber.bind(this);
    this.handleChangeModeltype = this.handleChangeModeltype.bind(this);
  }

  async componentDidMount() {
    try {
      const shifts = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/shift`, this.props.store.auth.access_token
      );
      const groups = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/group`, this.props.store.auth.access_token
      );
      const proccessnames = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/proccess-name`, this.props.store.auth.access_token
      );
      const linenumbers = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/line-number`, this.props.store.auth.access_token
      );
      const modeltypes = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/model-type`, this.props.store.auth.access_token
      );
      const operationnumbers = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/operation-number`, this.props.store.auth.access_token
      );
      this.setState({
        shifts, groups, proccessnames, linenumbers, modeltypes, operationnumbers,
        shiftsOptions: shifts.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        groupsOptions: groups.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        proccessnamesOptions: proccessnames.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        linenumbersOptions: linenumbers.map(item => ({ value: item.id, label: `${item.name} ${item.description}` })),
        modeltypesOptions: modeltypes.map(item => ({ value: item.id, label: `${item.name} ${item.description}` }))
      }, () => console.log(this.state));
    }
    catch(err) {
      this.props.dispatch(logout());
      this.props.history.push('/login');
    }
    
    // axios.post(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3028/operator/detail`, { id: this.state.id })
    //   .then(response => {
    //     const roleOptions = [
    //       { value: 'su', label: 'Super Admin' },
    //       { value: 'admin', label: 'Admin' },
    //       { value: 'operator', label: 'Operator' }
    //     ];
    //     const myRole = roleOptions.find(o => o.value === response.data.message.role);
    //     this.setState({
    //       code: response.data.message.code,
    //       name: response.data.message.name,
    //       role: myRole.label
    //     });
    //   })
    //   .catch(err => console.log(err.response.data.message));
  }

  handleChangeShift(shiftSelected) { this.setState({ shiftSelected }, () => console.log(this.state)) }
  handleChangeGroup(groupSelected) { this.setState({ groupSelected }, () => console.log(this.state)) }
  handleChangeProccessname(proccessnameSelected) { this.setState({ proccessnameSelected }, () => console.log(this.state)) }
  handleChangeLinenumber(linenumberSelected) { this.setState({ linenumberSelected }, () => console.log(this.state)) }
  handleChangeModeltype(modeltypeSelected) { this.setState({ modeltypeSelected }, () => console.log(this.state)) }

  render() {
    return (
      <Card title="Add" col={6}>
          {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
          <form
            // onSubmit={this.handleSubmit}
            noValidate>
            <div className="form-group">
              <label htmlFor="inputShift">Shift</label>
              <Select
                id="inputShift"
                placeholder="Pilih Shift"
                value={this.state.shiftSelected}
                onChange={this.handleChangeShift}
                options={this.state.shiftsOptions} />
            </div>
            <div className="form-group">
              <label htmlFor="inputGroup">Group</label>
              <Select
                id="inputGroup"
                placeholder="Pilih Group"
                value={this.state.groupSelected}
                onChange={this.handleChangeGroup}
                options={this.state.groupsOptions} />
            </div>
            <div className="form-group">
              <label htmlFor="inputProccessName">Proccess Name</label>
              <Select
                id="inputProccessName"
                placeholder="Pilih Proccess Name"
                value={this.state.proccessnameSelected}
                onChange={this.handleChangeProccessname}
                options={this.state.proccessnamesOptions} />
            </div>
            <div className="form-group">
              <label htmlFor="inputLineNumber">Line Number</label>
              <Select
                id="inputLineNumber"
                placeholder="Pilih Line Number"
                value={this.state.linenumberSelected}
                onChange={this.handleChangeLinenumber}
                options={this.state.linenumbersOptions} />
            </div>
            <div className="form-group">
              <label htmlFor="inputModel">Model</label>
              <Select
                id="inputModel"
                placeholder="Pilih Model"
                value={this.state.modeltypeSelected}
                onChange={this.handleChangeModeltype}
                options={this.state.modeltypesOptions} />
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
