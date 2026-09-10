"use client";

import { useEffect, useRef, useState } from "react";
import { TEAMS, type TeamId } from "@/lib/questions";

type TeamScoreProps = {
  team: TeamId;
  score: number;
  /** Highlighted while this team is the one answering. */
  active: boolean;
  align: "left" | "right";
};

const SKIN = {
  t1: { chip: "bg-berry-soft", accent: "text-berry", ring: "bg-berry" },
  t2: { chip: "bg-grape-soft", accent: "text-grape", ring: "bg-grape" },
} as const;

export default function TeamScore({
  team,
  score,
  active,
  align,
}: TeamScoreProps) {
  const skin = SKIN[team];
  const { name, emoji } = TEAMS[team];

  // Give the number a little bounce whenever it goes up.
  const [bumping, setBumping] = useState(false);
  const previous = useRef(score);

  useEffect(() => {
    if (score === previous.current) return;
    const gained = score > previous.current;
    previous.current = score;
    if (!gained) return;
    setBumping(true);
    const id = setTimeout(() => setBumping(false), 520);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <div
      className={`sticker flex flex-col rounded-3xl bg-white px-5 py-3 sm:px-6 sm:py-4 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      } ${active ? "anim-attention" : ""}`}
    >
      <div
        className={`sticker-sm flex items-center gap-2 rounded-full px-3 py-1 ${skin.chip}`}
      >
        <span className="text-base">{emoji}</span>
        <span className="font-display text-sm font-bold sm:text-base">
          {name}
        </span>
      </div>

      <span
        className={`font-display text-4xl font-black tabular-nums sm:text-5xl ${skin.accent} ${
          bumping ? "anim-bump" : ""
        }`}
      >
        {score}
      </span>
      <span className="font-display text-[0.65rem] font-bold uppercase tracking-widest text-ink-soft">
        points
      </span>

      {active && (
        <span
          className={`mt-1 rounded-full px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest text-white ${skin.ring}`}
        >
          answering
        </span>
      )}
    </div>
  );
}
