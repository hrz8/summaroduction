import React from 'react';
import { withRouter } from 'react-router-dom';

const Container = (props) => (
  <div className="container-fluid">
    <div className="row justify-content-center">
      {props.children}
    </div>
  </div>
)

export default withRouter(Container);
