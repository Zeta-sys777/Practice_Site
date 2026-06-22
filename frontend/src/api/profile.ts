import { apiClient } from "./axios";
import type { UserProfile } from "../types";

export const getProfile = () =>
  apiClient.get<UserProfile>("/api/profile").then((r) => r.data);

export const updateProfile = (data: Partial<UserProfile>) =>
  apiClient.put<UserProfile>("/api/profile", data).then((r) => r.data);
