import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Popup, Marker, useMap, Tooltip } from "react-leaflet";
import { fetchFirms, FirmFeature } from "@services/firms";
import { fetchStartups, StartupFeature } from "@services/startups";
import { fetchCommunities, CommunityFeature } from "@services/communities";
import { fetchSearch, SearchHit } from "@services/search";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./map.css";

const TAG_BUCKETS = [
  { label: "AI", keywords: ["ai", "ml", "machine", "mlops"] },
  { label: "Energy & Climate", keywords: ["energy", "power", "solar", "hydrogen", "geothermal", "climate"] },
  { label: "Aerospace & Space", keywords: ["space", "aerospace", "satellite", "orbital", "spaceport"] },
  { label: "Fintech", keywords: ["fintech", "bank", "debt", "payments", "finance"] },
  { label: "Health & Bio", keywords: ["health", "bio", "biotech", "med", "tmc", "care"] },
  { label: "Industrial & Logistics", keywords: ["industrial", "logistics", "supply", "mro", "manufacturing", "automation"] },
  { label: "Software & SaaS", keywords: ["saas", "software", "platform", "data", "cloud", "analytics"] },
  { label: "Legal & Gov", keywords: ["legal", "contract", "ediscovery", "law"] },
  { label: "Marketplace & Commerce", keywords: ["marketplace", "ecommerce", "commerce", "procurement"] },
  { label: "Community & Capital", keywords: ["angel", "accelerator", "community", "network", "hub", "studio", "fund", "venture", "coworking"] }
];

type MarkerFeature = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  lat: number;
  lng: number;
  stage?: string;
  category?: string;
  kind: "firm" | "startup" | "community";
};

type FocusTarget = {
  id: string;
  kind: MarkerFeature["kind"];
  lat: number;
  lng: number;
  name: string;
  openPopup?: boolean;
};

const toMarker = (
  feature: FirmFeature | StartupFeature | CommunityFeature,
  kind: "firm" | "startup" | "community"
): MarkerFeature => {
  const [lng, lat] = feature.geometry.coordinates;
  return {
    id: feature.properties.id,
    name: feature.properties.name,
    website: feature.properties.website,
    description: feature.properties.description,
    tags: feature.properties.tags,
    stage: "stage" in feature.properties ? feature.properties.stage : undefined,
    category: "category" in feature.properties ? feature.properties.category : undefined,
    lat,
    lng,
    kind
  };
};

