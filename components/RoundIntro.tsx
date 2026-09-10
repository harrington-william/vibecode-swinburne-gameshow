import type { Round } from "@/lib/questions";

type RoundIntroProps = {
  round: Round;
  onStart: () => void;
};

export default function RoundIntro({ round, onStart }: RoundIntroProps) {
  return (
    <div className="anim-pop flex w-full max-w-2xl flex-col items-center gap-6 text-center">
      <div className="sticker flex w-full flex-col items-center gap-4 rounded-[36px] bg-white px-6 py-9 sm:px-12">
        <span className="anim-float text-6xl sm:text-7xl">{round.emoji}</span>

        <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">
          {round.title}
        </h1>

        <span className="sticker-sm rounded-full bg-mango-soft px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest">
          {round.tagline}
        </span>

        <ul className="mt-2 flex flex-col gap-2 text-left">
          {round.rules.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-2 font-display text-base font-bold text-ink-soft sm:text-lg"
            >
              <span aria-hidden>🍬</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <div className="sticker-sm mt-2 rounded-full bg-mint-soft px-5 py-2 font-display text-lg font-black">
          {round.pointsPerQuestion} points per correct answer
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="squish sticker rounded-full bg-mango px-10 py-5 font-display text-2xl font-black"
      >
        Start Round {round.number} 🚀
      </button>
    </div>
  );
}
