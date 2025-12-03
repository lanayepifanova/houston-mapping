import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchFirms, FirmFeature } from "@services/firms";
import { AddFirmForm } from "./AddFirmForm";
import { SkeletonCard } from "@components/SkeletonCard";

export const FirmsView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selected, setSelected] = useState<FirmFeature | null>(null);

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

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
            : filtered.map((firm) => (
                <article
                  key={firm.properties.id}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow"
                  onClick={() => setSelected(firm)}
                >
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
                    <p className="mt-2 text-sm text-slate-700 line-clamp-3">{firm.properties.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {firm.properties.tags.map((tag: string) => (
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

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {selected ? (
            <div className="space-y-2">
              <p className="text-xs uppercase text-sky-700 font-semibold">Selected firm</p>
              <h3 className="text-xl font-semibold">{selected.properties.name}</h3>
              {selected.properties.website && (
                <a
                  href={selected.properties.website}
                  className="text-sm text-sky-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  {selected.properties.website}
                </a>
              )}
              {selected.properties.description && (
                <p className="text-sm text-slate-700">{selected.properties.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {selected.properties.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                {selected.geometry.coordinates[1].toFixed(3)}, {selected.geometry.coordinates[0].toFixed(3)}
              </p>
              {selected.properties.stageFocus && (
                <p className="text-sm text-slate-600">Stage focus: {selected.properties.stageFocus}</p>
              )}
              {selected.properties.fundSize && (
                <p className="text-sm text-slate-600">Fund size: {selected.properties.fundSize}</p>
              )}
            </div>
          ) : (
            <p className="text-slate-600">Select a firm card to see details here.</p>
          )}
        </aside>
      </div>
    </section>
  );
};
