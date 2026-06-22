import { apiClient } from "./axios";
import type { News } from "../types";

export const getNews = (params?: { page?: number; limit?: number }) =>
  apiClient.get<News[]>("/api/news", { params }).then((r) => r.data);

export const getNewsItem = (id: number) =>
  apiClient.get<News>(`/api/news/${id}`).then((r) => r.data);
