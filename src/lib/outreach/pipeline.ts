/**
 * Single entry: Agent 1 output + lead + workspace → mode + Agent 2 prompt input.
 * Wire your LLM calls around these pure functions.
 */

import { buildAgent2PromptSections, buildAgent2SystemPromptAddendum } from "./agent2-prompt";
import { matchCategory } from "./category-match";
import { selectOutreachMode } from "./mode-selection";
import type {
  Agent1Output,
  Agent2PromptInput,
  LeadContext,
  OutreachMode,
  WorkspaceOutreachConfig,
} from "./types";
import { normalizeAgent1Output } from "./types";

export type PreparedOutreach = {
  agent1: Agent1Output;
  matched_category: string | null;
  mode: OutreachMode;
  agent2Input: Agent2PromptInput;
  agent2Addendum: string;
  agent2Sections: ReturnType<typeof buildAgent2PromptSections>;
};

export function prepareOutreachForAgent2(
  rawAgent1: Partial<Agent1Output>,
  lead: LeadContext,
  workspace: WorkspaceOutreachConfig,
  options?: { businessName?: string; senderServiceSummary?: string }
): PreparedOutreach {
  const agent1 = normalizeAgent1Output(rawAgent1);
  const matched_category = matchCategory(lead, workspace);
  const mode = selectOutreachMode(agent1, matched_category, workspace);

  const fallbackPainPoints =
    mode === "fallback" && matched_category
      ? workspace.pain_points_by_category[matched_category] ?? []
      : undefined;

  const agent2Input: Agent2PromptInput = {
    mode,
    agent1,
    matched_category,
    fallbackPainPoints,
    businessName: options?.businessName,
    senderServiceSummary: options?.senderServiceSummary,
  };

  return {
    agent1,
    matched_category,
    mode,
    agent2Input,
    agent2Addendum: buildAgent2SystemPromptAddendum(agent2Input),
    agent2Sections: buildAgent2PromptSections(agent2Input),
  };
}
