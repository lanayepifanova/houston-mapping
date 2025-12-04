import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { fetchFirms, FirmFeature } from "@services/firms";
import { fetchStartups, StartupFeature } from "@services/startups";
import { fetchCommunities, CommunityFeature } from "@services/communities";
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
      const matchTag =
        !tagBucket ||
        marker.tags.some((t) => {
          const lower = t.toLowerCase();
          return tagBucket.keywords.some((kw) => lower.includes(kw));
        });
      const matchStage =
        !stage || marker.kind !== "startup" || (marker.stage || "").toLowerCase().includes(stage);
      return matchTag && matchStage;
    });
  }, [markers, tagFilter, stageFilter]);

  const houstonCenter: [number, number] = [29.7604, -95.3698];

  const isLoading = firmsQuery.isLoading || startupsQuery.isLoading || communitiesQuery.isLoading;
  const hasError = firmsQuery.isError || startupsQuery.isError || communitiesQuery.isError;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="block text-xs font-semibold text-slate-600">Filter by tag</span>
          <select
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
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

        <label className="space-y-1 text-sm text-slate-700">
          <span className="block text-xs font-semibold text-slate-600">Filter startups by stage</span>
          <select
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
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

      <div className="flex flex-wrap gap-4">
        <StatCard label="Firms" value={firmsQuery.data?.features.length ?? 0} />
        <StatCard label="Startups" value={startupsQuery.data?.features.length ?? 0} />
        <StatCard label="Communities" value={communitiesQuery.data?.features.length ?? 0} />
        <StatCard label="Markers" value={filteredMarkers.length} />
      </div>

      {isLoading && <p className="text-slate-600">Loading map data…</p>}
      {hasError && (
        <p className="text-red-600">
          Failed to load data. Ensure backend is running at the configured API URL.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
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
          {filteredMarkers.map((marker) => (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={7}
              pathOptions={{
                color: marker.kind === "firm" ? "#0ea5e9" : marker.kind === "startup" ? "#22c55e" : "#f59e0b",
                fillOpacity: 0.75
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {marker.name} <span className="text-xs uppercase">({marker.kind})</span>
                  </p>
                  {marker.website && (
                    <a className="text-sky-600" href={marker.website} target="_blank" rel="noreferrer">
                      Visit site
                    </a>
                  )}
                  {marker.description && <p className="text-sm text-slate-600">{marker.description}</p>}
                  {marker.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {marker.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {marker.stage && <p className="text-xs text-slate-500">Stage: {marker.stage}</p>}
                  {marker.category && (
                    <p className="text-xs text-slate-500">Category: {marker.category}</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);
