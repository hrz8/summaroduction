import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../../common/Card';

class List extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Card title={"Production"} col={12}>
        {this.props.store.auth.role === "su" || this.props.store.auth.role === "admin" ?
        <div className="text-center">
          <span>wew</span>
        </div> :
        <div className="text-center">
          <span>access denied</span>
        </div>}
      </Card>
    )
  }
}

const mapState = (state) => ({ store: state });
export default connect(mapState)(List);
