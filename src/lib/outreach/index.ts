export {
  normalizeAgent1Output,
  type Agent1Output,
  type Agent2PromptInput,
  type LeadContext,
  type OutreachMode,
  type WorkspaceOutreachConfig,
} from "./types";

export { normalizeCategoryKey, matchCategory } from "./category-match";

export { selectOutreachMode, SIGNAL_CONFIDENCE_MIN } from "./mode-selection";

export {
  buildAgent2PromptSections,
  buildAgent2SystemPromptAddendum,
  type Agent2PromptSections,
} from "./agent2-prompt";

export {
  AGENT3_REVIEW_SYSTEM_PROMPT,
  buildAgent3UserPrompt,
  type Agent3ReviewContext,
} from "./agent3-prompt";

export { prepareOutreachForAgent2, type PreparedOutreach } from "./pipeline";
