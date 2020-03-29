import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { handle_error, axios_get, axios_put } from '../../../helpers';
import Card from '../../common/Card';

class EditStandard extends Component {
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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.name) {
      try {
        const data = await axios_put(
          `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/planned-activity/${this.state.id}`,
          this.state, this.props.store.auth.access_token
        );
        this.props.history.push('../detail/' + data.id)
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
      <Card title={`Edit Data Planned Activity`} col={6}>
        <form
          onSubmit={this.handleSubmit}
          noValidate>
          <div className="form-group">
            <label htmlFor="inputNama">Nama</label>
            <input
              id="inputNama"
              type="text"
              className="form-control"
              name="name"
              value={this.state.name}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="inputKeterangan">Keterangan (optional)</label>
            <input
              id="inputKeterangan"
              type="text"
              className="form-control"
              name="description"
              value={this.state.description}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="inputminuteDefault">Default Waktu</label>
            <input
              id="inputminuteDefault"
              type="number"
              min="0"
              className="form-control"
              name="minuteDefault"
              value={this.state.minuteDefault}
              onChange={this.handleChange} />
            <small className="form-text text-muted">menit</small>
          </div>
          <div className="d-flex">
            <Link
              to={{ pathname: `/dashboard/planned-activity/detail/${this.state.id}` }}
              className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Detil
            </Link>
            <button type="submit"
              className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faSave} /></i>&nbsp;Simpan
            </button>
          </div>
        </form>
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(EditStandard);
