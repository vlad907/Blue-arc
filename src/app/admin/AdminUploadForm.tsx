"use client";

import React, { useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { PROJECT_CATEGORIES } from "@/lib/projects-constants";

type Props = {
  onSuccess?: () => void;
};

export default function AdminUploadForm({ onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(PROJECT_CATEGORIES[0].value);
  const [files, setFiles] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("category", category);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    try {
      const res = await fetch(assetPath("/api/admin/upload"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      setMessage(`Added "${data.project.title}" with ${data.project.imageCount} image(s). Refresh the homepage to see it.`);
      setStatus("success");
      setTitle("");
      setDescription("");
      setFiles(null);
      onSuccess?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="e.g. Office Wi-Fi Upgrade"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-300">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Short description of the project..."
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-neutral-300">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {PROJECT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-neutral-300">
          Images
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => setFiles(e.target.files)}
          className="mt-1 w-full text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700"
        />
        <p className="mt-1 text-xs text-neutral-500">
          One or more images. Saves to <code className="rounded bg-neutral-800 px-1">/public/projects/{category}/</code>
        </p>
      </div>

      {message && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "error"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
      >
        {status === "submitting" ? "Uploading…" : "Add Project"}
      </button>
    </form>
  );
}
