import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Model"} uri={'model-type'}></AddStandard>
)

export default Add;
