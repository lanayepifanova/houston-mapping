const DATA_BASE = `${import.meta.env.BASE_URL || "/"}data`;

const normalizePath = (path: string) => {
  const cleaned = path.replace(/^\//, "");
  return cleaned.endsWith(".json") ? cleaned : `${cleaned}.json`;
};

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${normalizePath(path)}`);
  if (!res.ok) {
    throw new Error(`Failed to load static data: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getBaseUrl = () => DATA_BASE;
