import { NextResponse } from "next/server";

/** Required for `output: "export"` — admin APIs only run in development. */
export const dynamic = "force-static";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { isAdminApiEnabled } from "@/lib/admin-env";
import { PROJECT_CATEGORIES } from "@/lib/projects-constants";

const VALID_CATEGORIES = new Set<string>(PROJECT_CATEGORIES.map((c) => c.value));

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").toLowerCase();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json(
        { error: `Invalid category. Use one of: ${[...VALID_CATEGORIES].join(", ")}` },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as File[];
    const imageFiles = files.filter((f) => f && f.size > 0 && f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    const id = slugify(title) + "-" + Date.now().toString(36);
    const projectDir = join(process.cwd(), "public", "projects", category);

    await mkdir(projectDir, { recursive: true });

    const imagePaths: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
      const filename = `${id}-${i}.${safeExt}`;
      const filePath = join(projectDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      imagePaths.push(`/projects/${category}/${filename}`);
    }

    const project = {
      id,
      title,
      description,
      category,
      images: imagePaths,
    };

    const dataPath = join(process.cwd(), "data", "projects.json");
    let projects: { id: string; title: string; description: string; category: string; images: string[] }[] = [];
    try {
      const raw = await readFile(dataPath, "utf-8");
      const parsed = JSON.parse(raw);
      projects = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.projects) ? parsed.projects : [];
    } catch {
      projects = [];
    }
    projects.push(project);
    await writeFile(dataPath, JSON.stringify(projects, null, 2));

    return NextResponse.json({
      success: true,
      project: { ...project, imageCount: imagePaths.length },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
