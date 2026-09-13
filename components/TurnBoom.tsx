"use client";

import { useEffect } from "react";
import { TEAMS, type TeamId } from "@/lib/questions";

type TurnBoomProps = {
  team: TeamId;
  /** Called once the animation has played out so the parent can unmount it. */
  onDone: () => void;
};

const SHARDS = ["🍕", "🍩", "🌮", "🍣", "🥐", "🍜", "🍰", "🥟", "🍓", "🧁", "🍪", "🥭"];

/** How long the whole thing stays on screen — matches the CSS keyframes. */
const DURATION_MS = 1500;

const SKIN = {
  t1: { card: "bg-berry", ring: "border-berry" },
  t2: { card: "bg-grape", ring: "border-grape" },
} as const;

/**
 * Full-screen "BOOM" that fires when the turn passes to the next team.
 * Purely decorative — it doesn't block clicks for long and never holds state.
 */
export default function TurnBoom({ team, onDone }: TurnBoomProps) {
  useEffect(() => {
    const id = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(id);
  }, [onDone]);

  const skin = SKIN[team];
  const { name, emoji } = TEAMS[team];

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="anim-boom-backdrop absolute inset-0 bg-ink/25 backdrop-blur-[2px]" />

      {/* Expanding ring */}
      <div
        className={`anim-shockwave absolute h-40 w-40 rounded-full border-[10px] ${skin.ring}`}
      />

      {/* Emoji shrapnel */}
      {SHARDS.map((shard, index) => (
        <span
          key={shard}
          className="anim-boom-shard absolute text-4xl sm:text-5xl"
          style={
            {
              "--angle": `${(360 / SHARDS.length) * index}deg`,
              "--reach": index % 2 === 0 ? "300px" : "210px",
              animationDelay: `${(index % 3) * 60}ms`,
            } as React.CSSProperties
          }
        >
          {shard}
        </span>
      ))}

      {/* The card itself */}
      <div
        className={`anim-boom sticker relative flex flex-col items-center gap-1 rounded-[36px] px-10 py-7 text-center text-white sm:px-14 sm:py-9 ${skin.card}`}
      >
        <span className="font-display text-6xl font-black drop-shadow sm:text-8xl">
          💥 BOOM!
        </span>
        <span className="font-display text-3xl font-black sm:text-5xl">
          {emoji} {name} — your turn!
        </span>
      </div>
    </div>
  );
}
