import Image from "next/image";
import clinic from "@/assets/clinic.webp";
import photo from "@/assets/akanksha.webp";
import { Icon } from "@/components/Icon";
import type { Answer } from "@/lib/answers";
import { DETAILS } from "@/lib/details";
import type { Reply } from "@/lib/match";

type Props = {
  reply: Reply | null;
  onPick: (answer: Answer) => void;
  onBook: () => void;
  suggestions: Answer[];
};

const CARD = "rounded-3xl bg-panel p-4 text-white";

function Chips({ answers, onPick }: { answers: Answer[]; onPick: (answer: Answer) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {answers.map((answer) => (
        <button
          key={answer.id}
          type="button"
          onClick={() => onPick(answer)}
          className="rounded-full border border-pink/30 px-3 py-1.5 text-sm font-medium text-pink"
        >
          {answer.short}
        </button>
      ))}
    </div>
  );
}

export function InfoCard({ reply, onPick, onBook, suggestions }: Props) {
  if (!reply || reply.kind === "greeting") {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-pink">Promed Aesthetics, Bangalore</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex gap-2"><Icon name="check" className="size-5 shrink-0 text-pink" />Free consultation</li>
          <li className="flex gap-2"><Icon name="calendar" className="size-5 shrink-0 text-pink" />Mon – Sat, 10am – 6pm</li>
          <li className="flex gap-2"><Icon name="pin" className="size-5 shrink-0 text-pink" />Brigade Road</li>
        </ul>
        <Chips answers={suggestions} onPick={onPick} />
      </div>
    );
  }

  if (reply.kind === "advice") {
    return (
      <div className={CARD}>
        <p className="flex items-center gap-2 font-semibold text-pink"><Icon name="shield" />Needs the doctor in person</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Questions about your own health, medicines or a reaction are answered at a consultation, never here.
        </p>
        <button type="button" onClick={onBook} className="mt-3 rounded-full bg-pink-deep px-4 py-2 text-sm font-semibold text-ink">
          Book a consultation
        </button>
      </div>
    );
  }

  if (reply.kind === "choose" || reply.kind === "unknown") {
    return (
      <div className={CARD}>
        <p className="font-semibold text-pink">{reply.kind === "choose" ? "Did you mean" : "Try one of these"}</p>
        <Chips answers={reply.kind === "choose" ? reply.options : suggestions} onPick={onPick} />
      </div>
    );
  }

  const detail = DETAILS[reply.answer.id];
  if (!detail) return null;
  return (
    <div className={CARD}>
      {detail.image && (
        <Image
          src={detail.image === "clinic" ? clinic : photo}
          alt={detail.image === "clinic" ? "Inside the Promed Aesthetics clinic" : "Dr. Akanksha"}
          sizes="(max-width: 512px) 60vw, 300px"
          className={`mb-3 w-full rounded-2xl object-cover ${detail.image === "doctor" ? "aspect-square object-top" : "aspect-[3/2]"}`}
        />
      )}
      <p className="flex items-center gap-2 font-semibold text-pink">
        <Icon name={detail.icon} />
        {detail.title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-snug">
        {detail.facts.map((fact) => (
          <li key={fact.text} className="flex gap-2">
            <Icon name={fact.icon} className="size-5 shrink-0 text-pink-deep" />
            {fact.text}
          </li>
        ))}
      </ul>
      {detail.steps && (
        <>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-pink">{detail.steps.title}</p>
          <ol className="mt-2 space-y-2 text-sm leading-snug">
            {detail.steps.items.map((item, index) => (
              <li key={item} className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pink text-xs font-bold text-ink">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </>
      )}
      {detail.link && (
        <a href={detail.link.href} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-semibold text-pink underline">
          {detail.link.label}
        </a>
      )}
      <p className="mt-4 text-xs text-muted">Draft from promedaesthetics.in, awaiting the doctor&apos;s approval</p>
    </div>
  );
}
