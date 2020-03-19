import React from 'react';
import { withRouter } from 'react-router-dom';

const Card = (props) => {
  const classCard = `card col-md-${props.col} pr-0 pl-0`;
  return (
    <div className={classCard}>
      <div className="card-header text-center h5 bg-dark text-white">{props.title}</div>
      <div className="card-body">
        {props.children}
      </div>
    </div>
  )
}

export default withRouter(Card);
