import { LOGIN, LOGOUT } from '../constant/auth';
import { decodeAccessToken } from '../../helpers/';

const initialState = () => {
  const { access_token } = localStorage;
  if (!access_token) {
    return null;
  }
  const decodedToken = decodeAccessToken(access_token);
  if((new Date()).getTime() >= (decodedToken.exp * 1000)) {
    return null;
  }
  return decodedToken.userData;
};

export default function(state = initialState(), action) {
  switch(action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return action.payload;
    default:
      return state;
  }
}
