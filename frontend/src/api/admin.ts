import { apiClient } from "./axios";

export interface AdminMetrics {
  total_articles: number;
  total_authors: number;
  total_submissions: number;
  pending_submissions: number;
}

export interface Submission {
  id: number;
  title: string;
  author_name: string;
  author_email: string;
  статус: "ожидает" | "одобрена" | "отклонена" | "опубликована";
  created_at: string;
}

export const getAdminMetrics = () =>
  apiClient.get<AdminMetrics>("/api/admin/metrics").then((r) => r.data);

export const getAdminSubmissions = (params?: { статус?: string }) =>
  apiClient
    .get<Submission[]>("/api/admin/submissions", { params })
    .then((r) => r.data);

export const updateSubmissionStatus = (
  id: number,
  статус: string
) =>
  apiClient
    .patch(`/api/admin/submissions/${id}`, { статус })
    .then((r) => r.data);

export const publishSubmission = (id: number) =>
  apiClient
    .post(`/api/admin/submissions/${id}/publish`)
    .then((r) => r.data);

export const getAdminArticles = () =>
  apiClient.get("/api/admin/articles").then((r) => r.data);

export const deleteAdminArticle = (id: number) =>
  apiClient.delete(`/api/admin/articles/${id}`).then((r) => r.data);
