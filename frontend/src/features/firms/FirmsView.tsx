import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchFirms } from "@services/firms";
import { AddFirmForm } from "./AddFirmForm";
import { SkeletonCard } from "@components/SkeletonCard";

export const FirmsView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["firms"],
    queryFn: fetchFirms
  });

  const filtered = useMemo(() => {
    const tag = tagFilter.toLowerCase();
    return (
      data?.features.filter((f) => {
        const matchesTag =
          !tag || f.properties.tags.some((t) => t.toLowerCase().includes(tag));
        const matchesStage =
          !stageFilter ||
          (f.properties.stageFocus || "").toLowerCase().includes(stageFilter.toLowerCase());
        return matchesTag && matchesStage;
      }) ?? []
    );
  }, [data?.features, tagFilter, stageFilter]);

  if (error) return <p className="text-red-600">Failed to load firms. Check API or CORS.</p>;

  return (
    <section className="space-y-4">
      <AddFirmForm />

      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter by stage"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
          : filtered.map((firm) => (
              <article key={firm.properties.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{firm.properties.name}</h3>
                    {firm.properties.website && (
                      <a
                        href={firm.properties.website}
                        className="text-sm text-sky-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {firm.properties.website}
                      </a>
                    )}
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Firm</span>
                </div>
                {firm.properties.description && (
                  <p className="mt-2 text-sm text-slate-700">{firm.properties.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {firm.properties.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {firm.geometry.coordinates[1].toFixed(3)}, {firm.geometry.coordinates[0].toFixed(3)}
                </p>
              </article>
            ))}
        {!isLoading && filtered.length === 0 && <p className="text-slate-600">No firms found.</p>}
      </div>
    </section>
  );
};
