import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROJECT_CATEGORIES, type ProjectEntry } from "./projects-constants";

export type { ProjectEntry } from "./projects-constants";


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

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PROJECT_CATEGORIES.map((c) => [c.value, c.label])
);

export function getCategoryLabel(value: string): string {
  return CATEGORY_LABELS[value] ?? value;
}

/** Convert ProjectEntry to ProjectCard shape for ProjectHighlights. */
export function toProjectCard(entry: ProjectEntry): {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
} {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: getCategoryLabel(entry.category),
    image: entry.images[0],
  };
}

/** Read projects from data/projects.json. Falls back to defaults if empty or missing. */
export async function getProjects(): Promise<ProjectEntry[]> {
  try {
    const path = join(process.cwd(), "data", "projects.json");
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.projects) ? parsed.projects : [];
    if (items.length > 0) {
      return items;
    }
  } catch {
    // File missing or invalid
  }
  return DEFAULT_PROJECTS;
}
