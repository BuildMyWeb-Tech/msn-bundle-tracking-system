import api from "./api";

export const getFabricPcWt    = (pono) => api.get(`/fabric/pcwt/${encodeURIComponent(pono)}`).then(r => r.data);
export const updateFabricPcWt = (body) => api.put("/fabric/pcwt", body).then(r => r.data);
