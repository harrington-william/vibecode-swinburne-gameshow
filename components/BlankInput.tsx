"use client";

import { useState } from "react";
import { TEAMS, type BlankQuestion, type TeamId } from "@/lib/questions";
import { TEAM_IDS, type Answers } from "@/lib/game";

type BlankInputProps = {
  question: BlankQuestion;
  answers: Answers;
  activeTeam: TeamId | null;
  revealed: boolean;
  onAnswer: (typed: string) => void;
  /** Host correction: flip a team's verdict while the reveal is on screen. */
  onOverride: (team: TeamId) => void;
};

export default function BlankInput({
  question,
  answers,
  activeTeam,
  revealed,
  onAnswer,
  onOverride,
}: BlankInputProps) {
  const [typed, setTyped] = useState("");

  if (revealed) {
    return (
      <div className="flex flex-col gap-4">
        <div className="sticker anim-pop flex flex-col items-center gap-1 rounded-3xl bg-mint px-6 py-5 text-white">
          <span className="font-display text-xs font-bold uppercase tracking-widest">
            The answer is
          </span>
          <span className="font-display text-3xl font-black sm:text-4xl">
            {question.answer}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TEAM_IDS.map((team) => {
            const submission = answers[team];
            const correct = submission?.correct ?? false;
            return (
              <div
                key={team}
                className={`sticker flex flex-col gap-2 rounded-3xl px-4 py-4 ${
                  correct ? "bg-mint-soft" : "bg-chili/15"
                }`}
              >
                <span className="font-display text-sm font-bold text-ink-soft">
                  {TEAMS[team].emoji} {TEAMS[team].name} typed
                </span>
                <span className="font-display text-xl font-black break-words">
                  {String(submission?.value || "").trim() || "— nothing —"}
                </span>
                <span className="font-display text-sm font-bold">
                  {correct ? "✅ Correct" : "❌ Not quite"}
                </span>
                <button
                  type="button"
                  onClick={() => onOverride(team)}
                  className="squish sticker-sm mt-1 self-start rounded-full bg-white px-3 py-1 font-display text-xs font-bold"
                >
                  {correct ? "Mark as wrong" : "Mark as correct"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center font-display text-xs font-bold text-ink-soft">
          Host: use “mark as…” only to fix spelling the checker was too strict
          about. It locks when you move on.
        </p>
      </div>
    );
  }

  const waiting = activeTeam === null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (waiting) return;
        onAnswer(typed);
        setTyped("");
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        // Remount for each team so nobody inherits the previous answer.
        key={activeTeam ?? "none"}
        autoFocus
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        disabled={waiting}
        placeholder={
          activeTeam
            ? `Type ${TEAMS[activeTeam].name}'s answer…`
            : "Waiting…"
        }
        aria-label="Team answer"
        className="sticker w-full rounded-3xl bg-white px-5 py-4 font-display text-xl font-bold outline-none placeholder:text-ink-soft/60 focus:bg-mango-soft"
      />
      <button
        type="submit"
        disabled={waiting}
        className="squish sticker shrink-0 rounded-3xl bg-mango px-7 py-4 font-display text-xl font-black"
      >
        Lock it in 🔒
      </button>
    </form>
  );
}
