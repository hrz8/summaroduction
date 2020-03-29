import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Operation Number"} uri={'operation-number'}></AddStandard>
)

export default Add;
