import React from 'react';
import DetailStandard from '../../common/crud/DetailStandard';

const Detail = (props) => (
  <DetailStandard match={props.match} label={"Shift"} uri={'shift'}></DetailStandard>
)

export default Detail;
