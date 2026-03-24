export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
};

export const PROJECT_CATEGORIES = [
  { value: "cabling", label: "Cabling" },
  { value: "cameras", label: "Surveillance" },
  { value: "network", label: "Networking" },
  { value: "rack", label: "Rack / Infrastructure" },
  { value: "wifi", label: "Wi‑Fi" },
  { value: "av", label: "Audio / Video" },
] as const;

const LABEL_MAP: Record<string, string> = Object.fromEntries(
  PROJECT_CATEGORIES.map((c) => [c.value, c.label])
);

export function getCategoryLabel(value: string): string {
  return LABEL_MAP[value] ?? value;
}
