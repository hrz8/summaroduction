import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { 
  faBars, 
  faUserAlt, 
  faTachometerAlt, 
  faBox, 
  faList } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../store/actions/auth';
import { connect } from 'react-redux';

class Navbar extends Component {
  logout = (e) => {
    e.preventDefault();
    this.props.dispatch(logout());
    this.props.history.push('/login');
}

  render() {
    return (
      <nav className="navbar fixed-top navbar-toggleable-md navbar-expand-lg scrolling-navbar double-nav" aria-label="breadcrumb">
        <div className="float-left">
          <a href="/#" data-activates="slide-out" className="button-collapse black-text">
            <FontAwesomeIcon icon={faBars} />
          </a>
        </div>
        <div className="pl-lg-3">
          <ol className="breadcrumb clearfix d-none align-items-center d-md-inline-flex pt-0">
            <li className="breadcrumb-item black-text">
              <Link to='/link'><FontAwesomeIcon icon={faTachometerAlt} />
                &nbsp;Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item black-text">
              <Link to='/link'><FontAwesomeIcon icon={faBox} />
                &nbsp;Data
              </Link>
            </li>
            <li className="breadcrumb-item black-text"><FontAwesomeIcon icon={faList} />
              &nbsp;List
            </li>
          </ol>
        </div>
        <ul className="nav navbar-nav nav-flex-icons ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdownMenuLink" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <FontAwesomeIcon icon={faUserAlt} />&nbsp;Super Admin (superadmin)
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <Link to="/account/change-password" className="dropdown-item">Change Password</Link>
              <a href="/#" className="dropdown-item" onClick={this.logout}>Logout</a>
            </div>
          </li>
        </ul>
      </nav>
    )
  }
}

const mapState = (state) => ({ store: state });
export default connect(mapState)(withRouter(Navbar));
