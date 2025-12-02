import { apiGet } from "./api";

export type SearchResult<T> = {
  items: T[];
};

export const fetchSearch = (query: string, tags?: string[]) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (tags?.length) params.set("tags", tags.join(","));
  return apiGet<SearchResult<unknown>>(`/search?${params.toString()}`);
};
