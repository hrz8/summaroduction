import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Proccess Name"} uri={'proccess-name'}></DetailStandard>
)

export default Detail;
