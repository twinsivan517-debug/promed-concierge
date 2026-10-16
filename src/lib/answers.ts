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
      "It depends on the treatment and how much is needed. Across the clinic, treatments range from ₹2,000 to ₹50,000. Ask for your own price at the free consultation.",
    keywords: ["price", "prices", "cost", "costs", "how much", "fee", "fees", "charge", "charges", "rate", "rates", "rupees", "rs", "inr", "expensive", "cheap", "afford", "budget", "kitna", "paisa", "kharcha"],
    source: `${SITE} (price range in the site's listing data)`,
    draft: true,
    clip: null,
  },
  {
    id: "botox-duration",
    short: "How long Botox lasts",
    question: "How long does Botox last?",
    answer:
      "Usually three to four months for forehead and crow's feet lines. A lip flip lasts two to three months. When it wears off, your lines return to how they would have looked otherwise.",
    keywords: ["botox", "anti wrinkle", "wrinkle", "forehead", "crow's feet", "crows feet", "lip flip", "wear off", "permanent", "last", "lasting"],
    source: `${SITE}/services/forehead-crowsfeet (FAQ; the same page's card says 4-6 months: the doctor picks one)`,
    draft: true,
    clip: null,
  },
  {
    id: "natural",
    short: "Will it look natural?",
    question: "Will it look natural?",
    answer:
      "The clinic's approach is natural, never frozen: precise micro-dosing so your lines soften while your face still moves and shows expression.",
    keywords: ["natural", "frozen", "fake", "overdone", "obvious", "noticeable", "expression", "expressions", "subtle"],
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
    keywords: ["where", "location", "address", "located", "directions", "map", "parking", "brigade road", "mall", "open", "hours", "timing", "timings", "sunday", "saturday", "kahan"],
    source: `${SITE}/contact`,
    draft: true,
    clip: null,
  },
  {
    id: "consultation",
    short: "The consultation",
    question: "How does a consultation work?",
    answer:
      "The consultation is free. The doctor assesses your face, talks through what you would like, and maps out the treatment with you.",
    keywords: ["consultation", "consult", "first visit", "appointment", "assessment", "free", "what happens"],
    source: `${SITE}/book and ${SITE}/services/forehead-crowsfeet (steps: assessment, mapping)`,
    draft: true,
    clip: null,
  },
  {
    id: "results-timing",
    short: "When will I see results?",
    question: "When will I see the results?",
    answer:
      "Botox starts to work in three to five days, and the full result shows at around two weeks. Lip filler shows straight away; the final look settles once the swelling goes down, in two to three days.",
    keywords: ["see results", "see the results", "result", "kick in", "start working", "how soon", "immediately", "dikhega", "dikhe"],
    source: `${SITE}/services/forehead-crowsfeet and ${SITE}/services/lip-filler (FAQ)`,
    draft: true,
    clip: null,
  },
  {
    id: "downtime",
    short: "Downtime",
    question: "Is there any downtime?",
    answer:
      "For Botox, essentially none: any small marks usually settle within 15 to 30 minutes, so you can go back to your day. After lip filler, mild swelling or bruising can last one to two days.",
    keywords: ["downtime", "down time", "recovery", "back to work", "office", "redness", "marks", "same day", "lunch", "rest"],
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
    keywords: ["filler", "last", "lasting", "lip", "lips", "cheek", "jawline", "chin", "under eye", "hyaluronic"],
    source: `${SITE}/services/lip-filler (FAQ; the services card says 9-12 months: the doctor picks one)`,
    draft: true,
    clip: null,
  },
  {
    id: "doctor",
    short: "Who treats me?",
    question: "Who does the treatment?",
    answer:
      "The clinic is led by Dr. Akanksha, a medical doctor (MBBS) with a Postgraduate Diploma in Aesthetic Medicine and Clinical Cosmetology, and advanced injectables training in London.",
    keywords: ["who", "doctor", "dr", "qualified", "qualification", "qualifications", "experience", "experienced", "certified", "trained", "injector", "mbbs"],
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
    keywords: ["treatment", "service", "offer", "do you do", "laser", "hair removal", "peel", "prp", "microneedling", "skin booster", "facial", "hydrafacial", "hydra facial", "pigmentation", "acne"],
    source: `${SITE}/about and ${SITE}/services`,
    draft: true,
    clip: null,
  },
];
