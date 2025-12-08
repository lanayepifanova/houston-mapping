import { GeocodeResult, MetadataResult } from "./types";
import { ValidationError } from "../../core/errors";

const HOUSTON_LAT = 29.7604;
const HOUSTON_LNG = -95.3698;

// Deterministic pseudo-geocode for offline mode.
const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

export const geocodeProvider = async (address: string): Promise<GeocodeResult> => {
  if (!address.trim()) {
    throw new ValidationError("Address is required");
  }
  const hash = hashString(address);
  const latOffset = (hash % 1000) / 10000; // ~0.1 deg
  const lngOffset = ((hash >> 8) % 1000) / 10000;
  return {
    address,
    lat: Number((HOUSTON_LAT + latOffset * 0.01).toFixed(6)),
    lng: Number((HOUSTON_LNG + lngOffset * 0.01).toFixed(6)),
    precision: "approximate",
    source: "mock"
  };
};

const ROBOTS_CACHE = new Map<string, { fetchedAt: number; text: string }>();
const ROBOTS_TTL_MS = 10 * 60 * 1000;

const parseRobots = (robotsText: string, path: string) => {
  const lines = robotsText.split("\n").map((l) => l.trim());
  const disallow: string[] = [];
  const allow: string[] = [];
  let inStarSection = false;
  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    if (/^User-agent:\s*\*/i.test(line)) {
      inStarSection = true;
      continue;
    }
    if (/^User-agent:/i.test(line)) {
      inStarSection = false;
      continue;
    }
    if (!inStarSection) continue;
    const disallowMatch = line.match(/^Disallow:\s*(.*)/i);
    if (disallowMatch) {
      const rule = disallowMatch[1].trim();
      if (rule) disallow.push(rule);
      continue;
    }
    const allowMatch = line.match(/^Allow:\s*(.*)/i);
    if (allowMatch) {
      const rule = allowMatch[1].trim();
      if (rule) allow.push(rule);
    }
  }

  // Simple allow/deny: longest match wins.
  const matchingDisallow = disallow.filter((rule) => path.startsWith(rule));
  const matchingAllow = allow.filter((rule) => path.startsWith(rule));
  const longestDisallow = matchingDisallow.sort((a, b) => b.length - a.length)[0];
  const longestAllow = matchingAllow.sort((a, b) => b.length - a.length)[0];

  if (!longestDisallow && !longestAllow) return true;
  if (longestAllow && (!longestDisallow || longestAllow.length >= longestDisallow.length)) return true;
  return false;
};

const isAllowedByRobots = async (target: URL): Promise<boolean> => {
  const robotsUrl = new URL("/robots.txt", target.origin);
  const cached = ROBOTS_CACHE.get(robotsUrl.toString());
  if (cached && Date.now() - cached.fetchedAt < ROBOTS_TTL_MS) {
    return parseRobots(cached.text, target.pathname);
  }

  try {
    const res = await fetch(robotsUrl.toString(), {
      headers: { "User-Agent": "houston-mapping-bot/1.0" }
    });
    if (!res.ok) return true; // assume allowed on failure
    const text = await res.text();
    ROBOTS_CACHE.set(robotsUrl.toString(), { text, fetchedAt: Date.now() });
    return parseRobots(text, target.pathname);
  } catch {
    return true;
  }
};

const parseMetadata = (html: string) => {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
  return {
    title: titleMatch?.[1]?.trim(),
    description: descriptionMatch?.[1]?.trim(),
    keywords: keywordsMatch?.[1]?.split(",").map((k) => k.trim()).filter(Boolean)
  };
};

export const metadataFetcher = async (url: string): Promise<MetadataResult> => {
  const parsed = new URL(url);
  const allowed = await isAllowedByRobots(parsed);
  if (!allowed) {
    return { url, allowed: false, blockedByRobots: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "houston-mapping-bot/1.0" },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { url, allowed: true, blockedByRobots: false };
    }
    const html = await res.text();
    const meta = parseMetadata(html);
    return { url, allowed: true, blockedByRobots: false, ...meta };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return { url, allowed: true, blockedByRobots: false, description: "Timed out fetching page" };
    }
    throw err;
  }
};
