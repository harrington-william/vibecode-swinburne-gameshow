/**
 * All 15 questions for the show, transcribed from questions.txt.
 * Round 1: 7 multiple choice (5 pts) · Round 2: 5 true/false (10 pts) · Round 3: 3 fill-in-the-blank (15 pts)
 * Every question gets its own 60-second clock.
 */

export type TeamId = "t1" | "t2";

type QuestionBase = {
  /** Question number as printed in questions.txt */
  id: number;
  flag: string;
  country: string;
  occasion: string;
  prompt: string;
  hint: string;
  explanation: string;
};

export type ChoiceQuestion = QuestionBase & {
  kind: "choice";
  options: string[];
  /** 0 = A, 1 = B, 2 = C, 3 = D */
  answerIndex: number;
};

export type BooleanQuestion = QuestionBase & {
  kind: "boolean";
  answer: boolean;
};

export type BlankQuestion = QuestionBase & {
  kind: "blank";
  /** Canonical spelling shown on the reveal screen */
  answer: string;
  /** Every spelling the auto-checker will accept */
  accept: string[];
};

export type Question = ChoiceQuestion | BooleanQuestion | BlankQuestion;

export type Round = {
  number: 1 | 2 | 3;
  emoji: string;
  title: string;
  tagline: string;
  /** Short "how this round works" lines shown on the round intro card */
  rules: string[];
  pointsPerQuestion: number;
  /** Countdown for each individual question — the game carries on when it hits zero. */
  secondsPerQuestion: number;
  questions: Question[];
};

