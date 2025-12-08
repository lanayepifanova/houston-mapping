import { apiGet } from "./api";

export type SearchHit = {
  id: string;
  kind: "firm" | "startup" | "community";
  name: string;
  description?: string;
  website?: string;
  tags: string[];
  stage?: string;
  category?: string;
  score: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type SearchResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export const fetchSearch = (query: string, tags?: string[], page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (tags?.length) params.set("tags", tags.join(","));
  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  return apiGet<SearchResult<SearchHit>>(`/search?${params.toString()}`);
};
