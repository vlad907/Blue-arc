import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
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

    const entry = { name, src: `/logos/${filename}`, ...(href ? { href } : {}) };

    const dataPath = join(process.cwd(), "data", "trusted.json");
    let trusted: { name: string; src: string; href?: string }[] = [];
    try {
      const raw = await readFile(dataPath, "utf-8");
      const parsed = JSON.parse(raw);
      trusted = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.logos) ? parsed.logos : [];
    } catch {
      trusted = [];
    }
    trusted.push(entry);
    await writeFile(dataPath, JSON.stringify(trusted, null, 2));

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
