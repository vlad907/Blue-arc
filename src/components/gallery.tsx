"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { assetPath } from "@/lib/asset-path";

// -----------------------------
// Types
// -----------------------------
type MediaItem =
  | { type: "image"; src: string; thumb?: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export type JobItem = {
  id: string;
  title: string;
  client?: string;
  date?: string; // e.g., "2025-08-20"
  location?: string; // e.g., "Chico, CA"
  tags: string[]; // e.g., ["Networking", "Data Recovery"]
  description?: string;
  media: MediaItem[]; // ordered list of images/videos for this job
};


const JOBS: JobItem[] = [
  {
    id: "cvs",
    title: "CVS – Kodak Printer",
    client: "CVS",
    date: "2025-08-20",
    location: "Chico, CA",
    tags: ["Setup", "Retail"],
    description:
      "New Kodak printer setup.",
    media: [
      { type: "image", src: "/jobs/cvs/cvs.jpg", alt: "CVS kodak printer" },
    ],
  },
  {
    id: "torrid",
    title: "Torrid – Store Network / POS",
    client: "Torrid",
    date: "2025-08-18",
    location: "Chico CA",
    tags: ["Retail", "Networking", "POS"],
    description:
      "Store networking and POS upgrade.",
    media: [
      { type: "image", src: "/jobs/torrid/torrid.jpg", alt: "Torrid front of house shot" },
      { type: "video", src: "/jobs/torrid/torrid2.MP4", alt: "Torrid store walkthrough video" },
    ],
  },
  {
    id: "pourhouse",
    title: "Pour House – AV / Network",
    client: "Pour House",
    date: "2025-08-15",
    location: "Chico CA",
    tags: ["Retail", "AV", "Networking"],
    description:
      "Network and AV setup for new video wall.",
    media: [
      // Update these filenames to match what you place in /public/jobs/pourhouse/
      { type: "image", src: "/jobs/pourhouse/PH.jpg", alt: "Pour House front / rack" },
      { type: "video", src: "/jobs/pourhouse/PH2.mp4", alt: "Video wall install" },
      { type: "video", src: "/jobs/pourhouse/PH3.mp4", alt: "Video wall install" },
      { type: "video", src: "/jobs/pourhouse/PH4.mp4", alt: "Video wall install" },
      { type: "image", src: "/jobs/pourhouse/PH5.jpg", alt: "Pour House workstation build" },


    ],
  },
  {
    id: "traderjoes",
    title: "Trader Joe’s – POS upgradee",
    client: "Trader Joe’s",
    date: "2025-08-10",
    location: "Chico CA",
    tags: ["Retail", "POS"],
    description:
      "POS upgrade and install",
    media: [
      { type: "image", src: "/jobs/traderjoes/traderjoes.jpg", alt: "Trader Joe’s POS setup" },
      { type: "image", src: "/jobs/traderjoes/traderjoes2.jpg", alt: "Trader Joe’s POS" },
    ],
  },
  {
    id: "Workmans-comp",
    title: "Workman's Comp – Network setup",
    client: "Company Office",
    date: "2025-08-05",
    location: "Chico, CA",
    tags: ["Setup", "Networking"],
    description:
      "Unifi network setup",
    media: [
      { type: "image", src: "/jobs/comp/comp.jpg", alt: "Office equipment setup" },
    ],
  },
];

// Derive a stable set of tags for filter buttons
const getAllTags = (items: JobItem[]) => {
  const set = new Set<string>();
  items.forEach((i) => i.tags.forEach((t) => set.add(t)));
  // Deterministic ASCII-stable compare
  return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
};

// Deterministic date formatter
const formatDate = (s?: string) => {
  if (!s) return "";
  // Force deterministic server/client output
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    }).format(new Date(`${s}T00:00:00Z`));
  } catch {
    return s; // fallback to raw string
  }
};

