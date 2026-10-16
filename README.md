# promed-concierge

A one-page demo for Promed Aesthetics, Bangalore: the doctor's short video answers to the
questions patients ask most, a chat that answers only from an approved list, and booking by a
WhatsApp message the patient sends. No server, no stored data, no running cost. Brief:
`web-studio/briefs/promed-concierge.md`.

## Where things are

- `src/lib/answers.ts` — the clinic's details and the ten answers, each with its source page
  and a `draft` flag; `clip` holds a video path once the real clips arrive.
- `src/lib/match.ts` — how a typed question finds its answer, and the medical-advice catch.
- `src/components/Concierge.tsx` — the player, the chat and the booking form.
- `src/lib/match.test.ts` — `npm test`: 53 real questions, medical ones must reach the doctor
  hand-off. Run it after any change to the answers or the matcher.

## Where it is published

A static export (`out/`) under the base path `/promed-concierge`, published to GitHub Pages
by `.github/workflows/pages.yml` on every push to `main`:
https://twinsivan517-debug.github.io/promed-concierge/ . Images are imported from
`src/assets/` so the base path reaches them; a plain `/file` path would miss it.

## The ship gate


`npm install` points git at `.githooks/`. From then on a push to `main` is refused unless
`.ship/stamp.json` names a commit that passed the ship gate, and nothing but `.ship/` changed
after it. `git push --no-verify` skips the check, and a stamp written by hand with a real
commit id passes it; nothing here can stop either. It catches drift, not intent.

Each page sets its own canonical address in its own `metadata` (see `page.tsx`). Set in the
layout it would be inherited, and every page would claim to be the home page.

A new site is made from an export of this repository, not a clone: `.ship/` is left out of
the export, so a new site never starts with this starter's stamp.

## Commands

    npm run dev      work on it
    npm run build    build it
    npm run start    serve the build
