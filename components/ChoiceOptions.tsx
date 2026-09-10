import {
  OPTION_LETTERS,
  type ChoiceQuestion,
  type TeamId,
} from "@/lib/questions";
import { TEAM_IDS, type Answers } from "@/lib/game";
import TeamChip from "./TeamChip";

const OPTION_SKINS = [
  "bg-berry-soft",
  "bg-mango-soft",
  "bg-mint-soft",
  "bg-grape-soft",
];

type ChoiceOptionsProps = {
  question: ChoiceQuestion;
  answers: Answers;
  activeTeam: TeamId | null;
  revealed: boolean;
  onAnswer: (optionIndex: number) => void;
};

export default function ChoiceOptions({
  question,
  answers,
  activeTeam,
  revealed,
  onAnswer,
}: ChoiceOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.options.map((option, index) => {
        const isCorrect = index === question.answerIndex;
        const chosenBy = revealed
          ? TEAM_IDS.filter((team) => answers[team]?.value === index)
          : [];

        let skin = OPTION_SKINS[index];
        if (revealed) {
          if (isCorrect) skin = "bg-mint text-white";
          else if (chosenBy.length > 0) skin = "bg-chili/15";
          else skin = "bg-white opacity-55";
        }

        return (
          <button
            key={option}
            type="button"
            disabled={revealed || activeTeam === null}
            onClick={() => onAnswer(index)}
            className={`squish sticker flex items-start gap-3 rounded-3xl px-4 py-4 text-left ${skin}`}
          >
            <span className="sticker-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg font-black text-ink">
              {OPTION_LETTERS[index]}
            </span>

            <span className="flex flex-1 flex-col gap-2">
              <span className="font-display text-lg font-bold leading-snug sm:text-xl">
                {option}
              </span>
              {chosenBy.length > 0 && (
                <span className="flex flex-wrap gap-1.5">
                  {chosenBy.map((team) => (
                    <TeamChip key={team} team={team} suffix="picked this" />
                  ))}
                </span>
              )}
            </span>

            {revealed && (
              <span className="font-display text-2xl">
                {isCorrect ? "✅" : chosenBy.length > 0 ? "❌" : ""}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
