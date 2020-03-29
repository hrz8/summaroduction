import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Planned Activity"} uri={'planned-activity'}></DetailStandard>
)

export default Detail;
