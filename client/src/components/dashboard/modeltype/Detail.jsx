import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Model"} uri={'model-type'}></DetailStandard>
)

export default Detail;
