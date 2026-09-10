import { TEAMS, type TeamId } from "@/lib/questions";

const SKIN = {
  t1: "bg-berry text-white",
  t2: "bg-grape text-white",
} as const;

export default function TeamChip({
  team,
  suffix,
  size = "sm",
}: {
  team: TeamId;
  suffix?: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={`sticker-sm inline-flex items-center gap-1.5 rounded-full font-display font-bold ${SKIN[team]} ${
        size === "lg" ? "px-4 py-1.5 text-base" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span>{TEAMS[team].emoji}</span>
      <span>{TEAMS[team].name}</span>
      {suffix && <span className="font-black">{suffix}</span>}
    </span>
  );
}
