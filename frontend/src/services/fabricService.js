import api from "./api";

export const getFabricPcWt    = (pono) => api.get(`/fabric/pcwt/${encodeURIComponent(pono)}`).then(r => r.data);
export const updateFabricPcWt = (body) => api.put("/fabric/pcwt", body).then(r => r.data);

export const getFabricData    = (barcode) => api.get(`/fabric/data/${encodeURIComponent(barcode)}`).then(r => r.data);

export const getFabricSurplus    = (pono) => api.get(`/fabric/surplus/${encodeURIComponent(pono)}`).then(r => r.data);
export const updateFabricSurplus = (body) => api.put("/fabric/surplus", body).then(r => r.data);
