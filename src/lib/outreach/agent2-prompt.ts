import type { Agent2PromptInput } from "./types";

/**
 * Dynamic sections for Agent 2 — do not use a single static prompt; inject these blocks.
 */
export type Agent2PromptSections = {
  mode: string;
  modeBlock: string;
  phrasingRules: string;
  assemblyInstructions: string;
};

function signalBlock(input: Agent2PromptInput): string {
  const { agent1 } = input;
  const pains = agent1.pain_points_detected.map((p) => `- ${p}`).join("\n");
  const signals = agent1.signals_found.map((s) => `- ${s}`).join("\n");
  return [
    "MODE: SIGNAL",
    "Use ONLY website-derived evidence. Reference exact findings; do not invent problems.",
    "",
    "Evidence-backed pain points (from the site):",
    pains || "(none)",
    "",
    "Signals / facts observed on the site:",
    signals || "(none)",
    "",
    "Example tone: \"I noticed you offer [X] — …\" (tie to the bullets above.)",
  ].join("\n");
}

function fallbackBlock(input: Agent2PromptInput): string {
  const { fallbackPainPoints = [], matched_category } = input;
  const list = fallbackPainPoints.map((p) => `- ${p}`).join("\n");
  return [
    "MODE: FALLBACK",
    `Matched category (internal): ${matched_category ?? "unknown"}`,
    "",
    "You must NOT assume this business has these problems.",
    "You may reference them as common scenarios only, using safe phrasing.",
    "",
    "Workspace-approved themes (general industry context — NOT facts about this business):",
    list || "(none)",
    "",
    "ALLOWED phrasing examples:",
    '- "Many coffee shops we work with eventually look at…"',
    '- "Some restaurants run into…"',
    '- "If this is something you\'re dealing with…"',
    "",
    "NOT ALLOWED:",
    '- "You are struggling with…"',
    '- "Your business has issues with…"',
    "- Any statement that assumes a specific problem without site evidence.",
  ].join("\n");
}

function softBlock(): string {
  return [
    "MODE: SOFT",
    "Do not include pain points or assumptions about their problems.",
    "Structure:",
    "1) A genuine compliment or specific observation tied to public info (e.g. location, offering, brand).",
    "2) A brief, relevant mention of how you help (services).",
    "3) A light CTA (e.g. open to a short call).",
  ].join("\n");
}

export function buildAgent2PromptSections(input: Agent2PromptInput): Agent2PromptSections {
  const mode = input.mode === "signal" ? "SIGNAL" : input.mode === "fallback" ? "FALLBACK" : "SOFT";

  const modeBlock =
    input.mode === "signal"
      ? signalBlock(input)
      : input.mode === "fallback"
        ? fallbackBlock(input)
        : softBlock();

  const phrasingRules = [
    "Global rules for all modes:",
    "- Never fabricate metrics, reviews, or site content not listed above.",
    "- If MODE is SIGNAL, every claim about their situation must map to pain_points_detected or signals_found.",
    "- If MODE is FALLBACK, frame themes as industry-common, not as facts about them.",
    "- If MODE is SOFT, no operational pain assumptions.",
  ].join("\n");

  const assemblyInstructions = [
    "Assemble the email using ONLY the MODE block above plus the Global rules.",
    "Do not add speculative pain points.",
  ].join("\n");

  return {
    mode,
    modeBlock,
    phrasingRules,
    assemblyInstructions,
  };
}

/** Single string to append to your Agent 2 system prompt (or use sections separately). */
export function buildAgent2SystemPromptAddendum(input: Agent2PromptInput): string {
  const s = buildAgent2PromptSections(input);
  return [s.modeBlock, "", s.phrasingRules, "", s.assemblyInstructions].join("\n");
}
