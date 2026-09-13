type TimerProps = {
  secondsLeft: number;
  running: boolean;
};

function format(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer({ secondsLeft, running }: TimerProps) {
  const expired = secondsLeft <= 0;
  // Last quarter of the 60-second question clock.
  const hurrying = !expired && secondsLeft <= 15;

  return (
    <div
      className={`sticker-sm flex items-center gap-2 rounded-full px-4 py-2 ${
        expired ? "bg-chili text-white" : hurrying ? "bg-mango" : "bg-white"
      }`}
      aria-live="off"
    >
      <span
        className={`text-lg ${
          expired
            ? "anim-spin-wobble"
            : running && hurrying
              ? "anim-flash"
              : running
                ? "anim-spin-wobble"
                : ""
        }`}
      >
        {expired ? "⌛" : "⏱️"}
      </span>
      <span className="font-display text-2xl font-bold tabular-nums">
        {format(secondsLeft)}
      </span>
      {expired && (
        <span className="anim-flash font-display text-xs font-bold uppercase tracking-wide">
          Time&apos;s up — keep going!
        </span>
      )}
    </div>
  );
}
