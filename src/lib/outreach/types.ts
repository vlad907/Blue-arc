/**
 * Structured outputs and config for the outreach agent pipeline (Agent 1 → mode → Agent 2 → Agent 3).
 */

export type OutreachMode = "signal" | "fallback" | "soft";

/** Agent 1 must return this shape (extend your parser/validator to enforce it). */
export type Agent1Output = {
  /** Evidence-backed issues only — quotes or paraphrases tied to page content. */
  pain_points_detected: string[];
  /** Raw signals extracted from the site (features, services, tech mentions). */
  signals_found: string[];
  /** Strength of extracted signals, 0.0–1.0 */
  confidence_score: number;
};

export type LeadContext = {
  industry?: string;
  /** Google Business Profile / Maps primary category text */
  googleBusinessCategory?: string;
};

/**
 * Workspace-level outreach strategy. Keys are normalized category slugs, e.g. "coffee_shop".
 */
export type WorkspaceOutreachConfig = {
  /** Categories your workspace cares about (normalized slugs). */
  target_categories?: string[];
  /** Pre-approved generic pain themes per category — used only in FALLBACK mode. */
  pain_points_by_category: Record<string, string[]>;
};

export type Agent2PromptInput = {
  mode: OutreachMode;
  agent1: Agent1Output;
  matched_category: string | null;
  /** From workspace — only used when mode === "fallback" */
  fallbackPainPoints?: string[];
  /** Display name for the prospect (optional, for salutation). */
  businessName?: string;
  /** Your one-line value prop / services (optional). */
  senderServiceSummary?: string;
};

/** Clamps confidence to [0, 1] and ensures arrays exist. */
export function normalizeAgent1Output(raw: Partial<Agent1Output>): Agent1Output {
  const pain = Array.isArray(raw.pain_points_detected) ? raw.pain_points_detected : [];
  const signals = Array.isArray(raw.signals_found) ? raw.signals_found : [];
  let c = typeof raw.confidence_score === "number" ? raw.confidence_score : 0;
  if (Number.isNaN(c)) c = 0;
  c = Math.min(1, Math.max(0, c));
  return {
    pain_points_detected: pain.filter((s) => typeof s === "string" && s.trim().length > 0),
    signals_found: signals.filter((s) => typeof s === "string" && s.trim().length > 0),
    confidence_score: c,
  };
}