export const ROUNDS: Round[] = [
  {
    number: 1,
    emoji: "🍜",
    title: "Round 1 · ASEAN Flavours",
    tagline: "Easy · Multiple choice",
    rules: [
      "7 questions from around Southeast Asia",
      "Pick one of four options: A, B, C or D",
      "Both teams answer every question",
    ],
    pointsPerQuestion: 5,
    secondsPerQuestion: 60,
    questions: [
      {
        kind: "choice",
        id: 1,
        flag: "🇻🇳",
        country: "Vietnam",
        occasion: "Tet Holiday",
        prompt:
          "During Tet, the Vietnamese Lunar New Year, families often gather for a special meal. One famous dish is a square sticky rice cake filled with mung beans and pork and wrapped in green leaves. What is this traditional food called?",
        options: ["Pho", "Banh Chung", "Banh Mi", "Goi Cuon"],
        answerIndex: 1,
        hint: "Square shape + sticky rice + Tet = 🇻🇳",
        explanation:
          "Banh Chung is one of the most iconic foods of Vietnamese Tet.",
      },
      {
        kind: "choice",
        id: 2,
        flag: "🇹🇭",
        country: "Thailand",
        occasion: "Songkran",
        prompt:
          "During Songkran, Thailand's famous New Year water festival, people celebrate with family, traditional activities and delicious food. Which sweet dish combines sticky rice, fresh mango and coconut milk?",
        options: ["Tom Yum", "Pad Thai", "Mango Sticky Rice", "Green Curry"],
        answerIndex: 2,
        hint: "Thailand + mango 🥭 + sticky rice.",
        explanation:
          "Mango sticky rice is one of Thailand's most famous traditional desserts.",
      },
      {
        kind: "choice",
        id: 3,
        flag: "🇮🇩",
        country: "Indonesia",
        occasion: "Independence Day",
        prompt:
          "During Independence Day celebrations in Indonesia, people often gather for community events and traditional competitions. A famous celebratory dish consists of yellow rice arranged into a cone or mountain shape. What is it called?",
        options: ["Nasi Goreng", "Nasi Tumpeng", "Satay", "Rendang"],
        answerIndex: 1,
        hint: "Imagine a small yellow rice mountain. ⛰️🍚",
        explanation:
          "Nasi tumpeng is cone-shaped yellow rice often served at important celebrations.",
      },
      {
        kind: "choice",
        id: 4,
        flag: "🇹🇭",
        country: "Thailand",
        occasion: "Social gatherings",
        prompt:
          "Which Thai dish is popular at social gatherings and celebrations?",
        options: ["Pad Thai", "Bánh mì", "Nasi Goreng", "Adobo"],
        answerIndex: 0,
        hint: "This dish comes from Thailand and is made with stir-fried noodles.",
        explanation: "Pad Thai is Thailand's best known stir-fried noodle dish.",
      },
      {
        kind: "choice",
        id: 5,
        flag: "🇻🇳",
        country: "Vietnam",
        occasion: "Everyday favourite",
        prompt:
          "What is the main ingredient used to wrap traditional Vietnamese spring rolls?",
        options: ["Rice paper", "Bread", "Corn", "Potato"],
        answerIndex: 0,
        hint: "This ingredient is thin, round, and commonly used in Vietnamese cuisine.",
        explanation:
          "Vietnamese fresh spring rolls are wrapped in thin, round rice paper.",
      },
      {
        kind: "choice",
        id: 6,
        flag: "🇮🇩",
        country: "Indonesia",
        occasion: "National dish",
        prompt: "Which country is Nasi Goreng traditionally associated with?",
        options: ["Singapore", "Indonesia", "Vietnam", "Cambodia"],
        answerIndex: 1,
        hint: "This country is known for its many islands and is one of the largest countries in Southeast Asia.",
        explanation:
          "Nasi Goreng, Indonesian fried rice, is one of Indonesia's national dishes.",
      },
      {
        kind: "choice",
        id: 7,
        flag: "🇲🇾",
        country: "Malaysia",
        occasion: "Hari Raya",
        prompt:
          "Which food is traditionally associated with Hari Raya celebrations in Malaysia?",
        options: ["Ketupat", "Pho", "Tom Yum", "Bánh Chưng"],
        answerIndex: 0,
        hint: "This traditional food is made from rice and wrapped in woven palm leaves.",
        explanation:
          "Ketupat is rice cooked inside a woven palm leaf pouch, a Hari Raya staple.",
      },
    ],
  },
  {
    number: 2,
    emoji: "🎄",
    title: "Round 2 · A Taste of Europe",
    tagline: "Medium · True or False",
    rules: [
      "5 true-or-false questions from European festivals",
      "Every finished question peels away one tile",
      "Guess the mystery dish hiding underneath!",
    ],
    pointsPerQuestion: 10,
    secondsPerQuestion: 60,
    questions: [
      {
        kind: "boolean",
        id: 8,
        flag: "🇪🇸",
        country: "Spain",
        occasion: "New Year",
        prompt:
          "In Spain, people traditionally eat 12 grapes at midnight on New Year's Eve, with each grape representing one month of the coming year.",
        answer: true,
        hint: "12 months = 12 grapes. 🍇",
        explanation:
          "The tradition is known as the 12 grapes of luck, and people eat one grape with each clock chime at midnight.",
      },
      {
        kind: "boolean",
        id: 9,
        flag: "🇮🇹",
        country: "Italy",
        occasion: "Christmas",
        prompt:
          "In Italy, panettone, a tall sweet bread containing dried and candied fruit, is traditionally associated with Easter celebrations.",
        answer: false,
        hint: "Italy + Christmas + sweet bread. 🎄",
        explanation:
          "Panettone is traditionally associated with Christmas, not Easter. It is one of Italy's most famous Christmas foods.",
      },
      {
        kind: "boolean",
        id: 10,
        flag: "🇫🇷",
        country: "France",
        occasion: "Epiphany",
        prompt:
          "During Epiphany in France, people traditionally eat galette des rois, a pastry that contains a small hidden object. The person who finds it becomes the king or queen of the celebration.",
        answer: true,
        hint: "Hidden object → 👑",
        explanation:
          "The hidden object is called a fève, and finding it is an important part of the tradition.",
      },
      {
        kind: "boolean",
        id: 11,
        flag: "🇩🇪",
        country: "Germany",
        occasion: "Christmas",
        prompt:
          "At German Christmas celebrations, Stollen is a traditional fruit bread containing ingredients such as dried fruit, nuts and spices. It is often covered with powdered sugar.",
        answer: true,
        hint: "Traditional German Christmas bread. 🎄🇩🇪",
        explanation:
          "Stollen is a classic German Christmas food, especially associated with the country's Christmas traditions and markets.",
      },
      {
        kind: "boolean",
        id: 12,
        flag: "🇬🇧",
        country: "United Kingdom",
        occasion: "Christmas",
        prompt:
          "In the United Kingdom, Christmas pudding is traditionally served during Christmas. It is usually a light, creamy dessert similar to custard.",
        answer: false,
        hint: "British Christmas dessert ≠ creamy pudding. 🇬🇧🎄",
        explanation:
          "Christmas pudding is actually a rich steamed dessert, usually containing dried fruit and spices. It is not a light, creamy custard.",
      },
    ],
  },
  {
    number: 3,
    emoji: "🌎",
    title: "Round 3 · The Americas",
    tagline: "Hard · Fill in the blank",
    rules: [
      "3 final questions worth triple points",
      "Type the missing word — spelling is forgiving",
      "Every question comes with a hint 💡",
    ],
    pointsPerQuestion: 15,
    secondsPerQuestion: 60,
    questions: [
      {
        kind: "blank",
        id: 13,
        flag: "🇺🇸",
        country: "USA",
        occasion: "Thanksgiving",
        prompt:
          "On Thanksgiving, Americans often eat __________ with their family. 🦃",
        answer: "Turkey",
        accept: ["turkey", "turkeys", "roast turkey", "a turkey"],
        hint: "A big bird!",
        explanation:
          "Roast turkey is the centrepiece of the traditional American Thanksgiving dinner.",
      },
      {
        kind: "blank",
        id: 14,
        flag: "🇲🇽",
        country: "Mexico",
        occasion: "Día de los Muertos",
        prompt:
          "During the Day of the Dead, Mexican people often eat a traditional sweet bread called __________. 💀🍞",
        answer: "Pan de Muerto",
        accept: ["pan de muerto", "pan de muertos", "pandemuerto", "pan muerto"],
        hint: "Its name means “bread of the dead.”",
        explanation:
          'Pan de muerto means "bread of the dead" and is placed on family altars during the festival.',
      },
      {
        kind: "blank",
        id: 15,
        flag: "🇨🇦",
        country: "Canada",
        occasion: "Thanksgiving",
        prompt:
          "A popular dessert for Thanksgiving in Canada is __________ pie. 🥧",
        answer: "Pumpkin",
        accept: ["pumpkin", "pumpkins", "pumpkin pie"],
        hint: "It is orange and often used for Halloween too! 🎃",
        explanation:
          "Pumpkin pie is a classic Thanksgiving dessert in Canada, served in October when the harvest comes in.",
      },
    ],
  },
];

/** The dish hiding behind the Round 2 tiles. */
export const MYSTERY_DISH = {
  src: "/spaghetti.jpeg",
  name: "Spaghetti",
  emoji: "🍝",
};

export const TEAMS = {
  t1: { name: "Team 1", emoji: "🍜" },
  t2: { name: "Team 2", emoji: "🍰" },
} as const;

export const TOTAL_QUESTIONS = ROUNDS.reduce(
  (sum, round) => sum + round.questions.length,
  0,
);

export const MAX_SCORE = ROUNDS.reduce(
  (sum, round) => sum + round.questions.length * round.pointsPerQuestion,
  0,
);

/** Lowercase, strip accents and punctuation, collapse whitespace. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Forgiving check for the typed answers in Round 3. */
export function isBlankCorrect(question: BlankQuestion, typed: string): boolean {
  const given = normalize(typed);
  if (!given) return false;
  const squashed = given.replace(/ /g, "");
  return question.accept.some((candidate) => {
    const want = normalize(candidate);
    return given === want || squashed === want.replace(/ /g, "");
  });
}

export const OPTION_LETTERS = ["A", "B", "C", "D"] as const;
