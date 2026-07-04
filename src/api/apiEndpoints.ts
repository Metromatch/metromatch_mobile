const API_V1 = '/api/v1/'
const AUTH = `${API_V1}auth/`;
const PROFILES = `${API_V1}profiles/`;
const DISCOVERY = `${API_V1}discovery`;
const SWIPES = `${API_V1}swipes`;
const MATCHES = `${API_V1}matches`;
const PRESENCE = `${API_V1}presence`;


export const AUTH_API = {
  LOGIN: `${AUTH}login`,
  SIGNUP: `${AUTH}signup`,
  VALIDATE: `${AUTH}validate`,
  LOGOUT: `${AUTH}logout`,
};

export const MASTER_LIST_API = {
  MASTER_LIST: `${API_V1}masterlist`,
};

export const PROFILES_API = {
  ME: `${PROFILES}me`,
  PROFILES,
};

export const DISCOVERY_API = {
  DISCOVER: DISCOVERY,
};

export const SWIPES_API = {
  SWIPES,
  SENT: `${SWIPES}/sent`,
  RECEIVED: `${SWIPES}/received`,
};

export const MATCHES_API = {
  MATCHES,
};

export const PRESENCE_API = {
  PRESENCE,
  ME: `${PRESENCE}/me`,
  NEARBY: `${PRESENCE}/nearby`,
};

const CHAT = `${API_V1}chat`;

export const CHAT_API = {
  TOKEN: `${CHAT}/token`,
  CONVERSATION: (matchId: string) => `${CHAT}/matches/${matchId}/conversation`,
  MESSAGES: (matchId: string) => `${CHAT}/matches/${matchId}/messages`,
};



