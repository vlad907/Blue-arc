import { NextResponse } from "next/server";

/** Required for `output: "export"` — admin APIs only run in development. */
export const dynamic = "force-static";
import { copyFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { isAdminApiEnabled } from "@/lib/admin-env";
import { readProjectsFile, writeProjectsFile } from "@/lib/admin-store";
import { PROJECT_CATEGORIES } from "@/lib/projects-constants";

const VALID_CATEGORIES = new Set<string>(PROJECT_CATEGORIES.map((c) => c.value));

function publicPathFromUrl(url: string): string | null {
  if (!url.startsWith("/")) return null;
  const segments = url.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  return join(process.cwd(), "public", ...segments);
}

function projectIdFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const q = url.searchParams.get("id");
  return q ? decodeURIComponent(q) : null;
}

export async function GET() {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const projects = await readProjectsFile();
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("Admin projects list error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const id = projectIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "Query parameter id is required" }, { status: 400 });
  }

  let body: { title?: string; description?: string; category?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.title === undefined && body.description === undefined && body.category === undefined) {
    return NextResponse.json({ error: "Provide at least one of: title, description, category" }, { status: 400 });
  }

  if (body.category !== undefined && !VALID_CATEGORIES.has(body.category)) {
    return NextResponse.json(
      { error: `Invalid category. Use one of: ${[...VALID_CATEGORIES].join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const projects = await readProjectsFile();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let project = { ...projects[index] };

    if (body.title !== undefined) project.title = String(body.title).trim();
    if (body.description !== undefined) project.description = String(body.description).trim();
    if (body.category !== undefined && body.category !== project.category) {
      const newCat = body.category;
      const newDir = join(process.cwd(), "public", "projects", newCat);
      await mkdir(newDir, { recursive: true });
      const newImages: string[] = [];
      for (const imgUrl of project.images) {
        const oldAbs = publicPathFromUrl(imgUrl);
        if (!oldAbs) {
          newImages.push(imgUrl);
          continue;
        }
        const filename = imgUrl.split("/").filter(Boolean).pop();
        if (!filename) {
          newImages.push(imgUrl);
          continue;
        }
        const newUrl = `/projects/${newCat}/${filename}`;
        const newAbs = publicPathFromUrl(newUrl);
        if (!newAbs) {
          newImages.push(imgUrl);
          continue;
        }
        try {
          await copyFile(oldAbs, newAbs);
          await unlink(oldAbs);
        } catch (e) {
          console.error("Move image failed:", imgUrl, e);
          return NextResponse.json({ error: `Could not move image: ${imgUrl}` }, { status: 500 });
        }
        newImages.push(newUrl);
      }
      project = { ...project, category: newCat, images: newImages };
    }

    if (!project.title) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }

    projects[index] = project;
    await writeProjectsFile(projects);

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("Admin project PATCH error:", err);
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

  const id = projectIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "Query parameter id is required" }, { status: 400 });
  }

  try {
    const projects = await readProjectsFile();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [removed] = projects.splice(index, 1);
    for (const imgUrl of removed.images) {
      const abs = publicPathFromUrl(imgUrl);
      if (abs) {
        try {
          await unlink(abs);
        } catch {
          // file may already be gone
        }
      }
    }

    await writeProjectsFile(projects);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("Admin project DELETE error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