// -----------------------------
// Component
// -----------------------------
export default function Gallery({ items = JOBS }: { items?: JobItem[] }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<{ id: string; index: number } | null>(null);

  const allTags = useMemo(() => getAllTags(items), [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesQuery = query
        ? (
            i.title.toLowerCase().includes(query.toLowerCase()) ||
            (i.description ?? "").toLowerCase().includes(query.toLowerCase()) ||
            (i.client ?? "").toLowerCase().includes(query.toLowerCase()) ||
            (i.location ?? "").toLowerCase().includes(query.toLowerCase())
          )
        : true;
      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => i.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [items, query, activeTags]);

  // Lightbox helpers
  const currentItemIndex = useMemo(
    () => (lightbox ? filtered.findIndex((i) => i.id === lightbox.id) : -1),
    [lightbox, filtered]
  );
  const currentItem = currentItemIndex >= 0 ? filtered[currentItemIndex] : null;
  const currentMedia = currentItem && lightbox ? currentItem.media[lightbox.index] : null;

  const closeLightbox = () => setLightbox(null);

  const nextMedia = useCallback(() => {
    if (!currentItem || !lightbox) return;
    const nextIndex = lightbox.index + 1;
    if (nextIndex < currentItem.media.length) {
      setLightbox({ id: lightbox.id, index: nextIndex });
    } else {
      const nextItem = (currentItemIndex + 1) % filtered.length;
      setLightbox({ id: filtered[nextItem].id, index: 0 });
    }
  }, [currentItem, lightbox, currentItemIndex, filtered]);

  const prevMedia = useCallback(() => {
    if (!currentItem || !lightbox) return;
    const prevIndex = lightbox.index - 1;
    if (prevIndex >= 0) {
      setLightbox({ id: lightbox.id, index: prevIndex });
    } else {
      const prevItem = (currentItemIndex - 1 + filtered.length) % filtered.length;
      const lastIndex = filtered[prevItem].media.length - 1;
      setLightbox({ id: filtered[prevItem].id, index: Math.max(0, lastIndex) });
    }
  }, [currentItem, lightbox, currentItemIndex, filtered]);

  // Close on Escape
  const escRef = useRef(closeLightbox);
  escRef.current = closeLightbox;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") escRef.current();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextMedia, prevMedia]);

  const toggleTag = (t: string) => {
    setActiveTags((old) =>
      old.includes(t) ? old.filter((x) => x !== t) : [...old, t]
    );
  };


  return (
    <section id="gallery" className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold tracking-tight text-white text-center">
          Project Gallery
        </h2>
        <p className="mt-3 text-center text-neutral-300">
          A selection of recent deployments, repairs, and recoveries.
        </p>

        {/* Controls */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, client, or location…"
            className="w-full sm:w-80 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((t) => {
              const active = activeTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition " +
                    (active
                      ? "border-sky-400 bg-sky-500/20 text-sky-200"
                      : "border-white/10 bg-white/[0.02] text-neutral-200 hover:bg-white/[0.06]")
                  }
                >
                  {t}
                </button>
              );
            })}
            {allTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-sm text-neutral-300 hover:bg-white/[0.06]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg shadow-black/20"
            >
              {(() => {
                const first = item.media[0];
                const open = () => setLightbox({ id: item.id, index: 0 });
                if (first?.type === "image") {
                  return (
                    <button onClick={open} className="relative block w-full overflow-hidden" aria-label={`Open ${item.title}`}>
                      <img
                        src={assetPath(first.thumb ?? first.src)}
                        alt={first.alt}
                        className="h-56 w-full object-cover transition group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </button>
                  );
                }
                return (
                  <button onClick={open} className="relative block w-full overflow-hidden" aria-label={`Open ${item.title}`}>
                    <div className="h-56 w-full grid place-items-center bg-white/[0.02]">
                      <span className="text-neutral-300">▶ Video</span>
                    </div>
                  </button>
                );
              })()}
              <div className="p-5">
                <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                <p className="mt-1 text-sm text-neutral-400">
                  {item.location ?? ""}
                  {item.date ? ` • ${formatDate(item.date)}` : ""}
                </p>
                {item.description && (
                  <p className="mt-3 text-neutral-300">{item.description}</p>
                )}
                {item.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-xs text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-neutral-400">
            No results. Try removing filters.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {currentItem && currentMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            Close ✕
          </button>
          <button
            onClick={prevMedia}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            ◀
          </button>
          <figure className="max-h-[85vh] w-full max-w-5xl">
            {currentMedia.type === "image" ? (
              <img
                src={assetPath(currentMedia.src)}
                alt={currentMedia.alt}
                className="max-h-[85vh] w-full rounded-lg object-contain"
              />
            ) : (
              <video
                src={assetPath(currentMedia.src)}
                poster={"poster" in currentMedia && currentMedia.poster ? assetPath(currentMedia.poster) : undefined}
                controls
                playsInline
                preload="metadata"
                className="max-h-[85vh] w-full rounded-lg object-contain"
              />
            )}
            <figcaption className="mt-4 text-center text-neutral-300">
              <div className="font-medium text-white">{currentItem.title}</div>
              <div className="text-sm text-neutral-400">
                {currentItem.client ? `${currentItem.client} • ` : ""}
                {currentItem.location ?? ""}
                {currentItem.date ? ` • ${formatDate(currentItem.date)}` : ""}
              </div>
              <div className="mt-2 text-xs text-neutral-400">
                {lightbox ? `Media ${lightbox.index + 1} of ${currentItem.media.length}` : ""}
              </div>
            </figcaption>
            {/* Thumbnails inside lightbox */}
            {currentItem.media.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {currentItem.media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightbox({ id: currentItem.id, index: idx })}
                    className={
                      "rounded border p-0.5 " +
                      (lightbox && lightbox.index === idx
                        ? "border-sky-400"
                        : "border-white/10 hover:border-white/30")
                    }
                    aria-label={`Go to media ${idx + 1}`}
                  >
                    {m.type === "image" ? (
                      <img
                        src={assetPath(m.type === "image" && m.thumb ? m.thumb : m.src)}
                        alt={m.alt}
                        className="h-14 w-20 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-14 w-20 grid place-items-center bg-white/[0.02] text-xs text-neutral-300">
                        ▶ Video
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </figure>
          <button
            onClick={nextMedia}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
      )}
    </section>
  );
}
