"use client";

import React, { useState } from "react";

export default function AdminTrustedForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setMessage("");

    const formData = new FormData();
    formData.set("name", name);
    if (href) formData.set("href", href);
    if (file) formData.set("logo", file);

    try {
      const res = await fetch("/api/admin/trusted", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      setMessage(`Added "${data.trusted.name}". Refresh the homepage to see it.`);
      setStatus("success");
      setName("");
      setHref("");
      setFile(null);
      form.reset();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="trusted-name" className="block text-sm font-medium text-neutral-300">
          Company name
        </label>
        <input
          id="trusted-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="e.g. Acme Corp"
        />
      </div>

      <div>
        <label htmlFor="trusted-href" className="block text-sm font-medium text-neutral-300">
          Website URL (optional)
        </label>
        <input
          id="trusted-href"
          type="url"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="trusted-logo" className="block text-sm font-medium text-neutral-300">
          Logo image
        </label>
        <input
          id="trusted-logo"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700"
        />
        <p className="mt-1 text-xs text-neutral-500">
          PNG, JPG, SVG, AVIF, etc. Saves to <code className="rounded bg-neutral-800 px-1">/public/logos/</code>
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
        {status === "submitting" ? "Uploading…" : "Add Trusted Company"}
      </button>
    </form>
  );
}
