import type { ReactNode } from "react";
import { TEAMS, type Round, type TeamId } from "@/lib/questions";
import { TEAM_IDS } from "@/lib/game";

type RoundEndProps = {
  round: Round;
  /** Points each team earned during this round alone. */
  gained: Record<TeamId, number>;
  totals: Record<TeamId, number>;
  isLast: boolean;
  onNext: () => void;
  /** Extra payoff for the round, e.g. the fully revealed mystery dish. */
  children?: ReactNode;
};

export default function RoundEnd({
  round,
  gained,
  totals,
  isLast,
  onNext,
  children,
}: RoundEndProps) {
  return (
    <div className="anim-pop flex w-full max-w-2xl flex-col items-center gap-5 text-center">
      <div className="sticker flex w-full flex-col items-center gap-4 rounded-[36px] bg-white px-6 py-8 sm:px-10">
        <span className="text-5xl">🎊</span>
        <h1 className="font-display text-2xl font-black sm:text-3xl">
          Round {round.number} complete!
        </h1>

        {children}

        <div className="grid w-full gap-3 sm:grid-cols-2">
          {TEAM_IDS.map((team) => (
            <div
              key={team}
              className={`sticker flex flex-col items-center gap-0.5 rounded-3xl px-4 py-4 ${
                team === "t1" ? "bg-berry-soft" : "bg-grape-soft"
              }`}
            >
              <span className="font-display text-sm font-bold">
                {TEAMS[team].emoji} {TEAMS[team].name}
              </span>
              <span className="font-display text-3xl font-black tabular-nums">
                +{gained[team]}
              </span>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
                this round · {totals[team]} total
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="squish sticker rounded-full bg-mango px-9 py-4 font-display text-xl font-black"
      >
        {isLast ? "See the results 🏆" : `On to Round ${round.number + 1} →`}
      </button>
    </div>
  );
}
