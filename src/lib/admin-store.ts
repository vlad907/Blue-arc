import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectEntry } from "./projects-constants";
import type { TrustedLogo } from "./trusted";

export type TrustedEntry = TrustedLogo & { id: string };

export async function readProjectsFile(): Promise<ProjectEntry[]> {
  const dataPath = join(process.cwd(), "data", "projects.json");
  try {
    const raw = await readFile(dataPath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as ProjectEntry[];
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { projects?: unknown }).projects)) {
      return (parsed as { projects: ProjectEntry[] }).projects;
    }
  } catch {
    // missing or invalid
  }
  return [];
}

export async function writeProjectsFile(projects: ProjectEntry[]) {
  const dataPath = join(process.cwd(), "data", "projects.json");
  await writeFile(dataPath, JSON.stringify(projects, null, 2));
}

export function ensureTrustedIds(items: TrustedLogo[]): { entries: TrustedEntry[]; changed: boolean } {
  let changed = false;
  const entries: TrustedEntry[] = items.map((item) => {
    if (item.id) {
      return item as TrustedEntry;
    }
    changed = true;
    return { ...item, id: randomUUID() };
  });
  return { entries, changed };
}

export async function readTrustedFile(): Promise<{ entries: TrustedEntry[]; changed: boolean }> {
  const dataPath = join(process.cwd(), "data", "trusted.json");
  try {
    const raw = await readFile(dataPath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    const items: TrustedLogo[] = Array.isArray(parsed)
      ? (parsed as TrustedLogo[])
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { logos?: unknown }).logos)
        ? ((parsed as { logos: TrustedLogo[] }).logos)
        : [];
    return ensureTrustedIds(items);
  } catch {
    return { entries: [], changed: false };
  }
}

export async function writeTrustedFile(entries: TrustedEntry[]) {
  const dataPath = join(process.cwd(), "data", "trusted.json");
  await writeFile(dataPath, JSON.stringify(entries, null, 2));
}
