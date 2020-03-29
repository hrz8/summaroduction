import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { handle_error, axios_post } from '../../../helpers';
import Card from '../../common/Card';

class AddStandard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
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
        const data = await axios_post(
          `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/${this.props.uri}`,
          this.state, this.props.store.auth.access_token
        );
        this.props.history.push('./detail/' + data.id)
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
      <Card title={`Tambah Data ${this.props.label}`} col={6}>
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
            <label htmlFor="inputKeterangan">Keterangan</label>
            <input
              id="inputKeterangan"
              type="text"
              className="form-control"
              name="description"
              value={this.state.description}
              onChange={this.handleChange} />
          </div>
          <div className="d-flex">
            <Link
              to={{ pathname: `/dashboard/${this.props.uri}` }}
              className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
            </Link>
            <button type="submit"
              className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
              <i><FontAwesomeIcon icon={faPlusSquare} /></i>&nbsp;Tambahkan
            </button>
          </div>
        </form>
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(AddStandard);
