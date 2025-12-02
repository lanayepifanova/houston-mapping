import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "@services/search";

export const SearchView = () => {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState("");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["search", query, tags],
    queryFn: () => fetchSearch(query, tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : []),
    enabled: false
  });

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-2xl font-semibold">Search</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Query
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find firms or startups…"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Tags (comma separated)
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="energy, health, aerospace"
            />
          </label>
        </div>
        <div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700 disabled:opacity-60"
            disabled={isFetching}
          >
            {isFetching ? "Searching…" : "Search"}
          </button>
        </div>
        <p className="text-sm text-slate-500">
          Smart search is stubbed until the OpenAI provider is wired. You can still filter by query and tags once it is
          implemented.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-600">
        {data?.items?.length ? (
          <ul className="space-y-2">
            {data.items.map((item, idx) => (
              <li key={idx} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                {JSON.stringify(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </section>
  );
};
