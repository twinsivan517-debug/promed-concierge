import { ANSWERS, type Answer } from "./answers.ts";

export type Reply =
  | { kind: "answer"; answer: Answer }
  | { kind: "choose"; options: Answer[] }
  | { kind: "advice" }
  | { kind: "greeting" }
  | { kind: "unknown" };

const RED_FLAG =
  /\b(pregn\w*|breast ?feed\w*|feeding my baby|side ?effects?|lumps?|droop\w*|sooj\w*|allerg\w*|numb\w*|asymmetr\w*|went wrong|emergency)\b/;

const PERSONAL =
  /\b(i am|i'm|im|i have|i've|ive|i take|i took|i got|i had|my|mera|meri|mere|mujhe|hu|hoon|after (botox|filler|fillers|treatment|injections?)|ke baad)\b/;

const CONDITION =
  /\b(diabet\w*|thyroid|pcod|pcos|epilep\w*|keloid\w*|isotretinoin|accutane|blood ?thinners?|warfarin|aspirin|medicines?|medications?|tablets?|pills?|antibiotics?|condition|disease|infection|acne|pigment\w*|melasma|scars?|rash\w*|pain\w*|swell\w*|swollen|bruis\w*|bleed\w*|headaches?|infected)\b/;

const RECOMMEND = [
  /\b(which|what) (treatment|one|option|procedure)s? (is |are |would be )?(best|right|good|better) for (me|my)\b/,
  /\bshould i (get|do|have|take|try|go for|start)\b/,
  /\bis it (safe|ok|okay) for me\b/,
];

const GREETING = /^(hi|hello|hey|namaste|salam|good (morning|afternoon|evening)|thanks?|thank you)\b/;

function normalise(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, " ").replace(/\s+/g, " ").trim();
}

export function needsDoctor(text: string) {
  return RED_FLAG.test(text) || (PERSONAL.test(text) && CONDITION.test(text)) || RECOMMEND.some((pattern) => pattern.test(text));
}

function hasWord(text: string, word: string) {
  return ` ${text} `.includes(` ${word} `) || ` ${text} `.includes(` ${word}s `);
}

const INTENT = new Set(["price", "results-timing", "consultation", "location", "downtime", "doctor", "natural"]);

function score(text: string, answer: Answer) {
  const points = answer.keywords.reduce((total, word) => (hasWord(text, word) ? total + word.split(" ").length : total), 0);
  return INTENT.has(answer.id) ? points * 2 : points;
}

export function match(input: string): Reply {
  const text = normalise(input);
  if (!text) return { kind: "unknown" };
  if (needsDoctor(text)) return { kind: "advice" };

  const ranked = ANSWERS.map((answer) => ({ answer, points: score(text, answer) }))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points);

  if (ranked.length === 0) return GREETING.test(text) ? { kind: "greeting" } : { kind: "unknown" };
  if (ranked.length > 1 && ranked[1].points === ranked[0].points) {
    return { kind: "choose", options: ranked.filter((entry) => entry.points === ranked[0].points).slice(0, 3).map((entry) => entry.answer) };
  }
  return { kind: "answer", answer: ranked[0].answer };
}
