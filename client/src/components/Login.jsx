import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../store/actions/auth';
import Card from './common/Card';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e => {
      this.setState({
          [e.target.name]: e.target.value
      });
  }

  onSubmit = async e => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    }
    try {
      await this.props.dispatch(login(user));
    }
    catch(err) {
      alert(err.response.data.message);
    }
    
  }

  render() {
    return (
      <Card title={"Login"} col={4}>
        <form noValidate onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={this.onChange} />
          </div>
          <div className="row">
            <button type="submit" className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">Login</button>
          </div>
        </form>
      </Card>
    )
  }
}

const mapState = (state) => ({ store: state });
export default connect(mapState)(Login);
