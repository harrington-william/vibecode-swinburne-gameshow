"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isBlankCorrect,
  ROUNDS,
  TEAMS,
  type TeamId,
} from "@/lib/questions";
import {
  EMPTY_ANSWERS,
  nextTeam,
  TEAM_IDS,
  type Answers,
  type Phase,
} from "@/lib/game";
import BlankInput from "./BlankInput";
import ChoiceOptions from "./ChoiceOptions";
import Finale from "./Finale";
import HiddenImage from "./HiddenImage";
import RoundEnd from "./RoundEnd";
import RoundIntro from "./RoundIntro";
import TeamScore from "./Scoreboard";
import Timer from "./Timer";
import TrueFalseOptions from "./TrueFalseOptions";

type Scores = Record<TeamId, number>;

const ZERO_SCORES: Scores = { t1: 0, t2: 0 };

/** Round 2 is the one with the mystery dish hiding behind the tiles. */
const MYSTERY_ROUND_INDEX = 1;

export default function GameShow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(ZERO_SCORES);
  const [scoresAtRoundStart, setScoresAtRoundStart] =
    useState<Scores>(ZERO_SCORES);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [secondsLeft, setSecondsLeft] = useState(ROUNDS[0].durationSeconds);
  const [hintOpen, setHintOpen] = useState(false);

  const round = ROUNDS[roundIndex];
  const question = round.questions[questionIndex];
  const revealed = phase === "reveal";
  const activeTeam = phase === "question" ? nextTeam(answers) : null;
  const timerRunning = phase === "question" || phase === "reveal";

  // The round clock. It stops at 0:00 but the game deliberately carries on.
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const submit = useCallback(
    (value: number | boolean | string, correct: boolean) => {
      if (phase !== "question") return;
      const team = nextTeam(answers);
      if (!team) return;

      const updated: Answers = { ...answers, [team]: { value, correct } };
      setAnswers(updated);
      if (correct) {
        setScores((current) => ({
          ...current,
          [team]: current[team] + round.pointsPerQuestion,
        }));
      }
      // Once both teams are in, the question is locked and we show the answer.
      if (nextTeam(updated) === null) setPhase("reveal");
    },
    [answers, phase, round.pointsPerQuestion],
  );

  /** Host correction for the typed round — only while the reveal is on screen. */
  const overrideVerdict = useCallback(
    (team: TeamId) => {
      if (phase !== "reveal") return;
      const submission = answers[team];
      if (!submission) return;
      const corrected = !submission.correct;
      setAnswers({ ...answers, [team]: { ...submission, correct: corrected } });
      setScores((current) => ({
        ...current,
        [team]: Math.max(
          0,
          current[team] +
            (corrected ? round.pointsPerQuestion : -round.pointsPerQuestion),
        ),
      }));
    },
    [answers, phase, round.pointsPerQuestion],
  );

  const startRound = () => {
    setScoresAtRoundStart(scores);
    setSecondsLeft(round.durationSeconds);
    setQuestionIndex(0);
    setAnswers(EMPTY_ANSWERS);
    setHintOpen(false);
    setPhase("question");
  };

  const goToNextQuestion = () => {
    if (questionIndex + 1 < round.questions.length) {
      setQuestionIndex(questionIndex + 1);
      setAnswers(EMPTY_ANSWERS);
      setHintOpen(false);
      setPhase("question");
    } else {
      setPhase("round-end");
    }
  };

  const goToNextRound = () => {
    if (roundIndex + 1 < ROUNDS.length) {
      const upcoming = roundIndex + 1;
      setRoundIndex(upcoming);
      setQuestionIndex(0);
      setAnswers(EMPTY_ANSWERS);
      setHintOpen(false);
      setSecondsLeft(ROUNDS[upcoming].durationSeconds);
      setPhase("intro");
    } else {
      setPhase("finished");
    }
  };

  const restart = () => {
    setPhase("intro");
    setRoundIndex(0);
    setQuestionIndex(0);
    setScores(ZERO_SCORES);
    setScoresAtRoundStart(ZERO_SCORES);
    setAnswers(EMPTY_ANSWERS);
    setSecondsLeft(ROUNDS[0].durationSeconds);
    setHintOpen(false);
  };

  // Tiles come off one per finished question, corners first, centre last.
  const tilesRevealed =
    roundIndex !== MYSTERY_ROUND_INDEX
      ? 0
      : phase === "intro"
        ? 0
        : phase === "question"
          ? questionIndex
          : phase === "reveal"
            ? questionIndex + 1
            : round.questions.length;

  const gainedThisRound: Scores = {
    t1: scores.t1 - scoresAtRoundStart.t1,
    t2: scores.t2 - scoresAtRoundStart.t2,
  };

  const showHint = hintOpen || question.kind === "blank";
  const isPlaying = phase === "question" || phase === "reveal";
  const finished = phase === "finished";

  const answerWidget =
    question.kind === "choice" ? (
      <ChoiceOptions
        question={question}
        answers={answers}
        activeTeam={activeTeam}
        revealed={revealed}
        onAnswer={(index) => submit(index, index === question.answerIndex)}
      />
    ) : question.kind === "boolean" ? (
      <TrueFalseOptions
        question={question}
        answers={answers}
        activeTeam={activeTeam}
        revealed={revealed}
        onAnswer={(value) => submit(value, value === question.answer)}
      />
    ) : (
      <BlankInput
        question={question}
        answers={answers}
        activeTeam={activeTeam}
        revealed={revealed}
        onAnswer={(typed) => submit(typed, isBlankCorrect(question, typed))}
        onOverride={overrideVerdict}
      />
    );

  const questionPanel = (
    <div className="flex w-full flex-col gap-4">
      <article className="sticker anim-pop rounded-[32px] bg-white px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker-sm rounded-full bg-cream-deep px-3 py-1 font-display text-xs font-bold sm:text-sm">
            {question.flag} {question.country} · {question.occasion}
          </span>
          <span className="sticker-sm rounded-full bg-mango px-3 py-1 font-display text-xs font-black sm:text-sm">
            {round.pointsPerQuestion} pts
          </span>
        </div>

        <h2 className="mt-4 font-display text-lg font-bold leading-snug sm:text-2xl">
          {question.prompt}
        </h2>

        {showHint ? (
          <p className="sticker-sm anim-slide mt-4 rounded-2xl bg-mango-soft px-4 py-3 font-display text-sm font-bold sm:text-base">
            💡 {question.hint}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setHintOpen(true)}
            className="squish sticker-sm mt-4 rounded-full bg-cream-deep px-4 py-1.5 font-display text-xs font-bold"
          >
            💡 Need a hint?
          </button>
        )}
      </article>

      {!revealed && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TEAM_IDS.map((team) => {
            const done = answers[team] !== null;
            const isActive = team === activeTeam;
            const skin = isActive
              ? `${team === "t1" ? "bg-berry" : "bg-grape"} text-white anim-wiggle`
              : done
                ? "bg-mint-soft"
                : "bg-white opacity-60";
            return (
              <span
                key={team}
                className={`sticker-sm flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-bold sm:text-base ${skin}`}
              >
                <span>{TEAMS[team].emoji}</span>
                <span>{TEAMS[team].name}</span>
                <span>
                  {isActive
                    ? "— your turn!"
                    : done
                      ? "locked in 🔒"
                      : "waiting…"}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {answerWidget}

      {revealed && (
        <div className="sticker anim-slide flex flex-col items-center gap-3 rounded-[32px] bg-cream-deep px-5 py-5">
          {question.kind !== "blank" && (
            <div className="flex flex-wrap justify-center gap-2">
              {TEAM_IDS.map((team) => {
                const correct = answers[team]?.correct ?? false;
                return (
                  <span
                    key={team}
                    className={`sticker-sm rounded-full px-4 py-1.5 font-display text-sm font-black ${
                      correct ? "bg-mint text-white" : "bg-white"
                    }`}
                  >
                    {TEAMS[team].emoji} {TEAMS[team].name}{" "}
                    {correct ? `+${round.pointsPerQuestion} 🎉` : "+0"}
                  </span>
                );
              })}
            </div>
          )}

          <p className="text-center font-display text-sm font-bold leading-relaxed text-ink-soft sm:text-base">
            📖 {question.explanation}
          </p>

          <button
            type="button"
            onClick={goToNextQuestion}
            className="squish sticker rounded-full bg-mango px-8 py-3.5 font-display text-lg font-black"
          >
            {questionIndex + 1 < round.questions.length
              ? "Next question →"
              : "Finish the round →"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Decorative background — purely for the vibes */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden lg:block">
        <span className="anim-float absolute left-[4%] top-[18%] text-6xl opacity-20">🍣</span>
        <span className="anim-float absolute right-[5%] top-[26%] text-6xl opacity-20 [animation-delay:1.2s]">🥐</span>
        <span className="anim-float absolute left-[8%] bottom-[28%] text-6xl opacity-20 [animation-delay:2.4s]">🌮</span>
        <span className="anim-float absolute right-[7%] bottom-[22%] text-6xl opacity-20 [animation-delay:0.6s]">🍩</span>
        <span className="anim-float absolute left-[46%] top-[6%] text-5xl opacity-15 [animation-delay:3s]">🥟</span>
      </div>

      {!finished && (
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b-4 border-ink/10 bg-cream/85 px-3 py-3 backdrop-blur sm:px-6">
          <span className="sticker-sm flex items-center gap-2 rounded-full bg-white px-3 py-2 sm:px-4">
            <span className="text-lg">{round.emoji}</span>
            <span className="font-display text-xs font-black sm:text-base">
              {round.title}
            </span>
          </span>

          {isPlaying && (
            <span className="hidden items-center gap-3 md:flex">
              <span className="flex items-center gap-1.5">
                {round.questions.map((item, index) => (
                  <span
                    key={item.id}
                    className={`h-3 w-3 rounded-full border-2 border-ink ${
                      index < questionIndex
                        ? "bg-ink"
                        : index === questionIndex
                          ? "bg-mango"
                          : "bg-white"
                    }`}
                  />
                ))}
              </span>
              <span className="font-display text-sm font-bold text-ink-soft">
                Question {questionIndex + 1} of {round.questions.length}
              </span>
            </span>
          )}

          <Timer secondsLeft={secondsLeft} running={timerRunning} />
        </header>
      )}

      <main className="flex flex-1 items-center justify-center px-3 pb-44 pt-5 sm:px-6 sm:pb-40">
        {phase === "intro" && <RoundIntro round={round} onStart={startRound} />}

        {isPlaying &&
          (roundIndex === MYSTERY_ROUND_INDEX ? (
            <div className="grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
              <HiddenImage revealed={tilesRevealed} showAnswer={false} />
              {questionPanel}
            </div>
          ) : (
            <div className="w-full max-w-3xl">{questionPanel}</div>
          ))}

        {phase === "round-end" && (
          <RoundEnd
            round={round}
            gained={gainedThisRound}
            totals={scores}
            isLast={roundIndex === ROUNDS.length - 1}
            onNext={goToNextRound}
          >
            {roundIndex === MYSTERY_ROUND_INDEX && (
              <div className="w-full max-w-md">
                <HiddenImage revealed={5} showAnswer />
              </div>
            )}
          </RoundEnd>
        )}

        {finished && <Finale scores={scores} onRestart={restart} />}
      </main>

      {!finished && (
        <>
          <div className="fixed bottom-3 left-3 z-30 sm:bottom-5 sm:left-5">
            <TeamScore
              team="t1"
              score={scores.t1}
              active={activeTeam === "t1"}
              align="left"
            />
          </div>
          <div className="fixed bottom-3 right-3 z-30 sm:bottom-5 sm:right-5">
            <TeamScore
              team="t2"
              score={scores.t2}
              active={activeTeam === "t2"}
              align="right"
            />
          </div>
        </>
      )}
    </div>
  );
}
