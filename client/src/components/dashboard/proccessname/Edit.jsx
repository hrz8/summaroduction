import React from 'react';
import EditStandard from '../../common/crud/EditStandard';

const Edit = (props) => (
  <EditStandard match={props.match} history={props.history} label={"Proccess Name"} uri={'proccess-name'}></EditStandard>
)

export default Edit;
