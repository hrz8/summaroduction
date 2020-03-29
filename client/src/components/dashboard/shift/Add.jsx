import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Shift"} uri={'shift'}></AddStandard>
)

export default Add;
