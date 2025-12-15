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

type SearchIndexItem = Omit<SearchHit, "score">;

export type SearchResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

let cachedIndex: SearchIndexItem[] | null = null;

const normalize = (value: string) => value.trim().toLowerCase();

const computeScore = (item: SearchIndexItem, queryTokens: string[], tagFilters: string[]) => {
  let score = 0;
  const name = normalize(item.name);
  const description = normalize(item.description || "");
  const tags = item.tags.map(normalize);

  if (queryTokens.length) {
    const haystack = `${name} ${description} ${tags.join(" ")}`;
    for (const token of queryTokens) {
      if (name.includes(token)) score += 4;
      if (haystack.includes(token)) score += 2;
    }
  }

  if (tagFilters.length) {
    for (const tag of tagFilters) {
      if (tags.some((t) => t.includes(tag))) {
        score += 3;
      }
    }
  }

  return score || 1;
};

const loadIndex = async () => {
  if (cachedIndex) return cachedIndex;
  const data = await apiGet<{ items: SearchIndexItem[] }>("search-index");
  cachedIndex = data.items;
  return cachedIndex;
};

export const fetchSearch = async (
  query: string,
  tags: string[] = [],
  page = 1,
  limit = 10
): Promise<SearchResult<SearchHit>> => {
  const index = await loadIndex();
  const tagFilters = tags.map(normalize);
  const queryTokens = query
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);

  const filtered = index.filter((item) =>
    tagFilters.length
      ? tagFilters.every((tag) => item.tags.some((t) => normalize(t).includes(tag)))
      : true
  );

  const scored = filtered
    .map((item) => ({ ...item, score: computeScore(item, queryTokens, tagFilters) }))
    .filter((item) => (queryTokens.length ? item.score > 1 : true))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const total = scored.length;
  const start = (page - 1) * limit;
  const items = scored.slice(start, start + limit);

  return { items, total, page, limit };
};
