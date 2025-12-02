export type SearchInput = {
  query: string;
  tags?: string[];
};

export type SearchResult<T> = {
  items: T[];
};

// Placeholder provider that returns empty results until OpenAI integration.
export const searchProvider = async <T>(_input: SearchInput): Promise<SearchResult<T>> => {
  return { items: [] };
};
