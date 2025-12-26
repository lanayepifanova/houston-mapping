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
      <div className="rounded-2xl border border-black bg-white p-5">
        <h2 className="text-3xl font-semibold text-black">Deep Industry Guides</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Playbooks for Houston’s core sectors: who matters, where startups win, how to land pilots, and what to avoid.
          Use the TOC to jump, or open the related map layer to see relevant pins.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className="rounded-lg border border-black bg-white px-3 py-1.5 text-sm text-black hover:bg-neutral-50"
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
    <div id={guide.id} className="rounded-2xl border border-black bg-white p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="space-y-1 leading-relaxed">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Deep Industry Guide</p>
          <h3 className="text-2xl font-semibold text-black">{guide.title}</h3>
          <p className="text-sm text-neutral-700">{guide.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-black bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-neutral-50"
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
          <div key={section.id} className="rounded-xl border border-neutral-200 bg-white p-3">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => toggleSection(section.id)}
              aria-expanded={openSections[section.id]}
            >
              <p className="text-sm font-semibold text-neutral-800">{section.title}</p>
              <span className="text-neutral-500">{openSections[section.id] ? "▴" : "▾"}</span>
            </button>
            {openSections[section.id] && (
              <ul id={section.id} className="mt-2 space-y-2 text-sm text-neutral-700 leading-relaxed">
                {section.bullets.map((bullet) => (
                  <li key={bullet.text} className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
                    <div className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-black" />
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
                      <div className="flex flex-wrap gap-1 text-xs text-neutral-500">
                        {bullet.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-black px-2 py-0.5 text-black">
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
      ? "border-black bg-white text-black"
      : "border-black bg-neutral-50 text-black";
  return (
    <div className={`rounded-xl border ${color} p-4`}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-2 text-sm text-neutral-800">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-black" />
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
    "border border-black bg-white text-black";

  return (
    <button
      onClick={() =>
        navigate("/", {
          state: { focusId: org.id }
        })
      }
      className={`rounded-full px-3 py-1 text-xs font-semibold ${kindColor}`}
    >
      {org.label}
    </button>
  );
};