export const MapView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [kindFilters, setKindFilters] = useState<MarkerFeature["kind"][]>([
    "firm",
    "startup",
    "community"
  ]);
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const [highlightTags, setHighlightTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const location = useLocation();
  const firmsQuery = useQuery({
    queryKey: ["firms"],
    queryFn: fetchFirms,
    retry: 1
  });
  const startupsQuery = useQuery({
    queryKey: ["startups"],
    queryFn: fetchStartups,
    retry: 1
  });
  const communitiesQuery = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
    retry: 1
  });

  const markers: MarkerFeature[] = [
    ...(firmsQuery.data?.features.map((f) => toMarker(f, "firm")) ?? []),
    ...(startupsQuery.data?.features.map((s) => toMarker(s, "startup")) ?? []),
    ...(communitiesQuery.data?.features.map((c) => toMarker(c, "community")) ?? [])
  ];

  const kindCounts = useMemo(
    () =>
      markers.reduce(
        (acc, marker) => {
          acc[marker.kind] += 1;
          return acc;
        },
        { firm: 0, startup: 0, community: 0 } as Record<MarkerFeature["kind"], number>
      ),
    [markers]
  );

  const tagOptions = TAG_BUCKETS.map((bucket) => bucket.label);

  const stageOptions = useMemo(() => {
    const stages = new Set<string>();
    startupsQuery.data?.features.forEach((s) => {
      if (s.properties.stage) stages.add(s.properties.stage);
    });
    return Array.from(stages).sort();
  }, [startupsQuery.data?.features]);

  const filteredMarkers = useMemo(() => {
    const tagBucket = TAG_BUCKETS.find((bucket) => bucket.label === tagFilter);
    const stage = stageFilter.toLowerCase();
    return markers.filter((marker) => {
      const matchKind = !kindFilters.length || kindFilters.includes(marker.kind);
      const matchTag =
        !tagBucket ||
        marker.tags.some((t) => {
          const lower = t.toLowerCase();
          return tagBucket.keywords.some((kw) => lower.includes(kw));
        });
      const matchStage =
        !stage || marker.kind !== "startup" || (marker.stage || "").toLowerCase().includes(stage);
      const matchHighlight =
        !highlightTags.length ||
        marker.tags.some((t) => highlightTags.some((h) => t.toLowerCase().includes(h.toLowerCase())));
      return matchKind && matchTag && matchStage && matchHighlight;
    });
  }, [markers, kindFilters, tagFilter, stageFilter, highlightTags]);

  const houstonCenter: [number, number] = [29.7604, -95.3698];

  const isLoading = firmsQuery.isLoading || startupsQuery.isLoading || communitiesQuery.isLoading;
  const hasError = firmsQuery.isError || startupsQuery.isError || communitiesQuery.isError;

  useEffect(() => {
    const state = location.state as { focus?: FocusTarget; highlightTags?: string[]; focusId?: string } | null;
    if (state?.focus) {
      setFocusTarget(state.focus);
    }
    if (state?.highlightTags) {
      setHighlightTags(state.highlightTags);
    }
    if (state?.focusId && markers.length) {
      const match = markers.find((m) => m.id === state.focusId);
      if (match) {
        setFocusTarget({
          id: match.id,
          kind: match.kind,
          lat: match.lat,
          lng: match.lng,
          name: match.name
        });
      }
    }
  }, [location.state, markers]);

  const toggleKind = (kind: MarkerFeature["kind"]) => {
    setKindFilters((prev) => (prev.includes(kind) ? prev.filter((item) => item !== kind) : [...prev, kind]));
  };

  const kindLabels: Record<MarkerFeature["kind"], string> = {
    firm: "Firms",
    startup: "Startups",
    community: "Communities"
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-5 space-y-4 animate-rise">
        <div className="flex flex-col gap-4 leading-relaxed lg:flex-row lg:flex-wrap">
          <div className="flex flex-wrap gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-800">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filter by tag
              </span>
              <select
                className="w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-300 focus:outline-none sm:w-48"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="">All tags</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-800">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filter startups by stage
              </span>
              <select
                className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-300 focus:outline-none"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">All stages</option>
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2 sm:ml-auto">
            <StatCard label="Firms" value={firmsQuery.data?.features.length ?? 0} />
            <StatCard label="Startups" value={startupsQuery.data?.features.length ?? 0} />
            <StatCard label="Communities" value={communitiesQuery.data?.features.length ?? 0} />
            <StatCard label="Markers" value={filteredMarkers.length} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Show on map
          </span>
          {(Object.keys(kindLabels) as MarkerFeature["kind"][]).map((kind) => (
            <button
              key={kind}
              className={`tag-pill inline-flex items-center gap-2 ${
                kindFilters.includes(kind) ? "tag-pill-active" : ""
              }`}
              onClick={() => toggleKind(kind)}
              type="button"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: getKindColor(kind) }} />
              {kindLabels[kind]}
              <span className="text-xs text-slate-500">{kindCounts[kind]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-4 animate-rise-delayed">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-col text-sm font-medium text-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-inner focus:border-orange-300 focus:outline-none sm:w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find firms/startups/communities..."
              />
              <button
                onClick={async () => {
                  setSearching(true);
                  try {
                    const res = await fetchSearch(searchQuery, [], 1, 12);
                    setSearchResults(res.items ?? []);
                  } finally {
                    setSearching(false);
                  }
                }}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-60"
                disabled={searching}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {searchResults.map((hit) => (
              <div
                key={`${hit.kind}-${hit.id}`}
                className="rounded-lg border border-slate-100 bg-white/90 p-3 shadow-sm leading-relaxed"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {hit.name}
                      <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {hit.kind}
                      </span>
                    </p>
                  </div>
                  <button
                    className="text-xs font-semibold text-teal-700 underline disabled:opacity-50"
                    disabled={!hit.location}
                    onClick={() => {
                      if (!hit.location) return;
                      setFocusTarget({
                        id: hit.id,
                        kind: hit.kind,
                        lat: hit.location.lat,
                        lng: hit.location.lng,
                        name: hit.name,
                        openPopup: true
                      });
                    }}
                  >
                    Show on map
                  </button>
                </div>
                {hit.description && (
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{hit.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {highlightTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm text-orange-800">
          <span className="font-semibold">Guide filter:</span>
          {highlightTags.map((tag) => (
            <span key={tag} className="rounded-full bg-white px-2 py-1 text-xs font-semibold">
              {tag}
            </span>
          ))}
          <button
            className="ml-2 text-xs font-medium text-orange-700 underline"
            onClick={() => setHighlightTags([])}
          >
            Clear
          </button>
        </div>
      )}

      {isLoading && <p className="text-slate-600">Loading map data…</p>}
      {hasError && (
        <p className="text-red-600">
          Failed to load data. Ensure backend is running at the configured API URL.
        </p>
      )}


      <div className="glass-panel p-3 animate-rise">
        <MapContainer
          center={houstonCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="leaflet-shell"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PinLayer markers={filteredMarkers} focus={focusTarget} />
        </MapContainer>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="glass-panel px-4 py-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-2xl font-semibold leading-tight text-slate-900">{value}</p>
  </div>
);

const PinLayer = ({ markers, focus }: { markers: MarkerFeature[]; focus: FocusTarget | null }) => {
  const map = useMap();
  const [lastFocusId, setLastFocusId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    if (focus && focus.id !== lastFocusId) {
      map.flyTo([focus.lat, focus.lng], Math.max(13, map.getZoom()));
      setLastFocusId(focus.id);
      if (focus.openPopup) {
        setOpenId(focus.id);
      }
    }
  }, [focus, lastFocusId, map]);

  useEffect(() => {
    if (openId && markerRefs.current[openId]) {
      markerRefs.current[openId]?.openPopup();
    }
  }, [openId]);

  return (
    <>
      {markers.map((props) => {
        const isFocused = focus?.id === props.id;

        return (
          <Marker
            key={props.id}
            position={[props.lat, props.lng]}
            icon={createPinIcon(props.kind, isFocused)}
            ref={(ref) => {
              markerRefs.current[props.id] = ref;
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
              <span className="font-semibold">{props.name}</span>
            </Tooltip>
            <Popup
              autoPan
              autoClose={false}
              closeButton={true}
              closeOnEscapeKey={true}
              closeOnClick={false}
              eventHandlers={{
                add: () => {
                  if (openId === props.id) return;
                  if (focus?.id === props.id && focus.openPopup) {
                    setOpenId(props.id);
                  }
                },
                popupopen: () => setOpenId(props.id),
                popupclose: () => {
                  if (openId === props.id) setOpenId(null);
                }
              }}
            >
              <div className="space-y-1">
                <p className="font-semibold">
                  {props.name} <span className="text-xs uppercase">({props.kind})</span>
                </p>
                {props.website && (
                  <a className="accent-link" href={props.website} target="_blank" rel="noreferrer">
                    Visit site
                  </a>
                )}
                {props.description && <p className="text-sm text-slate-600">{props.description}</p>}
                {props.tags?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {props.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                {props.stage && <p className="text-xs text-slate-500">Stage: {props.stage}</p>}
                {props.category && <p className="text-xs text-slate-500">Category: {props.category}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const getKindColor = (kind: MarkerFeature["kind"]) =>
  kind === "firm" ? "#0ea5e9" : kind === "startup" ? "#22c55e" : "#f59e0b";

const createPinIcon = (kind: MarkerFeature["kind"], focused: boolean) => {
  const color = focused ? "#a855f7" : getKindColor(kind);
  const size = focused ? 26 : 22;
  return L.divIcon({
    className: "pin-icon",
    html: `<span class="pin pin-${kind}" style="background:${color}; width:${size}px; height:${size}px;"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  });
};
