import React from 'react';
import AddStandard from '../../common/crud/AddStandard';

const Add = (props) => (
  <AddStandard history={props.history} label={"Proccess Name"} uri={'proccess-name'}></AddStandard>
)

export default Add;
