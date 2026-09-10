import Link from "next/link";
import { MAX_SCORE, ROUNDS, TOTAL_QUESTIONS } from "@/lib/questions";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Floating snacks in the background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="anim-float absolute left-[8%] top-[14%] text-6xl opacity-25 sm:text-7xl">🍜</span>
        <span className="anim-float absolute right-[10%] top-[18%] text-6xl opacity-25 [animation-delay:1s] sm:text-7xl">🥭</span>
        <span className="anim-float absolute left-[14%] bottom-[16%] text-6xl opacity-25 [animation-delay:2s] sm:text-7xl">🥖</span>
        <span className="anim-float absolute right-[12%] bottom-[20%] text-6xl opacity-25 [animation-delay:2.8s] sm:text-7xl">🌮</span>
        <span className="anim-float absolute left-[46%] top-[5%] text-5xl opacity-20 [animation-delay:1.6s]">🍰</span>
      </div>

      <main className="anim-pop flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="sticker flex w-full flex-col items-center gap-4 rounded-[40px] bg-white px-6 py-10 sm:px-14">
          <span className="anim-wiggle text-7xl sm:text-8xl">🍽️</span>

          <h1 className="font-display text-4xl font-black leading-tight sm:text-6xl">
            World Food
            <br />
            <span className="text-berry">Game Show</span>
          </h1>

          <p className="max-w-md font-display text-base font-bold leading-relaxed text-ink-soft sm:text-lg">
            Two teams. Three rounds. {TOTAL_QUESTIONS} questions about festival
            food from around the world. 🌏
          </p>

          <ul className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {ROUNDS.map((round) => (
              <li
                key={round.number}
                className="sticker-sm rounded-full bg-cream-deep px-4 py-2 font-display text-xs font-bold sm:text-sm"
              >
                {round.emoji} Round {round.number} · {round.pointsPerQuestion}{" "}
                pts each
              </li>
            ))}
          </ul>

          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            {MAX_SCORE} points up for grabs · winner takes the prize 🎁
          </p>
        </div>

        <Link
          href="/game"
          className="squish sticker rounded-full bg-mango px-14 py-6 font-display text-3xl font-black sm:text-4xl"
        >
          Start 🚀
        </Link>
      </main>
    </div>
  );
}
