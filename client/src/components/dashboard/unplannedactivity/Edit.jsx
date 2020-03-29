import React from 'react';
import EditStandard from '../../common/crud/EditStandard';

const Edit = (props) => (
  <EditStandard match={props.match} history={props.history} label={"Unplanned Activity"} uri={'unplanned-activity'}></EditStandard>
)

export default Edit;
