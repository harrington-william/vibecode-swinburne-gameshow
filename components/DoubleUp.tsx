import { TEAMS, type TeamId } from "@/lib/questions";

const SKIN = {
  t1: { button: "bg-berry text-white", card: "bg-berry-soft" },
  t2: { button: "bg-grape text-white", card: "bg-grape-soft" },
} as const;

type DoubleUpButtonProps = {
  team: TeamId;
  /** Points this press adds — the question's value, doubled. */
  bonus: number;
  /** The one-shot has already been spent (by either team). */
  spent: boolean;
  onPress: () => void;
};

/**
 * Round 2 only: the host's one-shot "×2" under a team's score card.
 * Skips the question on screen and hands this team double points for it.
 */
export function DoubleUpButton({
  team,
  bonus,
  spent,
  onPress,
}: DoubleUpButtonProps) {
  return (
    <button
      type="button"
      disabled={spent}
      onClick={onPress}
      title={
        spent
          ? "The ×2 has been used this game"
          : `Skip this question and give ${TEAMS[team].name} double points (+${bonus})`
      }
      className={`squish sticker-sm flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 font-display text-base font-black sm:text-lg ${
        spent ? "bg-white/70 text-ink-soft opacity-60" : `${SKIN[team].button} anim-attention`
      }`}
    >
      <span className={spent ? "" : "anim-heartbeat inline-block"}>✨</span>
      <span>×2</span>
      {!spent && <span className="text-sm font-bold">+{bonus}</span>}
    </button>
  );
}

type DoubleUpDialogProps = {
  team: TeamId;
  bonus: number;
  /** True when the skipped question was Round 2's last one. */
  wasLastQuestion: boolean;
  onSkip: () => void;
  onKeep: () => void;
};

/**
 * Pops straight after a ×2. The question on screen is already skipped;
 * the host picks between jumping to Round 3 or carrying on with Round 2.
 */
export function DoubleUpDialog({
  team,
  bonus,
  wasLastQuestion,
  onSkip,
  onKeep,
}: DoubleUpDialogProps) {
  const { name, emoji } = TEAMS[team];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="double-up-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
    >
      <div
        className={`sticker anim-pop flex w-full max-w-md flex-col items-center gap-4 rounded-[36px] px-6 py-8 text-center sm:px-10 ${SKIN[team].card}`}
      >
        <span className="anim-heartbeat text-6xl">✨</span>
        <h2
          id="double-up-title"
          className="font-display text-2xl font-black leading-tight sm:text-3xl"
        >
          {emoji} {name} doubled up!
        </h2>
        <span className="sticker-sm rounded-full bg-mint px-5 py-1.5 font-display text-xl font-black text-white">
          +{bonus} points 🎉
        </span>

        <p className="font-display text-base font-bold text-ink-soft sm:text-lg">
          This question is skipped. Host, what&apos;s next?
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSkip}
            className="squish sticker flex-1 rounded-full bg-mango px-6 py-3.5 font-display text-lg font-black"
          >
            Skip to Round 3 🚀
          </button>
          <button
            type="button"
            onClick={onKeep}
            autoFocus
            className="squish sticker flex-1 rounded-full bg-white px-6 py-3.5 font-display text-lg font-black"
          >
            {wasLastQuestion ? "Finish Round 2 →" : "Next question →"}
          </button>
        </div>
      </div>
    </div>
  );
}
