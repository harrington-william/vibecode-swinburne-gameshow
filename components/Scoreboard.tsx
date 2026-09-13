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

type Change = { delta: number; key: number };

export default function TeamScore({
  team,
  score,
  active,
  align,
}: TeamScoreProps) {
  const skin = SKIN[team];
  const { name, emoji } = TEAMS[team];

  // Whenever the score moves, bounce (up) or shake (down) the number and
  // float a "+5" / "-15" badge off the card. `key` re-triggers the CSS
  // animation even when two identical changes land back to back.
  const [change, setChange] = useState<Change | null>(null);
  const previous = useRef(score);

  useEffect(() => {
    if (score === previous.current) return;
    const delta = score - previous.current;
    previous.current = score;
    setChange({ delta, key: Date.now() });
    const id = setTimeout(() => setChange(null), 1300);
    return () => clearTimeout(id);
  }, [score]);

  const moving = change !== null;
  const gained = (change?.delta ?? 0) > 0;

  return (
    <div
      className={`sticker relative flex flex-col rounded-[28px] bg-white px-6 py-4 sm:px-8 sm:py-5 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      } ${active ? "anim-attention" : ""} ${moving && !gained ? "anim-drop" : ""}`}
    >
      {change && (
        <span
          key={change.key}
          className={`anim-float-away sticker-sm pointer-events-none absolute -top-6 rounded-full px-3 py-1 font-display text-lg font-black text-white sm:text-2xl ${
            gained ? "bg-mint" : "bg-chili"
          } ${align === "right" ? "right-3" : "left-3"}`}
        >
          {gained ? `+${change.delta} 🎉` : `${change.delta} 😬`}
        </span>
      )}

      <div
        className={`sticker-sm flex items-center gap-2 rounded-full px-4 py-1.5 ${skin.chip}`}
      >
        <span className="text-xl sm:text-2xl">{emoji}</span>
        <span className="font-display text-base font-bold sm:text-xl">
          {name}
        </span>
      </div>

      <span
        className={`font-display text-6xl font-black tabular-nums leading-none sm:text-7xl ${skin.accent} ${
          moving && gained ? "anim-bump" : ""
        }`}
      >
        {score}
      </span>
      <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft sm:text-sm">
        points
      </span>

      {active && (
        <span
          className={`mt-1 rounded-full px-2.5 py-0.5 font-display text-[0.65rem] font-bold uppercase tracking-widest text-white sm:text-xs ${skin.ring}`}
        >
          answering
        </span>
      )}
    </div>
  );
}
