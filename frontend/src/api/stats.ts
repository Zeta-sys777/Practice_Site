import { apiClient } from "./axios";
import type { Stats } from "../types";

export const getStats = () =>
  apiClient.get<Stats>("/api/stats").then((r) => r.data);
