"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DoctorAvatar, type Line } from "@/components/DoctorAvatar";
import { InfoCard } from "@/components/InfoCard";
import { ANSWERS, CLINIC, type Answer } from "@/lib/answers";
import { match, type Reply } from "@/lib/match";

const GREETING_TEXT = "Hi! I'm here to help. Tap a question, or ask me anything about your treatment.";
const ADVICE_TEXT = "That one needs the doctor to see you in person, so I can't answer it here. A free consultation is the right place.";
const UNKNOWN_TEXT = "I don't have an answer for that yet. Try one of these, or ask the clinic directly.";
const CHOOSE_TEXT = "Did you mean one of these?";

const POKES: Line["mood"][] = ["hop", "hop", "hop", "hop", "shake", "shake"];
const POKE_TEXT = [
  "Hi there! 😊 Tap a question and I'll explain.",
  "Yes? I'm listening!",
  "Hehe, that tickles! 😄",
  "Okay, okay… what would you like to know?",
  "Hey! I'm a doctor, not a button! 😤",
  "Fine… I'll just stand here then. 🙄",
];
const SUGGESTIONS = ANSWERS.slice(0, 4);

function whatsappLink(text: string) {
  return CLINIC.whatsapp ? `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}` : null;
}

function replyText(reply: Reply) {
  if (reply.kind === "answer") return reply.answer.answer;
  if (reply.kind === "choose") return CHOOSE_TEXT;
  if (reply.kind === "advice") return ADVICE_TEXT;
  if (reply.kind === "greeting") return GREETING_TEXT;
  return UNKNOWN_TEXT;
}

export function Concierge() {
  const [reply, setReply] = useState<Reply | null>(null);
  const [line, setLine] = useState<Line>({ id: 1, text: GREETING_TEXT });
  const [draft, setDraft] = useState("");
  const booking = useRef<HTMLDialogElement>(null);
  const chips = useRef<HTMLUListElement>(null);
  const pokes = useRef({ count: 0, at: 0 });
  const current = reply?.kind === "answer" ? reply.answer.id : null;

  useEffect(() => {
    const row = chips.current;
    const chip = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - row.offsetLeft - 20, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [current]);

  function say(text: string, mood?: Line["mood"]) {
    setLine((previous) => ({ id: previous.id + 1, text, mood }));
  }

  function ask(text: string, next: Reply = match(text)) {
    setReply(next);
    say(replyText(next));
  }

  function pick(answer: Answer) {
    ask(answer.question, { kind: "answer", answer });
  }

  function poke() {
    const now = Date.now();
    const count = now - pokes.current.at > 8000 ? 0 : Math.min(pokes.current.count + 1, POKE_TEXT.length - 1);
    pokes.current = { count, at: now };
    say(POKE_TEXT[count], POKES[count]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    ask(text);
  }

  const chat = whatsappLink(`Hello ${CLINIC.name}, I have a question.`);

  return (
    <>
      <ul ref={chips} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2" aria-label="Questions patients ask">
        {ANSWERS.map((answer) => (
          <li key={answer.id} className="shrink-0">
            <button
              type="button"
              onClick={() => pick(answer)}
              aria-pressed={answer.id === current}
              className="rounded-full border border-pink/30 px-4 py-2 text-sm font-medium text-pink aria-pressed:border-pink-deep aria-pressed:bg-pink-deep aria-pressed:text-ink"
            >
              {answer.short}
            </button>
          </li>
        ))}
      </ul>

      <section aria-label="Your concierge" className="mt-5">
        <div aria-live="polite" className="mr-6">
          <div key={line.id} className="speech relative rounded-[1.75rem] bg-pink px-5 py-4 text-ink shadow-lg">
            <p className="text-[0.95rem] leading-snug">{line.text}</p>
            <span aria-hidden="true" className="absolute -bottom-3 left-[15%] size-6 rotate-45 rounded-br-md bg-pink" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[38%_1fr] items-start gap-3">
          <div className="sticky top-3">
            <DoctorAvatar line={line} onPoke={poke} />
          </div>
          <div className="min-w-0">
            <InfoCard reply={reply} onPick={pick} onBook={() => booking.current?.showModal()} suggestions={SUGGESTIONS} />
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="mt-6 flex gap-2">
        <label htmlFor="ask" className="sr-only">
          Your question
        </label>
        <input
          id="ask"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question…"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={200}
          className="min-w-0 flex-1 rounded-full border border-navy/20 bg-white px-4 py-3 text-base text-ink"
        />
        <button type="submit" className="rounded-full bg-pink px-5 py-3 text-base font-semibold text-ink">
          Ask
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        The concierge answers only from a fixed list of the clinic&apos;s answers and never gives medical advice. Nothing you type
        here is saved or sent.
      </p>

      <div className="sticky bottom-0 -mx-5 mt-8 flex gap-3 border-t border-pink/15 bg-ground/95 px-5 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => booking.current?.showModal()}
          className="flex-1 rounded-full bg-pink-deep px-4 py-3 text-base font-semibold text-ink"
        >
          Book a consultation
        </button>
        {chat && (
          <a href={chat} target="_blank" rel="noopener" className="rounded-full border-2 border-pink px-4 py-3 text-base font-semibold text-pink">
            WhatsApp
          </a>
        )}
      </div>

      <Booking dialog={booking} />
    </>
  );
}

function Booking({ dialog }: { dialog: React.RefObject<HTMLDialogElement | null> }) {
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name) return setError("Please add your name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Please add a phone number we can call.");
    const link = whatsappLink(`Hello ${CLINIC.name}, I'd like to book a consultation.\nName: ${name}\nPhone: ${phone}`);
    if (!link) return setError("The clinic's WhatsApp number is not set yet in this demo.");
    setError("");
    window.open(link, "_blank", "noopener");
    dialog.current?.close();
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="booking-title"
      className="m-auto w-[min(26rem,calc(100%-2.5rem))] rounded-3xl bg-white p-6 text-ink backdrop:bg-ground/70"
    >
      <h2 id="booking-title" className="text-xl font-semibold text-navy">
        Book a consultation
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        Two details only. This opens WhatsApp with your message written; you press send. Nothing is stored on this
        page.
      </p>
      <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input name="name" autoComplete="name" required className="rounded-xl border border-navy/25 bg-white px-4 py-3 text-base" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Phone
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="rounded-xl border border-navy/25 bg-white px-4 py-3 text-base"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm font-medium text-rose">
            {error}
          </p>
        )}
        <button type="submit" className="rounded-full bg-pink-deep px-4 py-3 text-base font-semibold text-ink">
          Continue on WhatsApp
        </button>
        <button type="button" onClick={() => dialog.current?.close()} className="text-sm font-medium text-navy underline">
          Not now
        </button>
      </form>
    </dialog>
  );
}
