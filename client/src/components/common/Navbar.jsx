import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { 
  faBars, 
  faUserAlt, 
  faTachometerAlt, 
  faList, 
  faCogs,
  faSignInAlt,
  faPlusSquare,
  faEdit,
  faInfoCircle,
  faKey,
  faIndustry,
  faUsers,
  faAdjust,
  faBoxOpen,
  faGripLines,
  faCubes,
  faListOl,
  faRandom,
  faBriefcase} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../store/actions/auth';


const breadcrumbData1 = [
  { name: 'dashboard', label: "Dashboard", logo: faTachometerAlt, link: "/" },
  { name: 'login', label: "Login", logo: faSignInAlt, link: "/login" },
  { name: 'account', label: "Account", logo: faCogs, link: "/account/change-password" },
]

const breadcrumbData2 = [
  { name: 'production', label: "Productions", logo: faIndustry, link: "/dashboard/production" },
  { name: 'shift', label: "Shifts", logo: faAdjust, link: "/dashboard/shift" },
  { name: 'group', label: "Groups", logo: faUsers, link: "/dashboard/group" },
  { name: 'proccess-name', label: "Proccess Names", logo: faBoxOpen, link: "/dashboard/proccess-name" },
  { name: 'line-number', label: "Line Numbers", logo: faGripLines, link: "/dashboard/line-number" },
  { name: 'model-type', label: "Models", logo: faCubes, link: "/dashboard/model-type" },
  { name: 'planned-activity', label: "Planned Activities", logo: faListOl, link: "/dashboard/planned-activity" },
  { name: 'unplanned-activity', label: "Unplanned Activities", logo: faRandom, link: "/dashboard/unplanned-activity" },
  { name: 'operation-number', label: "Operation Numbers", logo: faBriefcase, link: "/dashboard/operation-number" },
  { name: 'change-password', label: "Change Password", logo: faKey, link: "/account/change-password" }
]

const breadcrumbData3 = [
  { name: 'list', label: "List", logo: faList },
  { name: 'add', label: "Tambah", logo: faPlusSquare },
  { name: 'edit', label: "Edit", logo: faEdit },
  { name: 'detail', label: "Detil", logo: faInfoCircle }
]

class Navbar extends Component {
  logout = (e) => {
    e.preventDefault();
    this.props.dispatch(logout());
    this.props.history.push('/login');
  }

  getLocation() {
    const l = document.createElement("a");
    l.href = window.location.href;
    return l;
  }

  render() {
    const pathname = this.getLocation().pathname.startsWith("/") ? this.getLocation().pathname : "/" + this.getLocation().pathname;
        const pathsUri = pathname.split('/');
        const breadcrumb1 = breadcrumbData1.find(o => o.name === pathsUri[1]);
        const breadcrumb2 = breadcrumbData2.find(o => o.name === pathsUri[2]);
        const breadcrumb3 = (breadcrumb1 && breadcrumb1.name === 'dashboard') ? breadcrumbData3.find(o => o.name === (pathsUri[3] || 'list')) : null;
    return breadcrumb1 ? (
      <nav className="navbar fixed-top navbar-toggleable-md navbar-expand-lg scrolling-navbar double-nav" aria-label="breadcrumb">
        <div className="float-left">
          <a href="/#" data-activates="slide-out" className="button-collapse black-text">
            <FontAwesomeIcon icon={faBars} />
          </a>
        </div>
        <div className="pl-lg-3">
          <ol className="breadcrumb clearfix d-none align-items-center d-md-inline-flex pt-0">
            <li className="breadcrumb-item black-text">
              <Link to={breadcrumb1.link}><FontAwesomeIcon icon={breadcrumb1.logo} />
                &nbsp;{breadcrumb1.label}
              </Link>
            </li>
            {breadcrumb2 && <li className="breadcrumb-item black-text">
              <Link to={breadcrumb2.link}><FontAwesomeIcon icon={breadcrumb2.logo} />
                &nbsp;{breadcrumb2.label}
              </Link>
            </li>}
            {breadcrumb3 && <li className="breadcrumb-item black-text"><FontAwesomeIcon icon={breadcrumb3.logo} />
              &nbsp;{breadcrumb3.label}
            </li>}
          </ol>
        </div>
        {this.props.store.auth &&
          <ul className="nav navbar-nav nav-flex-icons ml-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdownMenuLink" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <FontAwesomeIcon icon={faUserAlt} />&nbsp;{this.props.store.auth.firstName} {this.props.store.auth.lastName} ({this.props.store.auth.username})
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                <Link to="/account/change-password" className="dropdown-item">Change Password</Link>
                <a href="/#" className="dropdown-item" onClick={this.logout}>Logout</a>
              </div>
            </li>
          </ul>
        }
      </nav>
    ) : (<></>)
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(withRouter(Navbar));
