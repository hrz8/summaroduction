import React from 'react';
import EditStandard from '../../common/crud/EditStandard';

const Edit = (props) => (
  <EditStandard match={props.match} history={props.history} label={"Line Number"} uri={'line-number'}></EditStandard>
)

export default Edit;
