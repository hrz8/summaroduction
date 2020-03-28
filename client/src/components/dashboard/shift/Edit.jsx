import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Card from '../../common/Card';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render = () => {
    return (
      <Card title={"Edit Shift"} col={6}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
          <form
            onSubmit={this.handleSubmit}
            noValidate
          >

          </form> :
          <div className="text-center">
            <span>access denied</span>
          </div>}
      </Card>
    )
  }
}

const mapState = state => ({ store: state });
export default connect(mapState)(Edit);
