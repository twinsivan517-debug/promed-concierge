export type IconName = "rupee" | "clock" | "sparkle" | "pin" | "calendar" | "doctor" | "list" | "shield" | "drop" | "check";

export type Detail = {
  icon: IconName;
  title: string;
  facts: { icon: IconName; text: string }[];
  steps?: { title: string; items: string[] };
  image?: "clinic" | "doctor";
  link?: { label: string; href: string };
};

const BOTOX_STEPS = {
  title: "How the treatment goes",
  items: ["Consultation and facial assessment", "Strategic mapping", "Targeted micro-injections", "Back to your day, in about 15 minutes"],
};

const AFTERCARE = {
  title: "Aftercare",
  items: ["Don't rub or massage the area", "Keep your head upright for a few hours", "No heavy exercise, saunas or alcohol for 24 hours"],
};

export const DETAILS: Record<string, Detail> = {
  price: {
    icon: "rupee",
    title: "What it costs",
    facts: [
      { icon: "rupee", text: "₹2,000 – ₹50,000 across treatments" },
      { icon: "check", text: "Consultation is free" },
    ],
  },
  "botox-duration": {
    icon: "clock",
    title: "Botox, at a glance",
    facts: [
      { icon: "clock", text: "Forehead and crow's feet: 3–4 months" },
      { icon: "clock", text: "Lip flip: 2–3 months" },
      { icon: "calendar", text: "Starts working in 3–5 days" },
    ],
    steps: BOTOX_STEPS,
  },
  natural: {
    icon: "sparkle",
    title: "Natural, never frozen",
    facts: [
      { icon: "sparkle", text: "Precise micro-dosing" },
      { icon: "check", text: "Your face still moves and shows expression" },
    ],
    steps: BOTOX_STEPS,
  },
  location: {
    icon: "pin",
    title: "Visit the clinic",
    facts: [
      { icon: "pin", text: "209, 2nd Floor, Prestige Eva Mall, Brigade Road" },
      { icon: "calendar", text: "Monday – Saturday, 10am – 6pm" },
      { icon: "clock", text: "Closed on Sunday" },
    ],
    image: "clinic",
    link: { label: "Open in Maps", href: "https://www.google.com/maps/place/Promed+Aesthetics/@12.9709072,77.6046734,17z" },
  },
  consultation: {
    icon: "doctor",
    title: "Your free consultation",
    facts: [
      { icon: "check", text: "Free of charge" },
      { icon: "doctor", text: "With the doctor herself" },
    ],
    steps: { title: "What happens", items: ["Consultation and facial assessment", "Strategic mapping"] },
  },
  "results-timing": {
    icon: "calendar",
    title: "When you'll see it",
    facts: [
      { icon: "calendar", text: "Botox: starts in 3–5 days" },
      { icon: "sparkle", text: "Botox: full result at about 2 weeks" },
      { icon: "drop", text: "Lip filler: visible straight away, settles in 2–3 days" },
    ],
  },
  downtime: {
    icon: "clock",
    title: "Downtime",
    facts: [
      { icon: "clock", text: "Botox: small marks settle in 15–30 minutes" },
      { icon: "drop", text: "Lip filler: mild swelling for 1–2 days" },
    ],
    steps: AFTERCARE,
  },
  fillers: {
    icon: "drop",
    title: "Fillers, at a glance",
    facts: [
      { icon: "clock", text: "Lips: 6–12 months" },
      { icon: "sparkle", text: "Visible straight away" },
      { icon: "drop", text: "Mild swelling for 1–2 days" },
    ],
    steps: AFTERCARE,
  },
  doctor: {
    icon: "doctor",
    title: "Your doctor",
    facts: [
      { icon: "check", text: "MBBS, Raja Rajeshwari Medical College" },
      { icon: "check", text: "PG Diploma, Aesthetic Medicine (ILAMED)" },
      { icon: "check", text: "Advanced injectables training, London" },
    ],
    image: "doctor",
  },
  treatments: {
    icon: "list",
    title: "Treatments",
    facts: [
      { icon: "sparkle", text: "Botox and fillers" },
      { icon: "drop", text: "Skin boosters, PRP, microneedling" },
      { icon: "check", text: "Peels, HydraFacial, laser hair reduction" },
    ],
  },
};
