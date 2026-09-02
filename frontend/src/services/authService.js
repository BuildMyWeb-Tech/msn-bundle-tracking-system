import api from "./api";

export const loginUser = (body) => api.post("/auth/login", body).then(r => r.data);
