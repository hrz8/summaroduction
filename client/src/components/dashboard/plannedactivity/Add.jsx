import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Planned Activity"} uri={'planned-activity'}></AddStandard>
)

export default Add;
