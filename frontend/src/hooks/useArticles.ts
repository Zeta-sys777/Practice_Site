import { useQuery } from "@tanstack/react-query";
import { getArticles, getArticle, getTopArticles } from "../api/articles";
import type { ArticleFilters } from "../types";

export const useArticles = (filters: ArticleFilters = {}) =>
  useQuery({
    queryKey: ["articles", filters],
    queryFn: () => getArticles(filters),
  });

export const useArticle = (id: number) =>
  useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticle(id),
    enabled: !!id,
  });

export const useTopArticles = (limit = 3) =>
  useQuery({
    queryKey: ["articles", "top", limit],
    queryFn: () => getTopArticles(limit),
  });
