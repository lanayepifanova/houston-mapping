import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchCommunities, CommunityFeature } from "@services/communities";
import { AddCommunityForm } from "./AddCommunityForm";
import { SkeletonCard } from "@components/SkeletonCard";

export const CommunitiesView = () => {
  const [tagFilter, setTagFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState<CommunityFeature | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities
  });

  const filtered = useMemo(() => {
    const tag = tagFilter.toLowerCase();
    const category = categoryFilter.toLowerCase();
    return (
      data?.features.filter((c) => {
        const matchesTag = !tag || c.properties.tags.some((t) => t.toLowerCase().includes(tag));
        const matchesCategory =
          !category || (c.properties.category || "").toLowerCase().includes(category);
        return matchesTag && matchesCategory;
      }) ?? []
    );
  }, [data?.features, tagFilter, categoryFilter]);

  if (error) return <p className="text-red-600">Failed to load communities. Check API or CORS.</p>;

  return (
    <section className="space-y-4">
      <AddCommunityForm />

      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
            : filtered.map((community) => (
                <article
                  key={community.properties.id}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow"
                  onClick={() => setSelected(community)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{community.properties.name}</h3>
                      {community.properties.website && (
                        <a
                          href={community.properties.website}
                          className="text-sm text-amber-700"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {community.properties.website}
                        </a>
                      )}
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Community
                    </span>
                  </div>
                  {community.properties.description && (
                    <p className="mt-2 text-sm text-slate-700 line-clamp-3">
                      {community.properties.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {community.properties.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {community.geometry.coordinates[1].toFixed(3)}, {community.geometry.coordinates[0].toFixed(3)}
                  </p>
                </article>
              ))}
          {!isLoading && filtered.length === 0 && <p className="text-slate-600">No communities found.</p>}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {selected ? (
            <div className="space-y-2">
              <p className="text-xs uppercase text-amber-700 font-semibold">Selected community</p>
              <h3 className="text-xl font-semibold">{selected.properties.name}</h3>
              {selected.properties.website && (
                <a
                  href={selected.properties.website}
                  className="text-sm text-amber-700"
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
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {selected.properties.category && (
                <p className="text-sm text-slate-600">Category: {selected.properties.category}</p>
              )}
              <p className="text-sm text-slate-600">
                {selected.geometry.coordinates[1].toFixed(3)}, {selected.geometry.coordinates[0].toFixed(3)}
              </p>
            </div>
          ) : (
            <p className="text-slate-600">Select a community card to see details here.</p>
          )}
        </aside>
      </div>
    </section>
  );
};
