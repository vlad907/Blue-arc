import { NextResponse } from "next/server";

/** Required for `output: "export"` — admin APIs only run in development. */
export const dynamic = "force-static";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { isAdminApiEnabled } from "@/lib/admin-env";
import { readTrustedFile, writeTrustedFile } from "@/lib/admin-store";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function publicPathFromUrl(url: string): string | null {
  if (!url.startsWith("/")) return null;
  const segments = url.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  return join(process.cwd(), "public", ...segments);
}

function trustedIdFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const q = url.searchParams.get("id");
  return q ? decodeURIComponent(q) : null;
}

export async function GET() {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const { entries, changed } = await readTrustedFile();
    if (changed) await writeTrustedFile(entries);
    return NextResponse.json({ trusted: entries });
  } catch (err) {
    console.error("Admin trusted list error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load trusted logos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const href = String(formData.get("href") || "").trim() || undefined;
    const file = formData.get("logo") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }
    if (!file || file.size === 0 || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Logo image is required" }, { status: 400 });
    }

    const logosDir = join(process.cwd(), "public", "logos");
    await mkdir(logosDir, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExt = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext) ? ext : "png";
    const filename = `${slugify(name)}.${safeExt}`;
    const filePath = join(logosDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const entry = {
      id: randomUUID(),
      name,
      src: `/logos/${filename}`,
      ...(href ? { href } : {}),
    };

    const { entries, changed } = await readTrustedFile();
    if (changed) await writeTrustedFile(entries);
    entries.push(entry);
    await writeTrustedFile(entries);

    return NextResponse.json({
      success: true,
      trusted: entry,
    });
  } catch (err) {
    console.error("Trusted upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const id = trustedIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "Query parameter id is required" }, { status: 400 });
  }

  try {
    const { entries, changed } = await readTrustedFile();
    if (changed) await writeTrustedFile(entries);

    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const hrefRaw = String(formData.get("href") || "").trim();
    const href = hrefRaw || undefined;
    const f = formData.get("logo");
    const logoFile = f instanceof File && f.size > 0 && f.type.startsWith("image/") ? f : null;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const prev = entries[index];
    let src = prev.src;

    if (logoFile) {
      const logosDir = join(process.cwd(), "public", "logos");
      await mkdir(logosDir, { recursive: true });
      const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
      const safeExt = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext) ? ext : "png";
      const filename = `${slugify(name)}.${safeExt}`;
      const filePath = join(logosDir, filename);
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      await writeFile(filePath, buffer);
      src = `/logos/${filename}`;

      const oldAbs = publicPathFromUrl(prev.src);
      if (oldAbs && prev.src.startsWith("/logos/")) {
        try {
          await unlink(oldAbs);
        } catch {
          // ignore
        }
      }
    }

    const updated = {
      ...prev,
      id: prev.id,
      name,
      href,
      src,
    };
    entries[index] = updated;
    await writeTrustedFile(entries);

    return NextResponse.json({ success: true, trusted: updated });
  } catch (err) {
    console.error("Admin trusted PATCH error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const id = trustedIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "Query parameter id is required" }, { status: 400 });
  }

  try {
    const { entries, changed } = await readTrustedFile();
    if (changed) await writeTrustedFile(entries);

    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const [removed] = entries.splice(index, 1);
    const abs = publicPathFromUrl(removed.src);
    if (abs && removed.src.startsWith("/logos/")) {
      try {
        await unlink(abs);
      } catch {
        // ignore
      }
    }

    await writeTrustedFile(entries);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("Admin trusted DELETE error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
