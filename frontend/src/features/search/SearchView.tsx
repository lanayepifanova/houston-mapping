import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSearch, SearchHit, SearchResult } from "@services/search";

export const SearchView = () => {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedTags, setSubmittedTags] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const parsedTags = useMemo(
    () => (tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : []),
    [tags]
  );

  const { data, isFetching } = useQuery<SearchResult<SearchHit>>({
    queryKey: ["search", submittedQuery, submittedTags.join(","), page, limit],
    queryFn: () => fetchSearch(submittedQuery, submittedTags, page, limit),
    enabled: hasSearched,
    placeholderData: keepPreviousData
  });

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-black bg-white p-4 space-y-3">
        <h2 className="text-2xl font-semibold">Search</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            Query
            <input
              className="rounded-lg border border-black px-3 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find firms or startups…"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            Tags (comma separated)
            <input
              className="rounded-lg border border-black px-3 py-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="energy, health, aerospace"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            Results per page
            <select
              className="rounded-lg border border-black px-3 py-2"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <button
            onClick={() => {
              setPage(1);
              setSubmittedQuery(query);
              setSubmittedTags(parsedTags);
              setHasSearched(true);
            }}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
            disabled={isFetching}
          >
            {isFetching ? "Searching…" : "Search"}
          </button>
        </div>
        <p className="text-sm text-neutral-500">
          Runs fully in-browser against the static index (firms, startups, communities). Tag filters
          are applied before scoring.
        </p>
      </div>

      <Results
        items={data?.items ?? []}
        isFetching={isFetching}
        total={data?.total ?? 0}
        page={data?.page ?? page}
        limit={data?.limit ?? limit}
        onPageChange={(nextPage) => {
          setPage(nextPage);
        }}
      />
    </section>
  );
};

const Results = ({
  items,
  isFetching,
  total,
  page,
  limit,
  onPageChange
}: {
  items: SearchHit[];
  isFetching: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}) => {
  const navigate = useNavigate();

  if (isFetching) {
    return (
      <div className="rounded-xl border border-dashed border-black bg-white p-4 text-neutral-600">
        Searching…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-black bg-white p-4 text-neutral-600">
        No results yet.
      </div>
    );
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const hasNext = end < total;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          Showing {start}-{end} of {total} hits
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-black bg-white px-3 py-1.5 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-lg border border-black bg-white px-3 py-1.5 disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {items.map((item) => (
        <div
          key={`${item.kind}-${item.id}`}
          className="rounded-xl border border-black bg-white p-4 transition hover:bg-neutral-50"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">{item.kind}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="rounded-full border border-black px-2 py-0.5 text-xs text-black">
                  Score {item.score}
                </span>
              </div>
            </div>
            {item.website && (
              <a
                className="text-sm font-medium text-black underline"
                href={item.website}
                target="_blank"
                rel="noreferrer"
              >
                Visit site
              </a>
            )}
          </div>
          {item.description && <p className="mt-2 text-sm text-neutral-700">{item.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-black px-2 py-1 text-black">
                {tag}
              </span>
            ))}
            {item.stage && (
              <span className="rounded-full border border-black px-2 py-1 text-black">Stage: {item.stage}</span>
            )}
            {item.category && (
              <span className="rounded-full border border-black px-2 py-1 text-black">Category: {item.category}</span>
            )}
          </div>
          {item.location && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
              <span className="rounded-full border border-black px-2 py-1 text-black">
                {item.location.address || `${item.location.lat.toFixed(3)}, ${item.location.lng.toFixed(3)}`}
              </span>
              <button
                className="rounded-full border border-black px-3 py-1 text-black transition hover:bg-neutral-100"
                onClick={() =>
                  navigate("/", {
                    state: {
                      focus: {
                        id: item.id,
                        kind: item.kind,
                        lat: item.location?.lat,
                        lng: item.location?.lng,
                        name: item.name
                      }
                    }
                  })
                }
              >
                Show on map
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
