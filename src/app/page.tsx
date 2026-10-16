import type { Metadata } from "next";
import { Concierge } from "@/components/Concierge";
import { CLINIC } from "@/lib/answers";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const WRAP = "mx-auto w-full max-w-lg px-5";

export default function Home() {
  return (
    <>
      <p className="bg-navy px-5 py-2 text-center text-xs font-medium text-white">
        Demo. Answers are drafts awaiting the doctor&apos;s approval; videos are placeholders.
      </p>

      <header className={`${WRAP} flex items-center justify-between pt-5`}>
        <span className="text-lg font-bold tracking-tight text-navy">
          Promed <span className="text-magenta-ink">Aesthetics</span>
        </span>
        {CLINIC.instagram && (
          <a
            href={`https://www.instagram.com/${CLINIC.instagram}/`}
            target="_blank"
            rel="noopener"
            className="rounded-lg px-2 py-2 text-sm font-medium text-navy underline underline-offset-4"
          >
            Instagram
          </a>
        )}
      </header>

      <main className={`${WRAP} flex-1 pt-6`}>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy">
          Your questions, answered by {CLINIC.doctor}.
        </h1>
        <p className="mt-3 leading-relaxed text-muted">{SITE.description}</p>
        <div className="mt-6">
          <Concierge />
        </div>
      </main>

      <footer className={`${WRAP} py-8 text-sm text-muted`}>
        {CLINIC.address && <p>{CLINIC.address}</p>}
        <p className="mt-2">© {new Date().getFullYear()} {SITE.name}</p>
      </footer>
    </>
  );
}
