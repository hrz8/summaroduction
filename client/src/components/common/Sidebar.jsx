import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignInAlt,
  faIndustry,
  faAdjust,
  faUsers,
  faSpinner,
  faGripLines,
  faCubes,
  faRandom,
  faListOl,
  faBriefcase} from '@fortawesome/free-solid-svg-icons';
import logo from '../../logo.png';

class Sidebar extends Component {
  render() {
    return (
      <div id="slide-out" className="side-nav bg-admin-sidebar fixed">
        <ul className="custom-scrollbar">
          <li>
            <div className="logo-wrapper reset-border waves-light">
              <Link to="/">
                <img src={logo} className="img-fluid flex-center" alt="logo"></img>
              </Link>
            </div>
          </li>
          <li>
            <ul className="collapsible">
              {this.props.store.auth === null &&
                <>
                  <li>
                    <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Portal</a>
                    <div className="collapsible-body d-block">
                      <ul>
                        <li>
                          <NavLink to="/login" className="waves-effect pl-4"><FontAwesomeIcon icon={faSignInAlt} />&emsp;Login</NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              }
              {this.props.store.auth &&
                <>
                  <li>
                    <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Production</a>
                    <div className="collapsible-body d-block">
                      <ul>
                        <li>
                          <NavLink to="/dashboard/production" className="waves-effect pl-4"><FontAwesomeIcon icon={faIndustry} />&emsp;Main</NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Options</a>
                    <div className="collapsible-body d-block">
                      <ul>
                        <li>
                          <NavLink to="/dashboard/shift" className="waves-effect pl-4"><FontAwesomeIcon icon={faAdjust} />&emsp;Shift</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/group" className="waves-effect pl-4"><FontAwesomeIcon icon={faUsers} />&emsp;Group</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/proccess-name" className="waves-effect pl-4"><FontAwesomeIcon icon={faSpinner} />&emsp;Proccess Name</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/line-number" className="waves-effect pl-4"><FontAwesomeIcon icon={faGripLines} />&emsp;Line Number</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/model" className="waves-effect pl-4"><FontAwesomeIcon icon={faCubes} />&emsp;Model</NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Activity</a>
                    <div className="collapsible-body d-block">
                      <ul>
                        <li>
                          <NavLink to="/dashboard/planned-activity" className="waves-effect pl-4"><FontAwesomeIcon icon={faListOl} />&emsp;Planned Activities</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/unplanned-activity" className="waves-effect pl-4"><FontAwesomeIcon icon={faRandom} />&emsp;Unplanned Activities</NavLink>
                        </li>
                        <li>
                          <NavLink to="/dashboard/operation-number" className="waves-effect pl-4"><FontAwesomeIcon icon={faBriefcase} />&emsp;Operation Numbers</NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              }
            </ul>
          </li>
        </ul>
        <div className="sidenav-bg mask-strong"></div>
      </div>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(withRouter(Sidebar));
