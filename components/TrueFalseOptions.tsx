import type { BooleanQuestion, TeamId } from "@/lib/questions";
import { TEAM_IDS, type Answers } from "@/lib/game";
import TeamChip from "./TeamChip";

const CHOICES = [
  { value: true, label: "True", emoji: "👍", base: "bg-mint-soft" },
  { value: false, label: "False", emoji: "👎", base: "bg-berry-soft" },
];

type TrueFalseOptionsProps = {
  question: BooleanQuestion;
  answers: Answers;
  activeTeam: TeamId | null;
  revealed: boolean;
  onAnswer: (value: boolean) => void;
};

export default function TrueFalseOptions({
  question,
  answers,
  activeTeam,
  revealed,
  onAnswer,
}: TrueFalseOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CHOICES.map((choice) => {
        const isCorrect = choice.value === question.answer;
        const chosenBy = revealed
          ? TEAM_IDS.filter((team) => answers[team]?.value === choice.value)
          : [];

        let skin = choice.base;
        if (revealed) {
          if (isCorrect) skin = "bg-mint text-white";
          else if (chosenBy.length > 0) skin = "bg-chili/15";
          else skin = "bg-white opacity-55";
        }

        return (
          <button
            key={choice.label}
            type="button"
            disabled={revealed || activeTeam === null}
            onClick={() => onAnswer(choice.value)}
            className={`squish sticker flex flex-col items-center gap-1 rounded-3xl px-4 py-5 ${skin}`}
          >
            <span className="text-4xl">{choice.emoji}</span>
            <span className="font-display text-2xl font-black">
              {choice.label}
            </span>

            {chosenBy.length > 0 && (
              <span className="mt-1 flex flex-wrap justify-center gap-1.5">
                {chosenBy.map((team) => (
                  <TeamChip key={team} team={team} suffix="said this" />
                ))}
              </span>
            )}

            {revealed && isCorrect && (
              <span className="font-display text-sm font-black uppercase tracking-widest">
                ✅ correct
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
