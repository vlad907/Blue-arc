"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getCategoryLabel, type ProjectEntry } from "@/lib/projects-constants";

const PROJECTS_PER_PAGE = 6;

const DEFAULT_PROJECTS: ProjectEntry[] = [
  {
    id: "wifi-upgrade",
    title: "Office Wi-Fi Upgrade",
    description:
      "Improved wireless coverage and reliability for a multi-room office using properly placed access points and network tuning.",
    category: "wifi",
    images: [],
  },
  {
    id: "security-cameras",
    title: "Security Camera Deployment",
    description:
      "Installed and configured IP cameras with remote viewing and NVR recording for business property monitoring.",
    category: "cameras",
    images: [],
  },
  {
    id: "structured-cabling",
    title: "Structured Cabling Installation",
    description:
      "Added new Cat6 drops, clean termination, and organized rack routing for workstations and PoE devices.",
    category: "cabling",
    images: [],
  },
  {
    id: "rack-cleanup",
    title: "Rack Cleanup & Network Reorganization",
    description:
      "Cleaned up patching, labeling, and cable routing to improve reliability and serviceability.",
    category: "rack",
    images: [],
  },
  {
    id: "av-display",
    title: "AV / Display Setup",
    description:
      "Installed and configured commercial displays and connected equipment for day-to-day business use.",
    category: "av",
    images: [],
  },
];

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectEntry;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = project.images.length > 0 ? project.images : [];
  const hasMultiple = images.length > 1;
  const categoryLabel = getCategoryLabel(project.category);

  const goPrev = useCallback(() => {
    setImageIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-200">
                {categoryLabel}
              </span>
              <h2 id="project-modal-title" className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {project.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">{project.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-neutral-950"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <>
                <div className="relative aspect-video w-full max-w-3xl">
                  <Image
                    src={assetPath(images[imageIndex])}
                    alt={`${project.title} – image ${imageIndex + 1} of ${images.length}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority
                  />
                </div>
                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      aria-label="Previous image"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      aria-label="Next image"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-48 w-full items-center justify-center text-neutral-600">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                  />
                </svg>
              </div>
            )}
          </div>

          {hasMultiple && images.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`h-14 w-20 overflow-hidden rounded-lg border-2 transition ${
                    i === imageIndex
                      ? "border-blue-400 ring-2 ring-blue-400/30"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={assetPath(src)} alt="" width={80} height={56} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {hasMultiple && (
            <p className="text-center text-xs text-neutral-500">
              {imageIndex + 1} of {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCardComponent({
  project,
  onClick,
}: {
  project: ProjectEntry;
  onClick: () => void;
}) {
  const coverImage = project.images[0];
  const categoryLabel = getCategoryLabel(project.category);
  const previewDescription =
    project.description.length > 100 ? `${project.description.slice(0, 100)}…` : project.description;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg shadow-black/20 transition hover:border-white/15 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900/80">
        {coverImage ? (
          <Image
            src={assetPath(coverImage)}
            alt={project.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            <svg
              viewBox="0 0 24 24"
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6 6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
          <span className="rounded-lg border border-white/30 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            View Project
          </span>
        </div>
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-200">
          {categoryLabel}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-white">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-300">{previewDescription}</p>
      </div>
    </article>
  );
}

export default function ProjectHighlights({ items = DEFAULT_PROJECTS }: { items?: ProjectEntry[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter first, then paginate (extend filteredItems when adding category filter)
  const filteredItems = items;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * PROJECTS_PER_PAGE,
    safePage * PROJECTS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const openProject = useCallback((project: ProjectEntry) => {
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section
      id="ourwork"
      className="relative isolate overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 py-16 sm:py-20"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-950/20 via-transparent to-neutral-950" />
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Our Work
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-300/90">
          Recent deployments and installations for businesses across Northern California.
        </p>

        {filteredItems.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center">
            <p className="text-neutral-400">No projects to display.</p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid min-h-[320px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((project) => (
                <ProjectCardComponent
                  key={project.id}
                  project={project}
                  onClick={() => openProject(project)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                        page === safePage
                          ? "border border-blue-400/50 bg-blue-500/20 text-blue-200"
                          : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                      aria-current={page === safePage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-900/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition"
          >
            Tell Us About Your Project
          </a>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={closeProject} />
      )}
    </section>
  );
}
