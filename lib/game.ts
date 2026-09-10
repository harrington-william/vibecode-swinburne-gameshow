import type { TeamId } from "./questions";

/** What a team gave for the question on screen. */
export type Submission = {
  /** choice → option index · boolean → true/false · blank → the typed text */
  value: number | boolean | string;
  correct: boolean;
};

export type Answers = Record<TeamId, Submission | null>;

export type Phase =
  | "intro"
  | "question"
  | "reveal"
  | "round-end"
  | "finished";

export const TEAM_IDS: TeamId[] = ["t1", "t2"];

/** Team 1 answers first, then Team 2; `null` once both are in. */
export function nextTeam(answers: Answers): TeamId | null {
  return TEAM_IDS.find((team) => answers[team] === null) ?? null;
}

export const EMPTY_ANSWERS: Answers = { t1: null, t2: null };
