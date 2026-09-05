import api from "./api";

export const getPono        = (pono) => api.get(`/bundle/pono/${encodeURIComponent(pono)}`).then(r => r.data);
export const getPonoProcess = (pono) => api.get(`/bundle/pono-process/${encodeURIComponent(pono)}`).then(r => r.data);
