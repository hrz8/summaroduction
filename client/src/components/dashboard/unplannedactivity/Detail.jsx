import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Unplanned Activity"} uri={'unplanned-activity'}></DetailStandard>
)

export default Detail;
