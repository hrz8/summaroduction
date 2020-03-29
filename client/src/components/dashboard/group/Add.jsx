import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Group"} uri={'group'}></AddStandard>
)

export default Add;
