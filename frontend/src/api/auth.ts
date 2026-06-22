import { apiClient } from "./axios";

export const register = (data: {
  email: string;
  password: string;
  полное_имя: string;
  role?: string;
}) => apiClient.post("/api/register", data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  apiClient
    .post<{ token: string; role: string; полное_имя?: string }>("/api/login", data)
    .then((r) => r.data);
