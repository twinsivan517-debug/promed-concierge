"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import photo from "@/assets/akanksha.webp";
import { ANSWERS, CLINIC, type Answer } from "@/lib/answers";
import { match, type Reply } from "@/lib/match";
import { BASE_PATH } from "@/lib/site";

type Message = { id: number; from: "patient" | "clinic"; text: string; reply?: Reply };

const GREETING_TEXT = `Hello, I'm the ${CLINIC.name} concierge. Ask me about prices, results, the consultation or where we are. I answer only from a fixed list of the clinic's answers, written from its own website and waiting for the doctor's review.`;
const ADVICE_TEXT = `That one needs the doctor to see you in person, so I can't answer it here. A consultation is the right place: book one below, or message the clinic on WhatsApp.`;
const UNKNOWN_TEXT = `I don't have an approved answer for that yet. Try one of these questions, or ask the clinic directly.`;

function whatsappLink(text: string) {
  return CLINIC.whatsapp ? `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}` : null;
}

function replyText(reply: Reply) {
  if (reply.kind === "answer") return reply.answer.answer;
  if (reply.kind === "choose") return "Did you mean one of these?";
  if (reply.kind === "advice") return ADVICE_TEXT;
  if (reply.kind === "greeting") return GREETING_TEXT;
  return UNKNOWN_TEXT;
}

function Clip({ answer }: { answer: Answer }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video.current?.play().catch(() => {});
  }, [answer]);

  if (answer.clip) {
    return (
      <div className="relative">
        <video
          ref={video}
          key={answer.id}
          src={`${BASE_PATH}/${answer.clip}`}
          poster={photo.src}
          controls
          playsInline
          preload="metadata"
          aria-label={`Video answer: ${answer.question}`}
          className="aspect-[4/5] w-full rounded-3xl bg-panel object-cover"
        />
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-panel">
      <Image
        src={photo}
        alt={`${CLINIC.doctor} at ${CLINIC.name}`}
        fill
        sizes="(max-width: 512px) 100vw, 472px"
        loading="eager"
        fetchPriority="high"
        className="object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/30 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-ground/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink">
        Video coming soon
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="flex items-center gap-3 text-sm font-medium text-pink">
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-pink pl-0.5 text-base text-ink">
            ▶
          </span>
          {CLINIC.doctor} answers
        </span>
        <p className="mt-1 text-2xl font-semibold leading-snug text-white">{answer.question}</p>
      </div>
    </div>
  );
}

export function Concierge() {
  const [current, setCurrent] = useState<Answer>(ANSWERS[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "clinic", text: GREETING_TEXT, reply: { kind: "greeting" } },
  ]);
  const [draft, setDraft] = useState("");
  const thread = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const booking = useRef<HTMLDialogElement>(null);
  const chips = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const box = thread.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const row = chips.current;
    const chip = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - row.offsetLeft - 20, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [current]);

  function ask(text: string, reply: Reply = match(text)) {
    setMessages((list) => [
      ...list,
      { id: list.length, from: "patient", text },
      { id: list.length + 1, from: "clinic", text: replyText(reply), reply },
    ]);
    if (reply.kind === "answer") setCurrent(reply.answer);
  }

  function pick(answer: Answer) {
    ask(answer.question, { kind: "answer", answer });
  }

  function watch(answer: Answer) {
    setCurrent(answer);
    player.current?.scrollIntoView({ block: "start" });
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
      <section ref={player} aria-label="Video answers" className="scroll-mt-4">
        <Clip answer={current} />
        <ul ref={chips} className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2" aria-label="Questions patients ask">
          {ANSWERS.map((answer) => (
            <li key={answer.id} className="shrink-0">
              <button
                type="button"
                onClick={() => pick(answer)}
                aria-pressed={answer.id === current.id}
                className="rounded-full border border-pink/30 px-4 py-2 text-sm font-medium text-pink aria-pressed:border-pink-deep aria-pressed:bg-pink-deep aria-pressed:text-ink"
              >
                {answer.short}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Ask the concierge" className="mt-8 rounded-3xl bg-panel p-4">
        <div ref={thread} className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.from === "patient"
                  ? "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-pink px-4 py-3 text-ink"
                  : "max-w-[90%] self-start rounded-2xl rounded-bl-sm bg-ground px-4 py-3 text-white"
              }
            >
              <p className="leading-relaxed">{message.text}</p>
              {message.reply?.kind === "answer" && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => watch(message.reply!.kind === "answer" ? message.reply!.answer : current)}
                    className="rounded-full bg-pink-deep px-3 py-1.5 text-sm font-semibold text-ink"
                  >
                    Watch the answer
                  </button>
                  {message.reply.answer.draft && (
                    <span className="text-xs text-muted">Draft, awaiting the doctor&apos;s approval</span>
                  )}
                </div>
              )}
              {(message.reply?.kind === "choose" || message.reply?.kind === "unknown") && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(message.reply.kind === "choose" ? message.reply.options : ANSWERS.slice(0, 4)).map((answer) => (
                    <button
                      key={answer.id}
                      type="button"
                      onClick={() => pick(answer)}
                      className="rounded-full border border-pink/30 px-3 py-1.5 text-sm font-medium text-pink"
                    >
                      {answer.short}
                    </button>
                  ))}
                </div>
              )}
              {message.reply?.kind === "advice" && (
                <button
                  type="button"
                  onClick={() => booking.current?.showModal()}
                  className="mt-3 rounded-full bg-pink-deep px-3 py-1.5 text-sm font-semibold text-ink"
                >
                  Book a consultation
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-4 flex gap-2">
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
      </section>

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
