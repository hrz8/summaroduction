import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import Card from '../../common/Card';
import { axios_get, handle_error } from '../../../helpers';

class Detail extends Component {
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

  render = () => {
    return (
      <Card title={`Detil User`} col={6}>
        {this.props.store.auth.role === "su" ?
        <>
          <div className="form-group">
            <label htmlFor="inputFname">First Name</label>
            <input
              id="inputFname"
              type="text"
              className="form-control"
              name="firstName"
              value={this.state.firstName}
              disabled />
          </div>
          <div className="form-group">
            <label htmlFor="inputLname">Last Name</label>
            <input
              id="inputLname"
              type="text"
              className="form-control"
              name="lastName"
              value={this.state.lastName}
              disabled />
          </div>
          <div className="form-group">
            <label htmlFor="inputUsername">Username</label>
            <input
              id="inputUsername"
              type="text"
              className="form-control"
              name="username"
              value={this.state.username}
              disabled />
          </div>
          <div className="form-group">
            <label htmlFor="inputRole">Role</label>
            <input
              id="inputRole"
              type="text"
              className="form-control"
              name="role"
              value={this.state.role}
              disabled />
          </div>
          <div className="d-flex">
            <Link
              to={{ pathname: `/dashboard/users` }}
              className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
            </Link>
            <Link
              to={{ pathname: `/dashboard/users/edit/${this.state.id}` }}
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
