import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Unplanned Activity"} uri={'unplanned-activity'}></AddStandard>
)

export default Add;
