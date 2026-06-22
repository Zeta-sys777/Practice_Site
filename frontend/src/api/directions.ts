import { apiClient } from "./axios";
import type { Direction, Article } from "../types";

export const getDirections = () =>
  apiClient.get<Direction[]>("/api/directions").then((r) => r.data);

export const getDirection = (slug: string) =>
  apiClient
    .get<Direction & { articles: Article[] }>(`/api/directions/${slug}`)
    .then((r) => r.data);
