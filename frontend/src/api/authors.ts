import { apiClient } from "./axios";
import type { Author, EditorialMember } from "../types";

export const getAuthors = () =>
  apiClient.get<Author[]>("/api/authors").then((r) => r.data);

export const getEditorial = () =>
  apiClient.get<EditorialMember[]>("/api/editorial").then((r) => r.data);
