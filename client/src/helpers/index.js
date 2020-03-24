import jwt_decode from 'jwt-decode';
import axios from 'axios';

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
  catch(err) {
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
  catch(err) {
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
  catch(err) {
    throw err;
  }
}
