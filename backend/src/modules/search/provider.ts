import { listFirms } from "../firms/repo";
import { listStartups } from "../startups/repo";
import { listCommunities } from "../communities/repo";

export type SearchInput = {
  query: string;
  tags?: string[];
  limit?: number;
  page?: number;
};

export type SearchResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

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

type SearchDocument = {
  id: string;
  kind: SearchHit["kind"];
  name: string;
  description?: string;
  website?: string;
  tags: string[];
  stage?: string;
  category?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  tokens: string[];
};

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const buildDocuments = async (): Promise<SearchDocument[]> => {
  const [firms, startups, communities] = await Promise.all([listFirms(), listStartups(), listCommunities()]);

  const toDocTokens = (name: string, description?: string, tags?: string[], extra?: string[]) => {
    const weightedName = tokenize(name).flatMap((token) => [token, token]); // boost names
    const weightedTags = (tags ?? []).flatMap((tag) => tokenize(tag).flatMap((token) => [token, token]));
    const extraTokens = (extra ?? []).flatMap((token) => tokenize(token));
    const body = tokenize(description ?? "");
    return [...weightedName, ...weightedTags, ...extraTokens, ...body];
  };

  const firmDocs: SearchDocument[] = firms.map((firm) => ({
    id: firm.id,
    kind: "firm",
    name: firm.name,
    description: firm.description,
    website: firm.website,
    tags: firm.tags,
    stage: firm.stageFocus,
    location: firm.location,
    tokens: toDocTokens(firm.name, firm.description, firm.tags, [firm.stageFocus ?? ""])
  }));

  const startupDocs: SearchDocument[] = startups.map((startup) => ({
    id: startup.id,
    kind: "startup",
    name: startup.name,
    description: startup.description,
    website: startup.website,
    tags: startup.tags,
    stage: startup.stage,
    location: startup.location,
    tokens: toDocTokens(startup.name, startup.description, startup.tags, [startup.stage ?? "", startup.industry ?? ""])
  }));

  const communityDocs: SearchDocument[] = communities.map((community) => ({
    id: community.id,
    kind: "community",
    name: community.name,
    description: community.description,
    website: community.website,
    tags: community.tags,
    category: community.category,
    location: community.location,
    tokens: toDocTokens(community.name, community.description, community.tags, [community.category ?? ""])
  }));

  return [...firmDocs, ...startupDocs, ...communityDocs];
};

const bm25Score = (queryTokens: string[], documents: SearchDocument[]) => {
  const N = documents.length || 1;
  const avgDocLength =
    documents.reduce((sum, doc) => sum + doc.tokens.length, 0) / (documents.length || 1);

  const docFrequencies = new Map<string, number>();
  documents.forEach((doc) => {
    const uniqueTokens = new Set(doc.tokens);
    uniqueTokens.forEach((token) => {
      docFrequencies.set(token, (docFrequencies.get(token) ?? 0) + 1);
    });
  });

  const k1 = 1.5;
  const b = 0.75;

  return documents.map((doc) => {
    const termCounts = new Map<string, number>();
    doc.tokens.forEach((token) => termCounts.set(token, (termCounts.get(token) ?? 0) + 1));

    let score = 0;
    const docLength = doc.tokens.length || 1;

    queryTokens.forEach((token) => {
      const df = docFrequencies.get(token) ?? 0.5;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      const tf = termCounts.get(token) ?? 0;

      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + (b * docLength) / avgDocLength);
      score += idf * (numerator / denominator);
    });

    return { doc, score };
  });
};

export const searchProvider = async (input: SearchInput): Promise<SearchResult<SearchHit>> => {
  const documents = await buildDocuments();
  const tagsLower = (input.tags ?? []).map((t) => t.toLowerCase());
  const tagFilteredDocs = tagsLower.length
    ? documents.filter((doc) => tagsLower.every((tag) => doc.tags.some((t) => t.toLowerCase().includes(tag))))
    : documents;

  const queryTokens = tokenize(input.query || "");
  if (!queryTokens.length && !tagsLower.length) {
    return { items: [], total: 0, page: 1, limit: input.limit ?? 20 };
  }

  const limit = Math.min(Math.max(input.limit ?? 20, 1), 50);
  const page = Math.max(input.page ?? 1, 1);
  const start = (page - 1) * limit;
  const end = start + limit;

  if (!queryTokens.length && tagsLower.length) {
    const sorted = tagFilteredDocs
      .map<SearchHit>((doc) => ({
        id: doc.id,
        kind: doc.kind,
        name: doc.name,
        description: doc.description,
        website: doc.website,
        tags: doc.tags,
        stage: doc.stage,
        category: doc.category,
        location: doc.location,
        score: 1
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      items: sorted.slice(start, end),
      total: sorted.length,
      page,
      limit
    };
  }

  const scoredAll = bm25Score(queryTokens, tagFilteredDocs)
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  const items = scoredAll.slice(start, end).map<SearchHit>(({ doc, score }) => ({
    id: doc.id,
    kind: doc.kind,
    name: doc.name,
    description: doc.description,
    website: doc.website,
    tags: doc.tags,
    stage: doc.stage,
    category: doc.category,
    location: doc.location,
    score: Number(score.toFixed(4))
  }));

  return { items, total: scoredAll.length, page, limit };
};
