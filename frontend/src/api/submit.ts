import { apiClient } from "./axios";
import type { Submission } from "../types";

export const submitArticle = (data: Submission) =>
  apiClient.post("/api/submit", data).then((r) => r.data);
