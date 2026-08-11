import { AUTH_API, CHAT_API, DISCOVERY_API, FAVORITES_API, MASTER_LIST_API, MATCHES_API, PAYMENTS_API, PRESENCE_API, PROFILES_API, SUBSCRIPTIONS_API, SWIPES_API } from "./apiEndpoints";
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
  logout: () => http.post(AUTH_API.LOGOUT, {}),
};

export const MasterList = {
  masterList: REQUEST_TEMPLATES(MASTER_LIST_API.MASTER_LIST).create,
  metroStationList: REQUEST_TEMPLATES(MASTER_LIST_API.METRO_STATIONS).read,
}

export const Profiles = {
  createMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).create,
  getMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).read,
  updateMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).update,
  // deleteMyProfile: REQUEST_TEMPLATES(PROFILES_API.ME).delete,
  getProfiles: REQUEST_TEMPLATES(PROFILES_API.PROFILES).read,
}

export const Discovery = {
  // getNearby: (params = {}) => http.get(DISCOVERY_API.DISCOVER, { params }),
  getNearby: REQUEST_TEMPLATES(DISCOVERY_API.DISCOVER).create,
};

export const Swipes = {
  swipe: (payload: { toProfileId: string; swipeType: string }) =>
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
  presenceList: REQUEST_TEMPLATES(PRESENCE_API.HEATMAP).create
};

export const Chat = {
  getToken: () => http.get(CHAT_API.GET_TOKEN),
  createToken: () => http.get(CHAT_API.CREATE_TOKEN),
  getConversation: (matchId: string) => http.get(CHAT_API.CONVERSATION(matchId)),
  getMessages: (matchId: string, params: { pageSize?: number; order?: 'asc' | 'desc' } = {}) =>
    http.get(CHAT_API.MESSAGES(matchId), { params }),
  sendMessage: (matchId: string, body: string) =>
    http.post(CHAT_API.MESSAGES(matchId), { body }),

  getTwilioToken: REQUEST_TEMPLATES(CHAT_API.TWILIO_TOKEN).read
};

export const Favorites = {
  markFavorite: (payload: { profileId: string }) => http.post(FAVORITES_API.FAVORITES, payload),
  removeFavorite: (id: string) => http.delete(`${FAVORITES_API.FAVORITES}/${id}`),
}

export const Payments = {
  createPaymentOrder: REQUEST_TEMPLATES(PAYMENTS_API.CREATE_ORDER).create,
  verifyPayment: REQUEST_TEMPLATES(PAYMENTS_API.VERIFY).create,
  cancelPayment: REQUEST_TEMPLATES(PAYMENTS_API.CANCEL).read,
}

export const Subscriptions = {
  getPlans: REQUEST_TEMPLATES(SUBSCRIPTIONS_API.PLANS).read,
  getCredits: REQUEST_TEMPLATES(SUBSCRIPTIONS_API.CREDITS).read,
  deductCredits: REQUEST_TEMPLATES(SUBSCRIPTIONS_API.DEDUCT_CREDITS).create,
}

