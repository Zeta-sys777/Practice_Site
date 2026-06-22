import { apiClient } from "./axios";
import type { Article, ArticleFilters, PaginatedResponse } from "../types";

export const getArticles = (filters: ArticleFilters = {}) =>
  apiClient
    .get<PaginatedResponse<Article>>("/api/articles", { params: filters })
    .then((r) => r.data);

export const getArticle = (id: number) =>
  apiClient.get<Article>(`/api/articles/${id}`).then((r) => r.data);

export const getTopArticles = (limit = 3) =>
  apiClient
    .get<Article[]>("/api/articles", { params: { sort: "views", limit } })
    .then((r) => r.data);

export const downloadPdf = (id: number) =>
  apiClient.get(`/api/download/${id}/pdf`, { responseType: "blob" });
