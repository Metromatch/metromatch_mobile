const API_V1 = '/api/v1/'
const AUTH = `${API_V1}auth/`;
const PROFILES = `${API_V1}profiles/`;


export const AUTH_API = {
  LOGIN: `${AUTH}login`,
  SIGNUP: `${AUTH}signup`,
  VALIDATE: `${AUTH}validate`,
};

export const MASTER_LIST_API = {
  MASTER_LIST: `${API_V1}masterlist`,
};

export const PROFILES_API = {
  ME: `${PROFILES}me`,
  PROFILES,
};



