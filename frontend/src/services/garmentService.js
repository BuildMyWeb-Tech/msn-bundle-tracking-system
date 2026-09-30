import api from "./api";

export const getGarmentSurplus    = (pono) => api.get(`/garment/surplus/${encodeURIComponent(pono)}`).then(r => r.data);
export const updateGarmentSurplus = (body) => api.put("/garment/surplus", body).then(r => r.data);
