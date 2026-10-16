import { ANSWERS, type Answer } from "@/lib/answers";

export type Reply =
  | { kind: "answer"; answer: Answer }
  | { kind: "choose"; options: Answer[] }
  | { kind: "advice" }
  | { kind: "greeting" }
  | { kind: "unknown" };

const ADVICE = [
  /\b(should i|is it (safe|ok|okay) for me|can i (have|get|do) it)\b/,
  /\b(pregnan\w*|breast ?feed\w*|allerg\w*|medicine|medication|tablets?|pills?|antibiotic\w*)\b/,
  /\b(my (skin|face|lips?|condition|doctor|symptoms?)|i have (a|an)?\s*\w*\s*(condition|disease|infection))\b/,
  /\b(side ?effects? (i|i'm|im) (having|getting)|swollen|bruis\w* (won't|wont|not)|went wrong|infection)\b/,
];

const GREETING = /^(hi|hello|hey|salam|good (morning|afternoon|evening)|thanks?|thank you)\b/;

function normalise(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, " ").replace(/\s+/g, " ").trim();
}

function startsWord(text: string, word: string) {
  return ` ${text}`.includes(` ${word}`);
}

function score(text: string, answer: Answer) {
  return answer.keywords.reduce((total, word) => (startsWord(text, word) ? total + word.split(" ").length : total), 0);
}

export function match(input: string): Reply {
  const text = normalise(input);
  if (!text) return { kind: "unknown" };
  if (ADVICE.some((pattern) => pattern.test(text))) return { kind: "advice" };

  const ranked = ANSWERS.map((answer) => ({ answer, points: score(text, answer) }))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points);

  if (ranked.length === 0) return GREETING.test(text) ? { kind: "greeting" } : { kind: "unknown" };
  if (ranked.length > 1 && ranked[1].points === ranked[0].points) {
    return { kind: "choose", options: ranked.filter((entry) => entry.points === ranked[0].points).slice(0, 3).map((entry) => entry.answer) };
  }
  return { kind: "answer", answer: ranked[0].answer };
}
