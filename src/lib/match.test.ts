import { match } from "./match.ts";
const want: [string, string][] = [
  ["I am 3 months pregnant, can I do botox?", "advice"], ["Is botox safe for me, I have thyroid", "advice"],
  ["I'm diabetic, will fillers work for me?", "advice"], ["my lips are swollen since 3 days after filler, is this normal?", "advice"],
  ["I got filler last week and there is a hard lump", "advice"], ["I am on blood thinners, can I take botox", "advice"],
  ["can I get botox if I am feeding my baby", "advice"], ["mujhe PCOD hai, botox kar sakte hai kya?", "advice"],
  ["mera chehra sooj gaya filler ke baad", "advice"], ["I have acne on my cheeks, which treatment will suit me?", "advice"],
  ["doctor my eyelid is drooping after botox what to do", "advice"], ["Is it safe during pregnancy?", "advice"],
  ["I have keloid tendency, can i do microneedling", "advice"], ["pregnent hu, botox kar sakti hu?", "advice"],
  ["my face got bruised and its not going after 1 week", "advice"], ["which treatment is best for my pigmentation", "advice"],
  ["I take isotretinoin, can I do peel", "advice"], ["I have epilepsy, botox ok?", "advice"],
  ["Botox se koi side effect hoga kya?", "advice"], ["should i get fillers for my lips", "advice"],
  ["How much is my lips filler?", "price"], ["Can I get it done on Sunday?", "location"], ["Should I book online or WhatsApp?", "!advice"],
  ["What are your timings for my skin consultation", "!advice"], ["Is botox safe?", "!advice"], ["lip filler results kab dikhega", "results-timing"],
  ["When will I see results from lip filler?", "results-timing"], ["kitna paisa lagega", "price"], ["botox ka rate kya hai", "price"],
  ["How many years experience does doctor have", "doctor"], ["Hi, address please", "location"], ["Do you do HydraFacial on weekends?", "treatments"],
  ["How much is botox?", "price"], ["what's the price", "price"], ["how long does botox last", "botox-duration"],
  ["how long do fillers last", "fillers"], ["how long does it last", "choose"], ["will I look frozen", "natural"],
  ["where are you located", "location"], ["are you open on sunday", "location"], ["how does the consultation work", "consultation"],
  ["is it free", "consultation"], ["when will i see results", "results-timing"], ["can I go back to work", "downtime"],
  ["who does the injections", "doctor"], ["do you do laser hair removal", "treatments"], ["hi", "greeting"],
  ["do you sell cars", "unknown"], ["what is your address", "location"], ["what are your rates in rs", "price"],
  ["can I drink after", "!doctor"], ["is the whole thing painful", "!doctor"], ["which lipstick after", "!fillers"],
];
let fail = 0;
for (const [q, w] of want) {
  const r = match(q);
  const got = r.kind === "answer" ? r.answer.id : r.kind === "choose" ? "choose:" + r.options.map((o) => o.id).join(",") : r.kind;
  const ok = w.startsWith("!") ? !got.startsWith(w.slice(1)) : got.startsWith(w);
  if (!ok) fail++;
  if (!ok) console.log("FAIL", q, "->", got);
}
console.log("cases", want.length, "failures", fail);
if (fail) process.exit(1);
