import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import { fetchFirms, FirmFeature } from "@services/firms";
import { fetchStartups, StartupFeature } from "@services/startups";
import Supercluster from "supercluster";
import "leaflet/dist/leaflet.css";
import "./map.css";

type MarkerFeature = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  lat: number;
  lng: number;
  stage?: string;
  kind: "firm" | "startup";
};

type ClusterPoint = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    cluster: boolean;
    markerId?: string;
    point_count?: number;
    kind?: "firm" | "startup";
    name?: string;
    website?: string;
    description?: string;
    tags?: string[];
    stage?: string;
  };
};

const toMarker = (feature: FirmFeature | StartupFeature, kind: "firm" | "startup"): MarkerFeature => {
  const [lng, lat] = feature.geometry.coordinates;
  return {
    id: feature.properties.id,
    name: feature.properties.name,
    website: feature.properties.website,
    description: feature.properties.description,
    tags: feature.properties.tags,
    stage: "stage" in feature.properties ? feature.properties.stage : undefined,
    lat,
    lng,
    kind
  };
};

export const MapView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    -96.5, 28.5, -94.5, 30.5
  ]);
  const [zoom, setZoom] = useState(11);

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

  const markers: MarkerFeature[] = [
    ...(firmsQuery.data?.features.map((f) => toMarker(f, "firm")) ?? []),
    ...(startupsQuery.data?.features.map((s) => toMarker(s, "startup")) ?? [])
  ];

  const filteredMarkers = useMemo(() => {
    const tag = tagFilter.toLowerCase();
    const stage = stageFilter.toLowerCase();
    return markers.filter((marker) => {
      const matchTag = !tag || marker.tags.some((t) => t.toLowerCase().includes(tag));
      const matchStage =
        !stage || marker.kind !== "startup" || (marker.stage || "").toLowerCase().includes(stage);
      return matchTag && matchStage;
    });
  }, [markers, tagFilter, stageFilter]);

  const clusterIndex = useMemo(() => {
    const points: ClusterPoint[] = filteredMarkers.map((m) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [m.lng, m.lat] },
      properties: {
        cluster: false,
        markerId: m.id,
        kind: m.kind,
        name: m.name,
        website: m.website,
        description: m.description,
        tags: m.tags,
        stage: m.stage
      }
    }));
    return new Supercluster({
      radius: 60,
      maxZoom: 16
    }).load(points);
  }, [filteredMarkers]);

  const clusters = useMemo(() => clusterIndex.getClusters(bounds, zoom), [clusterIndex, bounds, zoom]);

  const houstonCenter: [number, number] = [29.7604, -95.3698];

  const isLoading = firmsQuery.isLoading || startupsQuery.isLoading;
  const hasError = firmsQuery.isError || startupsQuery.isError;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter startups by stage"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard label="Firms" value={firmsQuery.data?.features.length ?? 0} />
        <StatCard label="Startups" value={startupsQuery.data?.features.length ?? 0} />
        <StatCard label="Markers" value={filteredMarkers.length} />
      </div>

      {isLoading && <p className="text-slate-600">Loading map data…</p>}
      {hasError && (
        <p className="text-red-600">
          Failed to load data. Ensure backend is running at the configured API URL.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <MapContainer
            center={houstonCenter}
            zoom={11}
            scrollWheelZoom={false}
            className="leaflet-shell"
          >
            <MapBoundsWatcher onChange={(b, z) => {
              setBounds(b);
              setZoom(z);
            }} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clusters.map((cluster) => {
              const [lng, lat] = cluster.geometry.coordinates;
              const {
                cluster: isCluster,
                point_count: pointCount,
                markerId,
                kind,
                name,
                website,
                description,
                tags,
                stage
              } = cluster.properties;

              if (isCluster && pointCount) {
                const radius = 10 + (pointCount / filteredMarkers.length) * 20;
                return (
                  <CircleMarker
                    key={`cluster-${lng}-${lat}`}
                    center={[lat, lng]}
                    radius={radius}
                    pathOptions={{ color: "#6366f1", fillOpacity: 0.6 }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{pointCount} markers</p>
                        <p className="text-xs text-slate-600">Zoom in to see details.</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              }

              return (
                <CircleMarker
                  key={markerId}
                  center={[lat, lng]}
                  radius={10}
                  pathOptions={{
                    color: kind === "firm" ? "#0ea5e9" : "#22c55e",
                    fillOpacity: 0.7
                  }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {name} <span className="text-xs uppercase">({kind})</span>
                      </p>
                      {website && (
                        <a className="text-sky-600" href={website} target="_blank" rel="noreferrer">
                          Visit site
                        </a>
                      )}
                      {description && <p className="text-sm text-slate-600">{description}</p>}
                      {tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {stage && <p className="text-xs text-slate-500">Stage: {stage}</p>}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Recent markers</h2>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {filteredMarkers.length === 0 && (
              <p className="p-4 text-slate-600">
                No markers yet. Seed data or add new firms/startups to see them here.
              </p>
            )}
            {filteredMarkers.map((marker) => (
              <div key={marker.id} className="p-4 space-y-1">
                <p className="font-semibold">{marker.name}</p>
                <p className="text-xs uppercase text-slate-500">{marker.kind}</p>
                <p className="text-xs text-slate-500">
                  {marker.lat.toFixed(3)}, {marker.lng.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MapBoundsWatcher = ({ onChange }: { onChange: (bounds: [number, number, number, number], zoom: number) => void }) => {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const b = map.getBounds();
      const boundsArray: [number, number, number, number] = [
        b.getWest(),
        b.getSouth(),
        b.getEast(),
        b.getNorth()
      ];
      onChange(boundsArray, map.getZoom());
    }
  });
  return null;
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);
