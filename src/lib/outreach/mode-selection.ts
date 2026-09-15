import type { Agent1Output, OutreachMode, WorkspaceOutreachConfig } from "./types";
import { normalizeAgent1Output } from "./types";

const SIGNAL_CONFIDENCE_MIN = 0.5;

/**
 * Select outreach mode before Agent 2:
 *
 * - signal: evidence-backed pain points + sufficient confidence
 * - fallback: workspace category + configured pain themes (non-factual phrasing)
 * - soft: no assumed pain points
 */
export function selectOutreachMode(
  agent1: Partial<Agent1Output>,
  matched_category: string | null,
  workspace: WorkspaceOutreachConfig
): OutreachMode {
  const a1 = normalizeAgent1Output(agent1);

  if (a1.pain_points_detected.length > 0 && a1.confidence_score >= SIGNAL_CONFIDENCE_MIN) {
    return "signal";
  }

  if (
    matched_category &&
    Array.isArray(workspace.pain_points_by_category?.[matched_category]) &&
    workspace.pain_points_by_category[matched_category].length > 0
  ) {
    return "fallback";
  }

  return "soft";
}

export { SIGNAL_CONFIDENCE_MIN };
