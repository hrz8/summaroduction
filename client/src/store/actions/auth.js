import axios from 'axios';
import { LOGIN, LOGOUT } from '../constant/auth';
import { decodeAccessToken } from '../../helpers/';

export const login = user => async dispatch => {
  try {
    const response = await axios.post(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3029/auth/login`, user);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    dispatch({ type: LOGIN, payload: decodeAccessToken(access_token).userData });
    return response;
  }
  catch (err) {
    throw err;
  }
}

export const logout = () => {
    localStorage.removeItem('access_token');
    return { type: LOGOUT, payload: null };
};
