import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchStartups, StartupFeature } from "@services/startups";
import { AddStartupForm } from "./AddStartupForm";
import { SkeletonCard } from "@components/SkeletonCard";

export const StartupsView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selected, setSelected] = useState<StartupFeature | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["startups"],
    queryFn: fetchStartups
  });

  const filtered = useMemo(() => {
    const tag = tagFilter.toLowerCase();
    return (
      data?.features.filter((s) => {
        const matchesTag =
          !tag || s.properties.tags.some((t) => t.toLowerCase().includes(tag));
        const matchesStage =
          !stageFilter ||
          (s.properties.stage || "").toLowerCase().includes(stageFilter.toLowerCase());
        return matchesTag && matchesStage;
      }) ?? []
    );
  }, [data?.features, tagFilter, stageFilter]);

  if (error) return <p className="text-red-600">Failed to load startups. Check API or CORS.</p>;

  return (
    <section className="space-y-4">
      <AddStartupForm />

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
            : filtered.map((startup) => (
                <article
                  key={startup.properties.id}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow"
                  onClick={() => setSelected(startup)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{startup.properties.name}</h3>
                      {startup.properties.website && (
                        <a
                          href={startup.properties.website}
                          className="text-sm text-sky-600"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {startup.properties.website}
                        </a>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Startup
                    </span>
                  </div>
                  {startup.properties.description && (
                    <p className="mt-2 text-sm text-slate-700 line-clamp-3">{startup.properties.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                  {startup.properties.tags.map((tag) => (
                    <span key={tag as string} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {startup.geometry.coordinates[1].toFixed(3)}, {startup.geometry.coordinates[0].toFixed(3)}
                  </p>
                </article>
              ))}
          {!isLoading && filtered.length === 0 && <p className="text-slate-600">No startups found.</p>}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {selected ? (
            <div className="space-y-2">
              <p className="text-xs uppercase text-emerald-700 font-semibold">Selected startup</p>
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
              {selected.properties.stage && (
                <p className="text-sm text-slate-600">Stage: {selected.properties.stage}</p>
              )}
              {selected.properties.industry && (
                <p className="text-sm text-slate-600">Industry: {selected.properties.industry}</p>
              )}
            </div>
          ) : (
            <p className="text-slate-600">Select a startup card to see details here.</p>
          )}
        </aside>
      </div>
    </section>
  );
};
