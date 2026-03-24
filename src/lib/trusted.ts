import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type TrustedLogo = {
  name: string;
  src: string;
  href?: string;
  className?: string;
};

const DEFAULT_LOGOS: TrustedLogo[] = [
  { name: "Pour House", src: "/logos/PourHouse.png" },
  { name: "Schuster Homes", src: "/logos/schuster-homes.png" },
  { name: "COMP", src: "/logos/complogo.avif" },
  { name: "Snider Services", src: "/logos/imgl-ss-footer.jpg" },
  { name: "NCR Voyix", src: "/logos/ncr_voyix.svg" },
];

/** Read trusted companies from data/trusted.json. Falls back to defaults if empty or missing. */
export async function getTrusted(): Promise<TrustedLogo[]> {
  try {
    const path = join(process.cwd(), "data", "trusted.json");
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.logos) ? parsed.logos : [];
    if (items.length > 0) {
      return items;
    }
  } catch {
    // File missing or invalid
  }
  return DEFAULT_LOGOS;
}
