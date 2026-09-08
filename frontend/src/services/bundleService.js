import api from "./api";

export const getPono        = (pono) => api.get(`/bundle/pono/${encodeURIComponent(pono)}`).then(r => r.data);
export const getPonoProcess = (pono) => api.get(`/bundle/pono-process/${encodeURIComponent(pono)}`).then(r => r.data);
export const getIssuedGrid  = (pono, uid) => api.get(`/bundle/issued-grid/${encodeURIComponent(pono)}/${encodeURIComponent(uid)}`).then(r => r.data);
