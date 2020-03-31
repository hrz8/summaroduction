import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { logout } from '../store/actions/auth';

export const decodeAccessToken = (access_token) => {
  const jwt = jwt_decode(access_token);
  const { _id, password, createdAt, updatedAt, __v, ...userData } = jwt._doc;
  const { exp } = jwt;
  userData.id = _id;
  userData.access_token = access_token;
  return { userData, exp };
}

export const axios_get = async (url, access_token) => {
  try {
    const results = await axios.get(
      url, { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return results.data.data;
  }
  catch (err) {
    throw err;
  }
}

export const axios_post = async (url, body, access_token) => {
  try {
    const results = await axios.post(
      url, body, { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return results.data.data;
  }
  catch (err) {
    throw err;
  }
}

export const axios_put = async (url, body, access_token) => {
  try {
    const results = await axios.put(
      url, body, { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return results.data.data;
  }
  catch (err) {
    throw err;
  }
}

export const axios_delete = async (url, access_token) => {
  try {
    const results = await axios.delete(
      url, { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return results.data.data;
  }
  catch (err) {
    throw err;
  }
}

export const handle_error = code => {
  switch (code) {
    case 401:
      alert('session habis');
      this.props.dispatch(logout());
      this.props.history.push('/login');
      break;
    case 500:
      alert('server error');
      break;
    default:
      alert('error: ' + code);
      break;
  }
}

export const percentage = (num) => Math.min(Math.max(parseFloat(num), 0), 100);

export const oee = (production) => {
  const fy = production.okAmount + production.reuseAmount;
  const ng = production.actualAmount - production.okAmount;
  const ng2 = production.actualAmount - fy;
  const opTime = ((new Date(production.finishAt)).getTime() - (new Date(production.startAt)).getTime()) / 60000;
  let planDtTime = 0;
  let planDtTime3 = 0;
  let unplanDtTime = 0;
  const plan3 = ['5e6b54b996251e144c923884', '5e6b54d396251e144c923885', '5e6b54ff96251e144c92388a'];
  if (production.plannedActivities && production.unplannedActivities) {
    production.plannedActivities.forEach(item => {
      planDtTime += item.minute;
      if (plan3.includes(item.activity)) {
        planDtTime3 += item.minute;
      }
    });
    production.unplannedActivities.forEach(item => {
      unplanDtTime += item.minute;
    });
  }
  else {
    production.plannedactivitiesToSend.forEach(item => {
      planDtTime += item.minute;
      if (plan3.includes(item.activity)) {
        planDtTime3 += item.minute;
      }
    });
    production.unplannedactivitiesToSend.forEach(item => {
      unplanDtTime += item.minute;
    });
  }
  const totalDtTime = planDtTime + unplanDtTime;
  const runTime = opTime - totalDtTime;
  const needTime = parseFloat(((production.targetAmount * production.cycleTime) / 60).toFixed());
  // percentage
  const eff = parseFloat(percentage(((runTime / needTime) * 100).toFixed(2)));
  const avail = parseFloat(percentage(((runTime / (opTime - planDtTime)) * 100).toFixed(2)));
  const performance = parseFloat(percentage(((((production.cycleTime * production.actualAmount) / 60) / needTime) * 100).toFixed(2)));
  const ngRate = parseFloat(percentage(((ng / production.actualAmount) * 100).toFixed(2)));
  const ngRate2 = parseFloat(percentage(((ng2 / production.actualAmount) * 100).toFixed(2)));
  const qRate = parseFloat(percentage(((production.okAmount / production.actualAmount) * 100).toFixed(2)));
  const qRate2 = parseFloat(percentage(((fy / production.actualAmount) * 100).toFixed(2)));
  const oee = parseFloat(percentage(((avail * performance * qRate * 100) / 1000000).toFixed(2)));
  const oee2 = parseFloat(percentage(((avail * performance * qRate2 * 100) / 1000000).toFixed(2)));
  // comma
  const effComma = eff.toString().replace('.', ',');
  const availComma = avail.toString().replace('.', ',');
  const performanceComma = performance.toString().replace('.', ',');
  const ngRateComma = ngRate.toString().replace('.', ',');
  const ngRate2Comma = ngRate2.toString().replace('.', ',');
  const qRateComma = qRate.toString().replace('.', ',');
  const qRate2Comma = qRate2.toString().replace('.', ',');
  const oeeComma = oee.toString().replace('.', ',');
  const oee2Comma = oee2.toString().replace('.', ',');
  return {
    fy, opTime, planDtTime, planDtTime3, unplanDtTime, totalDtTime, runTime, needTime, 
    eff, avail, performance, ng, ng2, ngRate, ngRate2, qRate, qRate2, oee, oee2,
    effComma, availComma, performanceComma, ngRateComma, ngRate2Comma, qRateComma,
    qRate2Comma, oeeComma, oee2Comma
  }
}


export const getTarget = (state) => {
  const perHour = Math.floor(Math.floor((3600 / state.cycleTime)).toFixed() * 0.96).toFixed(2);
  const hour = (((state.finishAt - state.startAt) / (1000 * 60 * 60)) % 24).toFixed(2);
  const minute = Math.floor(hour * 60);
  const minuteBersih = minute - oee(state).planDtTime3;
  return ((minuteBersih / 60) * perHour).toFixed();
}
