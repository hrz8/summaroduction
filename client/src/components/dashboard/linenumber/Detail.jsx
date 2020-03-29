import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Line Number"} uri={'line-number'}></DetailStandard>
)

export default Detail;
