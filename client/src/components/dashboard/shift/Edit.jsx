import React from 'react';
import EditStandard from '../../common/crud/EditStandard';

const Edit = (props) => (
  <EditStandard match={props.match} history={props.history} label={"Shift"} uri={'shift'}></EditStandard>
)

export default Edit;
