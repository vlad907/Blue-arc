"use client";

import React, { useCallback, useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import type { TrustedLogo } from "@/lib/trusted";

const trustedApi = (query?: string) =>
  `${assetPath("/api/admin/trusted")}${query ? `?${query}` : ""}`;

type TrustedRow = TrustedLogo & { id: string };

type Props = {
  refreshKey?: number;
};

export default function AdminTrustedList({ refreshKey = 0 }: Props) {
  const [items, setItems] = useState<TrustedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editHref, setEditHref] = useState("");
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(trustedApi());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const list = (data.trusted ?? []) as TrustedRow[];
      setItems(list.filter((t): t is TrustedRow => Boolean(t.id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  function startEdit(t: TrustedRow) {
    setEditingId(t.id);
    setEditName(t.name);
    setEditHref(t.href ?? "");
    setEditLogo(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditLogo(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("name", editName.trim());
      if (editHref.trim()) formData.set("href", editHref.trim());
      if (editLogo) formData.set("logo", editLogo);

      const res = await fetch(trustedApi(`id=${encodeURIComponent(id)}`), {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditingId(null);
      setEditLogo(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeTrusted(id: string, name: string) {
    if (!globalThis.confirm(`Remove “${name}” from Trusted By? The logo file under /public/logos/ will be deleted.`))
      return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(trustedApi(`id=${encodeURIComponent(id)}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  if (loading && items.length === 0) {
    return <p className="mt-6 text-sm text-neutral-500">Loading trusted logos…</p>;
  }

  return (
    <div className="mt-10 border-t border-white/10 pt-10">
      <h3 className="text-lg font-semibold text-white">Existing logos</h3>
      <p className="mt-1 text-sm text-neutral-400">
        Edit name, link, or replace the image. Leave image empty to keep the current file.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No entries in data/trusted.json.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-4"
            >
              {editingId === t.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Company name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Website URL (optional)</label>
                    <input
                      type="url"
                      value={editHref}
                      onChange={(e) => setEditHref(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400">Replace logo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditLogo(e.target.files?.[0] ?? null)}
                      className="mt-1 w-full text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={saving || !editName.trim()}
                      onClick={() => void saveEdit(t.id)}
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="relative h-12 w-24 shrink-0 rounded border border-white/10 bg-white/5 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(t.src)} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white">{t.name}</p>
                      {t.href ? (
                        <p className="truncate text-xs text-neutral-500">{t.href}</p>
                      ) : (
                        <p className="text-xs text-neutral-600">No link</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === t.id}
                      onClick={() => startEdit(t)}
                      className="rounded-lg border border-white/20 px-3 py-2 text-sm text-neutral-200 hover:bg-white/5 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyId === t.id}
                      onClick={() => void removeTrusted(t.id, t.name)}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      {busyId === t.id ? "…" : "Delete"}
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
