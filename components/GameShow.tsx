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
import { DoubleUpButton, DoubleUpDialog } from "./DoubleUp";
import Finale from "./Finale";
import HiddenImage from "./HiddenImage";
import RoundEnd from "./RoundEnd";
import RoundIntro from "./RoundIntro";
import TeamScore from "./Scoreboard";
import TeamStatus from "./TeamStatus";
import Timer from "./Timer";
import TrueFalseOptions from "./TrueFalseOptions";
import TurnBoom from "./TurnBoom";

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
  const [secondsLeft, setSecondsLeft] = useState(
    ROUNDS[0].secondsPerQuestion,
  );
  const [hintOpen, setHintOpen] = useState(false);
  /** Which team the "BOOM — your turn!" overlay is cheering for, if any. */
  const [boomTeam, setBoomTeam] = useState<TeamId | null>(null);
  /** Round 2's one-shot ×2: who spent it, and the prompt shown right after. */
  const [doubledBy, setDoubledBy] = useState<TeamId | null>(null);
  const [doublePrompt, setDoublePrompt] = useState<{
    team: TeamId;
    bonus: number;
  } | null>(null);

  const round = ROUNDS[roundIndex];
  const question = round.questions[questionIndex];
  const revealed = phase === "reveal";
  const activeTeam = phase === "question" ? nextTeam(answers) : null;
  // Each question gets its own clock; it freezes once both teams are in,
  // and pauses while the host is deciding on the ×2 prompt.
  const timerRunning = phase === "question" && doublePrompt === null;

  // The question clock. It stops at 0:00 but the game deliberately carries on.
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

      const upNext = nextTeam(updated);
      if (upNext === null) {
        // Both teams are in. Only now do the scores move — and they move
        // together, so a live score bump can't leak the answer to team 2.
        const points = round.pointsPerQuestion;
        setScores((current) => ({
          t1: current.t1 + (updated.t1?.correct ? points : 0),
          t2: current.t2 + (updated.t2?.correct ? points : 0),
        }));
        setPhase("reveal");
      } else {
        // Team 1 just locked in — hand the turn over with a bang.
        setBoomTeam(upNext);
      }
    },
    [answers, phase, round.pointsPerQuestion],
  );

  const dismissBoom = useCallback(() => setBoomTeam(null), []);

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
    setSecondsLeft(round.secondsPerQuestion);
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
      setSecondsLeft(round.secondsPerQuestion);
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
      setSecondsLeft(ROUNDS[upcoming].secondsPerQuestion);
      setPhase("intro");
    } else {
      setPhase("finished");
    }
  };

  /**
   * Round 2 host power: the question on screen is skipped and this team
   * alone banks double its value, on the spot. One use per game. The host
   * then chooses (via the prompt) whether Round 2 carries on or ends here.
   */
  const doubleUp = (team: TeamId) => {
    if (roundIndex !== MYSTERY_ROUND_INDEX || doubledBy !== null) return;
    const bonus = round.pointsPerQuestion * 2;
    setScores((current) => ({ ...current, [team]: current[team] + bonus }));
    setDoubledBy(team);
    setDoublePrompt({ team, bonus });
  };

  /** Host chose to carry on: move past the skipped question. */
  const continueRound = () => {
    setDoublePrompt(null);
    goToNextQuestion();
  };

  /**
   * Host chose to end Round 2 here. We still stop at the round summary —
   * dish reveal, scores and the round's meaning — before Round 3 begins.
   */
  const skipToNextRound = () => {
    setDoublePrompt(null);
    setPhase("round-end");
  };

  const restart = () => {
    setPhase("intro");
    setRoundIndex(0);
    setQuestionIndex(0);
    setScores(ZERO_SCORES);
    setScoresAtRoundStart(ZERO_SCORES);
    setAnswers(EMPTY_ANSWERS);
    setSecondsLeft(ROUNDS[0].secondsPerQuestion);
    setHintOpen(false);
    setBoomTeam(null);
    setDoubledBy(null);
    setDoublePrompt(null);
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
  const showDoubleUp = isPlaying && roundIndex === MYSTERY_ROUND_INDEX;

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

  /** Who's up — one team pinned to each edge, above whatever is on screen. */
  const teamStatusRow = !revealed && (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 px-1">
      {TEAM_IDS.map((team) => (
        <TeamStatus
          key={team}
          team={team}
          active={team === activeTeam}
          done={answers[team] !== null}
        />
      ))}
    </div>
  );

  const questionPanel = (
    <div className="flex w-full flex-col gap-4">
      <article className="sticker anim-pop rounded-[32px] bg-white px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker-sm rounded-full bg-cream-deep px-3 py-1 font-display text-xs font-bold sm:text-sm">
            <span className="anim-bounce inline-block">{question.flag}</span>{" "}
            {question.country} · {question.occasion}
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
            <span className="anim-heartbeat inline-block">💡</span>{" "}
            {question.hint}
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
                    className={`sticker-sm anim-stamp rounded-full px-4 py-1.5 font-display text-sm font-black ${
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
              ? "Next question"
              : "Finish the round"}{" "}
            <span className="anim-bounce inline-block">👉</span>
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
            <span className="anim-bounce text-lg">{round.emoji}</span>
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

      <main
        className={`flex flex-1 items-center justify-center px-3 pt-5 sm:px-6 ${
          showDoubleUp ? "pb-56 sm:pb-52" : "pb-44 sm:pb-40"
        }`}
      >
        {phase === "intro" && <RoundIntro round={round} onStart={startRound} />}

        {isPlaying &&
          (roundIndex === MYSTERY_ROUND_INDEX ? (
            // Status row spans both columns: Team 1 over the image, Team 2 over the question.
            <div className="flex w-full max-w-6xl flex-col gap-4">
              {teamStatusRow}
              <div className="grid w-full items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
                <HiddenImage revealed={tilesRevealed} showAnswer={false} />
                {questionPanel}
              </div>
            </div>
          ) : (
            <div className="flex w-full max-w-3xl flex-col gap-4">
              {teamStatusRow}
              {questionPanel}
            </div>
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

      {boomTeam && <TurnBoom team={boomTeam} onDone={dismissBoom} />}

      {doublePrompt && (
        <DoubleUpDialog
          team={doublePrompt.team}
          bonus={doublePrompt.bonus}
          wasLastQuestion={questionIndex + 1 >= round.questions.length}
          onSkip={skipToNextRound}
          onKeep={continueRound}
        />
      )}

      {!finished && (
        <>
          <div className="fixed bottom-3 left-3 z-30 flex flex-col items-stretch gap-2 sm:bottom-5 sm:left-5">
            <TeamScore
              team="t1"
              score={scores.t1}
              active={activeTeam === "t1"}
              align="left"
            />
            {showDoubleUp && (
              <DoubleUpButton
                team="t1"
                bonus={round.pointsPerQuestion * 2}
                spent={doubledBy !== null}
                onPress={() => doubleUp("t1")}
              />
            )}
          </div>
          <div className="fixed bottom-3 right-3 z-30 flex flex-col items-stretch gap-2 sm:bottom-5 sm:right-5">
            <TeamScore
              team="t2"
              score={scores.t2}
              active={activeTeam === "t2"}
              align="right"
            />
            {showDoubleUp && (
              <DoubleUpButton
                team="t2"
                bonus={round.pointsPerQuestion * 2}
                spent={doubledBy !== null}
                onPress={() => doubleUp("t2")}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
