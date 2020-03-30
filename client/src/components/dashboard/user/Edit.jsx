import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { handle_error, axios_get, axios_put } from '../../../helpers';
import Card from '../../common/Card';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.userId,
      firstName: '',
      lastName: '',
      username: '',
      role: '',
      password: ''
    }
  }

  componentDidMount = async () => {
    try {
      const data = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/user/${this.state.id}`,
        this.props.store.auth.access_token
      );
      const { firstName, lastName, username, role } = data;
      this.setState({
        firstName, lastName, username, role
      });
    }
    catch (err) {
      handle_error(err.response.data.statusCode);
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.firstName && this.state.username && this.state.role) {
      try {
        const { password, ...req } = this.state
        const data = await axios_put(
          `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/user/${this.state.id}`,
          req, this.props.store.auth.access_token
        );
        this.props.history.push('../detail/' + data.id);
        if (this.state.password) {
          await axios_put(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/auth/change-password/${this.state.id}`, {
            admin: true,
            id: this.state.id,
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            role: this.state.role,
            password: this.state.password,
          }, this.props.store.auth.access_token);
        }
      }
      catch (err) {
        handle_error(err.response.data.statusCode);
      }
    }
    else {
      alert("Form tidak boleh kosong/salah.");
    }
  }

  render = () => {
    return (
      <Card title={`Edit Data ${this.props.label}`} col={6}>
        {this.props.store.auth.role === "su" ?
        <>
          <form
            onSubmit={this.handleSubmit}
            noValidate>
            <div className="form-group">
              <label htmlFor="inputFname">First Name</label>
              <input
                id="inputFname"
                type="text"
                className="form-control"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="inputLname">Last Name</label>
              <input
                id="inputLname"
                type="text"
                className="form-control"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="inputUsername">Username</label>
              <input
                id="inputUsername"
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="inputRole">Role</label>
              <input
                id="inputRole"
                type="text"
                className="form-control"
                name="role"
                value={this.state.role}
                onChange={this.handleChange} />
            <small className="text-center text-muted">pilihannya hanya "su" atau "admin" (huruf kecil), jangan typo!</small>
            </div>
            <div className="form-group">
              <label htmlFor="inputnewPassword">Password</label>
              <input
                id="inputnewPassword"
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.handleChange} />
            <small className="text-center text-muted">kosongkan jika tidak ingin mengganti password</small>
            </div>
            <div className="d-flex">
              <Link
                to={{ pathname: `/dashboard/users/detail/${this.state.id}` }}
                className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
                <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Detil
              </Link>
              <button type="submit"
                className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
                <i><FontAwesomeIcon icon={faSave} /></i>&nbsp;Simpan
              </button>
            </div>
          </form>
        </> :
        <div className="text-center">
          <span>access denied</span>
        </div>}
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(Edit);
