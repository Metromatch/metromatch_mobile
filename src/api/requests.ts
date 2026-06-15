import { AUTH_API, MASTER_LIST_API } from "./apiEndpoints";
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
};

export const MasterList = {
  masterList: REQUEST_TEMPLATES(MASTER_LIST_API.MASTER_LIST).create,
}
