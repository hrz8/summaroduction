import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import Card from '../../common/Card';
import { axios_get, handle_error } from '../../../helpers';

class DetailStandard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.colId,
      name: '',
      description: '',
      minuteDefault: 0
    }
  }

  componentDidMount = async () => {
    try {
      const data = await axios_get(
        `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/planned-activity/${this.state.id}`,
        this.props.store.auth.access_token
      );
      this.setState({ name: data.name, description: data.description, minuteDefault: data.minuteDefault });
    }
    catch (err) {
      handle_error(err.response.data.statusCode);
    }
  }

  render = () => {
    return (
      <Card title={`Detil Data Planned Activity`} col={6}>
        <div className="form-group">
          <label htmlFor="inputNama">Nama</label>
          <input
            id="inputNama"
            className="form-control"
            value={this.state.name}
            disabled />
        </div>
        <div className="form-group">
          <label htmlFor="inputKeterangan">Keterangan</label>
          <input
            id="inputKeterangan"
            className="form-control"
            value={this.state.description}
            disabled />
        </div>
        <div className="form-group">
          <label htmlFor="inputDefault">Default Waktu</label>
          <input
            id="inputDefault"
            className="form-control"
            value={this.state.minuteDefault}
            disabled />
          <small className="form-text text-muted">menit</small>
        </div>
        <div className="d-flex">
          <Link
            to={{ pathname: `/dashboard/planned-activity` }}
            className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
            <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
          </Link>
          <Link
            to={{ pathname: `/dashboard/planned-activity/edit/${this.state.id}` }}
            className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
            <i><FontAwesomeIcon icon={faEdit} /></i>&nbsp;Edit
          </Link>
        </div>
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(DetailStandard);
