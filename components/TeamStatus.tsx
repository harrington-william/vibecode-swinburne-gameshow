import { TEAMS, type TeamId } from "@/lib/questions";

type TeamStatusProps = {
  team: TeamId;
  /** This team is the one picking right now. */
  active: boolean;
  /** This team has already locked an answer in. */
  done: boolean;
};

const ACTIVE_SKIN = {
  t1: "bg-berry text-white",
  t2: "bg-grape text-white",
} as const;

/**
 * Big "Team 1 — your turn!" pill that sits on the question banner.
 * Active → strong wiggle + glow; done → stamps in as "locked in".
 */
export default function TeamStatus({ team, active, done }: TeamStatusProps) {
  const { name, emoji } = TEAMS[team];

  const skin = active
    ? `${ACTIVE_SKIN[team]} anim-wiggle-strong`
    : done
      ? "bg-mint text-white anim-stamp"
      : "bg-white/80 text-ink-soft";

  return (
    <span
      className={`sticker-sm inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-base font-black sm:gap-3 sm:px-6 sm:py-3 sm:text-xl lg:text-2xl ${skin}`}
    >
      <span className={active ? "anim-heartbeat text-xl sm:text-3xl" : "text-xl sm:text-3xl"}>
        {emoji}
      </span>
      <span>{name}</span>
      <span className="whitespace-nowrap">
        {active ? "— your turn! 👉" : done ? "locked in 🔒" : "waiting…"}
      </span>
    </span>
  );
}
