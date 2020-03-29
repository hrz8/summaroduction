import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import Card from '../../common/Card';
import { axios_get } from '../../../helpers';

class DetailStandard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.colId,
      name: '',
      description: ''
    }
  }

  componentDidMount = async () => {
    const data = await axios_get(
      `http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/${this.props.uri}/${this.state.id}`,
      this.props.store.auth.access_token
    );
    
    this.setState({ name: data.name, description: data.description });
  }

  render = () => {
    return (
      <Card title={`Detil Data ${this.props.label}`} col={6}>
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
        <div className="d-flex">
          <Link
            to={{ pathname: `/dashboard/${this.props.uri}` }}
            className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
            <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
          </Link>
          <Link
            to={{ pathname: `/dashboard/${this.props.uri}/edit/${this.state.id}` }}
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
