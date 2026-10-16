export type Answer = {
  id: string;
  short: string;
  question: string;
  answer: string;
  keywords: string[];
  source: string;
  draft: boolean;
  clip: string | null;
};

export const CLINIC = {
  name: "Promed Aesthetics",
  doctor: "Dr. Akanksha",
  whatsapp: "918088729557",
  instagram: "promedaestheticsclinic",
  address: "209, 2nd Floor, Prestige Eva Mall, Brigade Road, Bangalore 560001",
};

const SITE = "https://promedaesthetics.in";

export const ANSWERS: Answer[] = [
  {
    id: "price",
    short: "Price",
    question: "How much does it cost?",
    answer:
      "It depends on the treatment and how much is needed. Across the clinic, treatments range from ₹2,000 to ₹50,000. You get your exact price at the free consultation, before anything is done.",
    keywords: ["price", "cost", "how much", "fee", "fees", "charge", "rate", "rupee", "rs", "inr", "expensive", "cheap", "afford", "budget"],
    source: `${SITE} (price range in the site's listing data)`,
    draft: true,
    clip: null,
  },
  {
    id: "botox-duration",
    short: "How long Botox lasts",
    question: "How long does Botox last?",
    answer:
      "Usually three to four months for forehead and crow's feet lines. A lip flip lasts two to three months. When it wears off, your face simply returns to how it was before.",
    keywords: ["botox", "anti wrinkle", "wrinkle", "forehead", "crow", "lip flip", "wear off", "permanent", "last"],
    source: `${SITE}/services/forehead-crowsfeet (FAQ; the same page's card says 4-6 months)`,
    draft: true,
    clip: null,
  },
  {
    id: "natural",
    short: "Will it look natural?",
    question: "Will it look natural?",
    answer:
      "That is the clinic's whole approach: natural, never frozen. Very precise micro-dosing softens the lines while your face still moves and shows expression.",
    keywords: ["natural", "frozen", "fake", "overdone", "obvious", "notice", "expression", "look like", "subtle"],
    source: `${SITE}/services/forehead-crowsfeet`,
    draft: true,
    clip: null,
  },
  {
    id: "location",
    short: "Where are you?",
    question: "Where is the clinic, and when are you open?",
    answer:
      "209, 2nd Floor, Prestige Eva Mall, Brigade Road, Bangalore 560001. Monday to Saturday, 10 am to 6 pm. Closed on Sunday.",
    keywords: ["where", "location", "address", "located", "directions", "map", "parking", "brigade", "mall", "open", "hours", "timing", "timings", "sunday", "saturday"],
    source: `${SITE}/contact`,
    draft: true,
    clip: null,
  },
  {
    id: "consultation",
    short: "The consultation",
    question: "How does a consultation work?",
    answer:
      "The consultation is free. The doctor looks at your face, listens to what you want, and maps out a plan with the price. You decide afterwards; nothing is done unless you say yes.",
    keywords: ["consultation", "consult", "first visit", "appointment", "assessment", "free", "meet", "what happens"],
    source: `${SITE}/book and ${SITE}/services/forehead-crowsfeet (steps: assessment, mapping)`,
    draft: true,
    clip: null,
  },
  {
    id: "results-timing",
    short: "When will I see results?",
    question: "When will I see the results?",
    answer: "Botox starts to work in three to five days. The full result shows at around two weeks.",
    keywords: ["see results", "results", "kick in", "start working", "how soon", "days", "weeks", "immediately"],
    source: `${SITE}/services/forehead-crowsfeet`,
    draft: true,
    clip: null,
  },
  {
    id: "downtime",
    short: "Downtime",
    question: "Is there any downtime?",
    answer:
      "For Botox, essentially none: any small marks usually settle within 15 to 30 minutes, so you can go back to your day. After lip filler, mild swelling or bruising can last one to two days.",
    keywords: ["downtime", "recovery", "back to work", "swelling", "bruise", "bruising", "redness", "marks", "same day", "lunch"],
    source: `${SITE}/services/forehead-crowsfeet and ${SITE}/services/lip-filler`,
    draft: true,
    clip: null,
  },
  {
    id: "fillers",
    short: "How long fillers last",
    question: "How long do fillers last?",
    answer:
      "Lip filler typically lasts six to twelve months. Fillers in other areas, like cheeks or jawline, usually last longer; the doctor tells you what to expect for your area at the consultation.",
    keywords: ["filler", "last", "lip", "lips", "cheek", "jawline", "chin", "under eye", "hyaluronic"],
    source: `${SITE}/services/lip-filler (FAQ)`,
    draft: true,
    clip: null,
  },
  {
    id: "doctor",
    short: "Who treats me?",
    question: "Who does the treatment?",
    answer:
      "The clinic is led by Dr. Akanksha, a medical doctor (MBBS) with a Postgraduate Diploma in Aesthetic Medicine and Clinical Cosmetology, and advanced injectables training in London.",
    keywords: ["who", "doctor", "qualified", "qualification", "experience", "certified", "trained", "dr", "injector", "safe"],
    source: `${SITE}/about`,
    draft: true,
    clip: null,
  },
  {
    id: "treatments",
    short: "What do you offer?",
    question: "Which treatments do you offer?",
    answer:
      "Anti-wrinkle injections (Botox), fillers for lips, cheeks, jawline and under-eyes, skin boosters, PRP, microneedling, chemical peels, Hydra Facial and laser hair reduction.",
    keywords: ["treatments", "services", "offer", "do you do", "laser", "peel", "prp", "microneedling", "skin booster", "facial", "hydra", "pigmentation", "acne"],
    source: `${SITE}/about and ${SITE}/services`,
    draft: true,
    clip: null,
  },
];
