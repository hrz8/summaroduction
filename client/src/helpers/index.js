import jwt_decode from 'jwt-decode';

export const decodeAccessToken = (access_token) => {
  const jwt = jwt_decode(access_token);
  const { _id, password, createdAt, updatedAt, __v, ...userData } = jwt._doc;
  const { exp } = jwt;
  userData.id = _id;
  userData.access_token = access_token;
  return { userData, exp };
}
