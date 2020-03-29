import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Operation Number"} uri={'operation-number'}></DetailStandard>
)

export default Detail;
