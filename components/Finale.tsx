"use client";

import { MAX_SCORE, TEAMS, type TeamId } from "@/lib/questions";
import { TEAM_IDS } from "@/lib/game";
import Fireworks from "./Fireworks";

type FinaleProps = {
  scores: Record<TeamId, number>;
  onRestart: () => void;
};

export default function Finale({ scores, onRestart }: FinaleProps) {
  const tied = scores.t1 === scores.t2;
  const winner: TeamId = scores.t1 >= scores.t2 ? "t1" : "t2";

  return (
    <>
      <Fireworks />

      <div className="anim-pop relative z-50 flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="sticker flex w-full flex-col items-center gap-4 rounded-[36px] bg-white px-6 py-8 sm:px-12 sm:py-10">
          <span className="anim-float text-6xl sm:text-7xl">
            {tied ? "🤝" : "🏆"}
          </span>

          {tied ? (
            <h1 className="font-display text-3xl font-black sm:text-5xl">
              It&apos;s a tie! Both teams share the prize 🎁
            </h1>
          ) : (
            <h1 className="font-display text-3xl font-black sm:text-5xl">
              {TEAMS[winner].emoji} {TEAMS[winner].name} wins the prize! 🎁
            </h1>
          )}

          <div className="mt-2 grid w-full gap-4 sm:grid-cols-2">
            {TEAM_IDS.map((team) => (
              <div
                key={team}
                className={`sticker flex flex-col items-center gap-1 rounded-3xl px-5 py-5 ${
                  team === "t1" ? "bg-berry-soft" : "bg-grape-soft"
                }`}
              >
                <span className="font-display text-lg font-bold">
                  {TEAMS[team].emoji} {TEAMS[team].name}
                </span>
                <span className="font-display text-5xl font-black tabular-nums">
                  {scores[team]}
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
                  out of {MAX_SCORE}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="sticker w-full rounded-[36px] bg-mango-soft px-6 py-7 sm:px-12">
          <p className="font-display text-2xl font-black sm:text-3xl">
            Thank you for watching! 💛
          </p>
          <p className="mt-3 font-display text-base font-bold leading-relaxed text-ink-soft sm:text-lg">
            A big thank you to our examiners and to everyone who played along.
            We hope you enjoyed travelling the world one dish at a time —
            from Tet in Vietnam to Christmas in Argentina. 🌏🍽️
          </p>
          <p className="mt-3 font-display text-sm font-bold text-ink-soft">
            🎉 Congratulations to both teams! 🎉
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="squish sticker rounded-full bg-white px-8 py-4 font-display text-lg font-black"
        >
          Play again 🔄
        </button>
      </div>
    </>
  );
}
