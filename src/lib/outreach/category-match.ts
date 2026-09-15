import type { LeadContext, WorkspaceOutreachConfig } from "./types";

/**
 * Normalize free-text industry or GBP category to a slug key, e.g. "Coffee shop" → "coffee_shop".
 */
export function normalizeCategoryKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Common aliases → canonical workspace keys (extend as needed). */
const CATEGORY_ALIASES: Record<string, string> = {
  coffee_shop: "coffee_shop",
  coffee: "coffee_shop",
  cafe: "coffee_shop",
  restaurant: "restaurant",
  restaurants: "restaurant",
  food: "restaurant",
  retail: "retail",
  store: "retail",
  office: "office",
  medical: "medical",
  healthcare: "medical",
};

function resolveAlias(slug: string): string {
  return CATEGORY_ALIASES[slug] ?? slug;
}

/**
 * Pick the best matching workspace category from lead + workspace config.
 * Priority: fields that resolve to a key in `pain_points_by_category`, then `target_categories`.
 */
export function matchCategory(
  lead: LeadContext,
  workspace: WorkspaceOutreachConfig
): string | null {
  const candidates = [lead.industry, lead.googleBusinessCategory].filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0
  );

  const normalized: string[] = [];
  for (const c of candidates) {
    const slug = resolveAlias(normalizeCategoryKey(c));
    normalized.push(slug);
  }

  const byPain = workspace.pain_points_by_category ?? {};
  const targets = new Set(
    (workspace.target_categories ?? []).map((t) => resolveAlias(normalizeCategoryKey(t)))
  );

  for (const slug of normalized) {
    if (Array.isArray(byPain[slug]) && byPain[slug].length > 0) {
      return slug;
    }
  }

  for (const slug of normalized) {
    if (targets.has(slug)) {
      return slug;
    }
  }

  for (const slug of normalized) {
    if (slug in byPain) {
      return slug;
    }
  }

  return null;
}
