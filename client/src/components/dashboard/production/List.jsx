import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {

    return (
      <Card title={"Production"} col={12}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <>
          <div className="row align-items-center">
            <div className="col-md-3 pr-md-1 mb-md-0 mb-2">
              <label className="sr-only" htmlFor="search-dt">Cari</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="q"
                  className="form-control bg-grey focus"
                  id="search-dt"
                  placeholder="Cari..."
                  value={this.state.q}
                  onChange={this.handleChange}></input>
                <i><FontAwesomeIcon icon={faSearch} /></i>
              </div>
            </div>
            <div className="col-md-2 p-md-1 text-center text-md-left">
              <button
                className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                onClick={this.handleSearch}>
                <FontAwesomeIcon icon={faSearch} />&ensp;Cari
              </button>
            </div>
            <div className="col-md-3 ml-md-auto text-center text-md-right">
              <Link
                to="/dashboard/production/add"
                className="btn btn-cc btn-cc-primary btn-cc-radius-extra ml-0 py-2 px-5 px-md-2">
                <FontAwesomeIcon icon={faPlus} />&ensp;Tambah
              </Link>
            </div>
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
export default connect(mapState)(List);
