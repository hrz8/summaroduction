import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faInfoCircle,
  faEdit,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Card from '../../common/Card';
import { axios_get, axios_delete, handle_error } from '../../../helpers';

class ListStandard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      data: []
    }
  }

  componentDidMount = async () => {
    await this.drawTable();
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  drawTable = async (url = `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/${this.props.uri}`) => {
    try {
      const data = await axios_get(url, this.props.store.auth.access_token);
      this.setState({ data });
    }
    catch (err) {
      handle_error(err.response.data.statusCode);
    }
  }

  handleSearch = async () => {
    let queryString = `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/${this.props.uri}`;
    if (this.state.q) {
      queryString += `?filter=name:${this.state.q}`;
    }
    await this.drawTable(queryString);
  }

  handleDelete = async e => {
    if (window.confirm(`Hapus data dengan id ${e.target.dataset.id} (${e.target.dataset.name}) ?`)) {
      try {
        const deleted = await axios_delete(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/${this.props.uri}/${e.target.dataset.id}`, this.props.store.auth.access_token)
        alert(`Data dengan id ${deleted.id} (${deleted.name}) berhasil dihapus.`);
        await this.drawTable();
      }
      catch (err) {
        handle_error(err.response.data.statusCode);
      }
    }
  }

  render = () => {
    const columns = [
      {
        Header: 'Nama',
        accessor: 'name',
        width: 200
      },
      {
        Header: 'Keterangan',
        accessor: 'description',
        width: 200
      },
      {
        Header: 'Action',
        sortable: false,
        width: 250,
        Cell: ({ original }) => (
          <>
            <Link to={{ pathname: `/dashboard/${this.props.uri}/detail/${original.id}` }}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faInfoCircle} />&nbsp;Detil
            </Link>
            <Link to={{ pathname: `/dashboard/${this.props.uri}/edit/${original.id}` }}
              className="btn btn-cc btn-cc-primary btn-cc-radius-normal p-1 mb-1">
              <FontAwesomeIcon icon={faEdit} />&nbsp;Edit
            </Link>
            {this.props.store.auth.role === "su" ?
              <button
                className="btn btn-cc btn-cc-secondary btn-cc-radius-normal p-1 mb-1"
                data-id={original.id}
                data-name={original.name}
                onClick={this.handleDelete}>
                <FontAwesomeIcon icon={faTrashAlt} />&nbsp;Hapus
            </button> : <></>}
          </>
        )
      }
    ]
    return (
      <Card title={this.props.label} col={12}>
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
                    placeholder="Nama..."
                    value={this.state.q}
                    onChange={this.handleChange}></input>
                  <i><FontAwesomeIcon icon={faSearch} /></i>
                </div>
              </div>
              <div className="col-md-2 p-md-1 text-center text-md-left">
                <button
                  className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"
                  onClick={this.handleSearch}
                >
                  <FontAwesomeIcon icon={faSearch} />&ensp;Cari
              </button>
              </div>
              <div className="col-md-3 ml-md-auto text-center text-md-right">
                <Link
                  to={{ pathname: `/dashboard/${this.props.uri}/add` }}
                  className="btn btn-cc btn-cc-primary btn-cc-radius-extra ml-0 py-2 px-5 px-md-2">
                  <FontAwesomeIcon icon={faPlus} />&ensp;Tambah
              </Link>
              </div>
            </div>
            <ReactTable
              data={this.state.data}
              columns={columns}
              pageSize={10}
              minRows={1} />
          </> :
          <div className="text-center">
            <span>access denied</span>
          </div>}
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(ListStandard);
