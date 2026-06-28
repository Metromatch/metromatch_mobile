import { AUTH_API, CHAT_API, DISCOVERY_API, MASTER_LIST_API, MATCHES_API, PRESENCE_API, PROFILES_API, SWIPES_API } from "./apiEndpoints";
import http from "./http";



const REQUEST_TEMPLATES = (endpoint: string) => ({
  create: (entity = '', payload: any, params = {}) => http.post(`${endpoint}/${entity || ''}`, payload, { params }),
  read: (entity = '', params = {}) => http.get(`${endpoint}/${entity || ''}`, { params }),
  update: (entity: string, payload: any, params = {}) => http.put(`${endpoint}/${entity || ''}`, payload, { params }),
  delete: (entity: string, params = {}) => http.delete(`${endpoint}/${entity || ''}`, { params }),
  modify: (entity: string, payload: any, params = {}) => http.patch(`${endpoint}/${entity || ''}`, payload, { params }),

});

export const Auth = {
  login: REQUEST_TEMPLATES(AUTH_API.LOGIN).create,
  signup: REQUEST_TEMPLATES(AUTH_API.SIGNUP).create,
  validateToken: REQUEST_TEMPLATES(AUTH_API.VALIDATE).read,
};

export const MasterList = {
  masterList: REQUEST_TEMPLATES(MASTER_LIST_API.MASTER_LIST).create,
}

export const Profiles = {
  createMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).create,
  getMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).read,
  updateMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).update,
  // deleteMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).delete,
  getProfiles: REQUEST_TEMPLATES(PROFILES_API.PROFILES).read,
}

export const Discovery = {
  getNearby: (params = {}) => http.get(DISCOVERY_API.DISCOVER, { params }),
};

export const Swipes = {
  swipe: (payload: { toUserId: string; swipeType: string }) =>
    http.post(SWIPES_API.SWIPES, payload),
  getSent: () => http.get(SWIPES_API.SENT),
  getReceived: () => http.get(SWIPES_API.RECEIVED),
};

export const Matches = {
  getMatches: () => http.get(MATCHES_API.MATCHES),
  getMatchById: (id: string) => http.get(`${MATCHES_API.MATCHES}/${id}`),
  unmatch: (id: string) => http.delete(`${MATCHES_API.MATCHES}/${id}`),
};

export const Presence = {
  updatePresence: (payload: { latitude: number; longitude: number; online?: boolean }) =>
    http.put(PRESENCE_API.PRESENCE, payload),
  setOffline: () => http.delete(PRESENCE_API.PRESENCE),
  getMyPresence: () => http.get(PRESENCE_API.ME),
  getNearby: (params = {}) => http.get(PRESENCE_API.NEARBY, { params }),
};

export const Chat = {
  getToken: () => http.get(CHAT_API.TOKEN),
  getConversation: (matchId: string) => http.get(CHAT_API.CONVERSATION(matchId)),
  getMessages: (matchId: string, params: { pageSize?: number; order?: 'asc' | 'desc' } = {}) =>
    http.get(CHAT_API.MESSAGES(matchId), { params }),
  sendMessage: (matchId: string, body: string) =>
    http.post(CHAT_API.MESSAGES(matchId), { body }),
};

