import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { guides } from "./guidesData";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const GuidesView = () => {
  const toc = useMemo(
    () =>
      guides.map((guide) => ({
        id: guide.id,
        title: guide.title
      })),
    []
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">Deep Industry Guides</h2>
        <p className="mt-2 text-sm text-slate-600">
          Playbooks for Houston’s core sectors: who matters, where startups win, how to land pilots, and what to avoid.
          Use the TOC to jump, or open the related map layer to see relevant pins.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-white"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guideId={guide.id} />
        ))}
      </div>
    </section>
  );
};

const GuideCard = ({ guideId }: { guideId: string }) => {
  const navigate = useNavigate();
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return null;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    guide.sections.forEach((section) => {
      initial[section.id] = false;
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id={guide.id} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1 leading-relaxed">
          <p className="text-xs uppercase tracking-wide text-slate-500">Deep Industry Guide</p>
          <h3 className="text-2xl font-semibold text-slate-900">{guide.title}</h3>
          <p className="text-sm text-slate-600">{guide.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 shadow-sm hover:bg-sky-100"
            onClick={() =>
              navigate("/", {
                state: { highlightTags: guide.relatedTags }
              })
            }
          >
            View related map layer
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CardBlock title="How to break in" items={guide.breakIn} accent="sky" />
        <CardBlock title="Common pitfalls" items={guide.pitfalls} accent="rose" />
      </div>

      <div className="space-y-3">
        {guide.sections.map((section) => (
          <div key={section.id} className="rounded-xl border border-slate-100 bg-white/80 p-3 shadow-sm">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => toggleSection(section.id)}
              aria-expanded={openSections[section.id]}
            >
              <p className="text-sm font-semibold text-slate-800">{section.title}</p>
              <span className="text-slate-500">{openSections[section.id] ? "▴" : "▾"}</span>
            </button>
            {openSections[section.id] && (
              <ul id={section.id} className="mt-2 space-y-2 text-sm text-slate-700 leading-relaxed">
                {section.bullets.map((bullet) => (
                  <li key={bullet.text} className="space-y-2 rounded-lg bg-slate-50 p-3 shadow-sm">
                    <div className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                      <span>{bullet.text}</span>
                    </div>
                    {bullet.orgs && bullet.orgs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {bullet.orgs.map((org) => (
                          <OrgChip key={org.id} org={org} />
                        ))}
                      </div>
                    )}
                    {bullet.tags && bullet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-xs text-slate-500">
                        {bullet.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CardBlock = ({ title, items, accent }: { title: string; items: string[]; accent: "sky" | "rose" }) => {
  const color =
    accent === "sky"
      ? "border-sky-100 bg-sky-50/70 text-sky-800"
      : "border-rose-100 bg-rose-50/70 text-rose-800";
  return (
    <div className={`rounded-xl border ${color} p-4`}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-2 text-sm text-slate-800">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-slate-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const OrgChip = ({ org }: { org: { id: string; label: string; kind: string } }) => {
  const navigate = useNavigate();
  const kindColor =
    org.kind === "firm" ? "bg-sky-50 text-sky-700" : org.kind === "startup" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";

  return (
    <button
      onClick={() =>
        navigate("/", {
          state: { focusId: org.id }
        })
      }
      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${kindColor}`}
    >
      {org.label}
    </button>
  );
};
