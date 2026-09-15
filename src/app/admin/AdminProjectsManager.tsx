"use client";

import React, { useCallback, useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { PROJECT_CATEGORIES, type ProjectEntry } from "@/lib/projects-constants";

const projectsApi = (query?: string) =>
  `${assetPath("/api/admin/projects")}${query ? `?${query}` : ""}`;

type Props = {
  refreshKey?: number;
};

export default function AdminProjectsManager({ refreshKey = 0 }: Props) {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(projectsApi());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProjects(data.projects ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  function startEdit(p: ProjectEntry) {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditDescription(p.description);
    setEditCategory(p.category);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch(projectsApi(`id=${encodeURIComponent(id)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription,
          category: editCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject(id: string, title: string) {
    if (!globalThis.confirm(`Delete project “${title}”? This removes its images from disk.`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(projectsApi(`id=${encodeURIComponent(id)}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      if (editingId === id) setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  if (loading && projects.length === 0) {
    return <p className="mt-6 text-sm text-neutral-500">Loading projects…</p>;
  }

  return (
    <div className="mt-10 border-t border-white/10 pt-10">
      <h3 className="text-lg font-semibold text-white">Existing job posts</h3>
      <p className="mt-1 text-sm text-neutral-400">
        Edit title, description, or category. Changing category moves image files on disk.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {projects.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No projects in data/projects.json yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-4"
            >
              {editingId === p.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Title</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveEdit(p.id)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={cancelEdit}
                      className="rounded-lg border border-white/20 px-3 py-2 text-sm text-neutral-200 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{p.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{p.category}</p>
                    {p.description ? (
                      <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{p.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-neutral-600">{p.images.length} image(s)</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-white/20 px-3 py-2 text-sm text-neutral-200 hover:bg-white/5 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => void removeProject(p.id, p.title)}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      {busyId === p.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
