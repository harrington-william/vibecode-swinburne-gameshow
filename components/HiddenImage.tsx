import Image from "next/image";
import { MYSTERY_DISH } from "@/lib/questions";

type HiddenImageProps = {
  /** How many tiles have been peeled away so far (0-5). */
  revealed: number;
  /** Show the dish name once every tile is gone. */
  showAnswer: boolean;
};

/**
 * Layer 1 — the photo.
 * Layer 2 — one big rectangle in the middle (~80% × 84% of the frame).
 * Layer 3 — four squares in the corners, sitting on top of the middle one.
 *
 * Peeling the four corners (questions 1-4) only exposes a thin border of the
 * photo around the middle tile, so teams can't be sure of the dish until
 * question 5 lifts that last tile too.
 */
const CORNERS = [
  { key: "tl", position: "top-0 left-0", emoji: "🥄" },
  { key: "tr", position: "top-0 right-0", emoji: "🍅" },
  { key: "br", position: "bottom-0 right-0", emoji: "🧀" },
  { key: "bl", position: "bottom-0 left-0", emoji: "🌿" },
] as const;

const TILE_SKIN =
  "flex items-center justify-center border-4 border-ink bg-[linear-gradient(135deg,#5c3a35_0%,#7b4f47_50%,#5c3a35_100%)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]";

function Badge({
  n,
  emoji,
  big = false,
}: {
  n: number;
  emoji: string;
  big?: boolean;
}) {
  return (
    <span className="flex flex-col items-center gap-1 text-white/90">
      <span className={`anim-bounce ${big ? "text-4xl sm:text-6xl" : "text-2xl sm:text-4xl"}`}>
        {emoji}
      </span>
      <span
        className={`font-display font-black drop-shadow ${
          big ? "text-5xl sm:text-7xl" : "text-3xl sm:text-5xl"
        }`}
      >
        {n}
      </span>
    </span>
  );
}

export default function HiddenImage({
  revealed,
  showAnswer,
}: HiddenImageProps) {
  return (
    <figure className="w-full">
      <div className="sticker relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-cream-deep">
        {/* Layer 1 — the mystery dish */}
        <Image
          src={MYSTERY_DISH.src}
          alt={
            showAnswer
              ? `The mystery dish: ${MYSTERY_DISH.name}`
              : "A mystery dish hidden behind five tiles"
          }
          fill
          priority
          sizes="(max-width: 1024px) 92vw, 46vw"
          className="object-cover"
        />

        {/* Layer 2 — the middle square, revealed last */}
        <div
          className={`absolute left-1/2 top-1/2 z-10 h-[84%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-2xl ${TILE_SKIN} ${
            revealed >= 5
              ? "pointer-events-none scale-50 rotate-12 opacity-0"
              : "opacity-100"
          }`}
        >
          <Badge n={5} emoji="⭐" big />
        </div>

        {/* Layer 3 — the four corners, revealed one per question */}
        {CORNERS.map((corner, index) => (
          <div
            key={corner.key}
            className={`absolute z-20 h-[50.5%] w-[50.5%] ${corner.position} ${TILE_SKIN} ${
              revealed > index
                ? "pointer-events-none scale-75 rotate-6 opacity-0"
                : "opacity-100"
            }`}
          >
            <Badge n={index + 1} emoji={corner.emoji} />
          </div>
        ))}
      </div>

      <figcaption className="mt-3 text-center">
        {showAnswer ? (
          <span className="anim-pop font-display text-lg font-black text-mint sm:text-xl">
            It was {MYSTERY_DISH.name}! {MYSTERY_DISH.emoji}
          </span>
        ) : (
          <span className="font-display text-sm font-bold text-ink-soft">
            🔍 {revealed} of 5 tiles lifted — can you guess the dish?
          </span>
        )}
      </figcaption>
    </figure>
  );
}
