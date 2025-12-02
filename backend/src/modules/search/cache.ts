// Placeholder cache. Swap for SQLite-backed cache when search provider is enabled.
export const readFromCache = async <T>(_key: string): Promise<T | null> => null;
export const writeToCache = async <T>(_key: string, _value: T): Promise<void> => {
  return;
};
