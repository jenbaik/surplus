import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { findGuestBy } from "@/lib/demoday/airtable";
import { CONTACT_EMAIL, PARKING } from "@/lib/demoday/calendar";
import { PATTERNS } from "@/lib/demoday/fields";
import { loadCohort, type Block, type Cell, type Project } from "@/lib/demoday/cohort";
import { prettyUrl } from "@/lib/founders";
import { Rsvp, type Prefill } from "./rsvp";
import { BUTTON_BASE, MONO_LINK } from "./styles";

// Invite-only: not linked from anywhere, and never indexed (also enforced
// with an X-Robots-Tag header in next.config.ts).
export const metadata: Metadata = {
  title: "Demo Day — Surplus",
  description:
    "The first Surplus cohort presents. Friday, October 23, 2026 at Mox SF, San Francisco. By invitation.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Surplus Demo Day",
    description: "Friday, October 23, 2026 · Mox SF · By invitation.",
    url: "https://surplus.dev/demoday",
    siteName: "Surplus",
    type: "website",
  },
};

const SCHEDULE: { time: string; item: string; note?: string; key?: boolean }[] = [
  { time: "6:00", item: "Doors open" },
  { time: "6:30", item: "Introduction by Austin" },
  { time: "6:35", item: "Founder Pitches", key: true },
  { time: "7:30", item: "Dinner & Mingling" },
];

// ?r=<token> prefills everything (it's their magic link); ?i=<code> only
// name / email / note. A failed lookup is silent — the page renders
// regardless, with an empty form.
async function resolvePrefill(code?: string, token?: string): Promise<Prefill | null> {
  try {
    if (token && PATTERNS.token.test(token)) {
      const g = await findGuestBy("token", token);
      if (g) {
        const { name, email, note, rsvp, diet, anything } = g;
        return { name, email, note, rsvp, diet, anything, token: g.token };
      }
    }
    if (code && PATTERNS.inviteCode.test(code)) {
      const g = await findGuestBy("inviteCode", code);
      if (g) {
        return { name: g.name, email: g.email, note: g.note, rsvp: "", diet: "", anything: "", token: "" };
      }
    }
  } catch (e) {
    console.error("[demoday prefill]", e);
  }
  return null;
}

async function resolveCohort(): Promise<Project[]> {
  try {
    return await loadCohort();
  } catch (e) {
    console.error("[demoday cohort]", e);
    return [];
  }
}

// Shown if the cohort can't be loaded, so the head never reads "0 projects".
const FALLBACK_COUNTS = { projects: 7, founders: 10 };


// -------------------- pieces --------------------

// `*word*` in founder copy renders as italics (their own emphasis).
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function Chip({ tone = "dark", children }: { tone?: "dark" | "pink"; children: React.ReactNode }) {
  return (
    <span
      className={`whitespace-nowrap px-3 py-1.5 font-mono text-sm uppercase tracking-widest text-paper ${
        tone === "pink" ? "bg-ink-pink" : "bg-ink-dark"
      }`}
    >
      {children}
    </span>
  );
}

// Numbered section header: the landing page's, at a smaller size.
function SectionHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-end gap-4 border-b-[3px] border-ink-dark pb-2.5">
      <span className="font-display text-5xl leading-none text-ink-pink misreg-blue max-bp:text-4xl">
        {n}
      </span>
      <h2 className="m-0 font-condensed text-4xl font-bold uppercase leading-none max-bp:text-2xl">
        {children}
      </h2>
    </div>
  );
}

function Stat({ n, label, detail }: { n: string; label: string; detail?: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 border-[3px] border-ink-dark bg-paper px-3.5 py-3">
      <span className="min-w-[2ch] font-display text-[34px] leading-none text-ink-pink">{n}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
          {label}
        </span>
        {detail && (
          <span className="font-mono text-[12px] uppercase leading-[1.15] tracking-widest text-ink-blue">
            {detail}
          </span>
        )}
      </span>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-xs font-bold tracking-widest text-ink-pink">§&nbsp;{label}</span>
      <span className="mt-0.5 block opacity-85">{children}</span>
    </div>
  );
}

function BlockCopy({ b }: { b: Block }) {
  return (
    <div>
      <p className="m-0">
        <Rich text={b.text} />
      </p>
      {b.items && (
        <ul className="m-0 mt-1 list-none p-0 [&_li]:relative [&_li]:py-0.5 [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-xs [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
          {b.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Bios this short show in full; longer ones get the expandable preview.
const SHORT_BIO = 260;
const bioLength = (blocks: Block[]) =>
  blocks.reduce((n, b) => n + b.text.length + (b.items ?? []).join(" ").length, 0);

// The /founders "Full idea" block: a 6-line preview that expands in place.
function Bio({ blocks }: { blocks: Block[] }) {
  return (
    <details className="group mt-2.5 border-t-[1.5px] border-dotted border-ink-dark/40 pt-1.5">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-blue group-hover:text-ink-pink motion-safe:transition-colors motion-safe:duration-150">
          <span
            aria-hidden="true"
            className="inline-block font-display text-xs leading-none group-open:rotate-90 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out"
          >
            ☞
          </span>
          Full bio
        </span>
        <span className="mt-1 line-clamp-6 font-serif text-sm leading-snug group-open:hidden">
          <Rich text={blocks[0]?.text ?? ""} />
        </span>
      </summary>
      <div className="mt-1 flex flex-col gap-2 text-pretty font-serif text-sm leading-snug">
        {blocks.map((b) => (
          <BlockCopy key={b.text} b={b} />
        ))}
      </div>
    </details>
  );
}

function CopyBody({ c }: { c: Cell }) {
  return (
    <>
      {c.tagline && (
        <p className="m-0 mt-2 text-pretty font-serif text-[15px] italic leading-snug text-ink-dark">
          <Rich text={c.tagline} />
        </p>
      )}
      {c.links.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {c.links.map((u) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" className={MONO_LINK}>
              ✦ {prettyUrl(u)}
            </a>
          ))}
        </div>
      )}
      {c.blocks.length > 0 &&
        (bioLength(c.blocks) <= SHORT_BIO ? (
          <div className="mt-2.5 flex flex-col gap-2 border-t-[1.5px] border-dotted border-ink-dark/40 pt-2 text-pretty font-serif text-sm leading-snug">
            {c.blocks.map((b) => (
              <BlockCopy key={b.text} b={b} />
            ))}
          </div>
        ) : (
          <Bio blocks={c.blocks} />
        ))}
    </>
  );
}

// Name + personal site, as on /founders.
function PersonHead({ f }: { f: { name: string; about: string } }) {
  return (
    <>
      <h3 className="m-0 text-balance font-condensed text-[22px] font-bold uppercase leading-[0.95] tracking-wide">
        {f.name}
      </h3>
      {f.about && (
        <a
          href={f.about}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-1.5 self-start ${MONO_LINK}`}
        >
          ☞ {prettyUrl(f.about)}
        </a>
      )}
    </>
  );
}

// The dotted rule + "+" between teammates, from /founders.
function Plus() {
  return (
    <div className="relative flex items-center justify-center px-0.5 max-sm:py-1">
      <span
        aria-hidden="true"
        className="absolute inset-y-4 left-1/2 border-l-[1.5px] border-dotted border-ink-dark/40 max-sm:inset-x-4 max-sm:inset-y-auto max-sm:left-4 max-sm:top-1/2 max-sm:border-l-0 max-sm:border-t-[1.5px]"
      ></span>
      <span className="relative select-none bg-paper py-1 font-display text-2xl leading-none text-ink-blue">
        +
      </span>
    </div>
  );
}

function ProjectCard({ p, i, span }: { p: Project; i: number; span: string }) {
  const team = p.founders.length > 1;
  const shared = team && p.cells.length === 1;
  return (
    <article
      className={`flex flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper ${span} ${
        team ? "max-bp:col-span-12" : "max-bp:col-span-6"
      } max-sm:col-span-12`}
    >
      <div className="px-4 pt-3 font-mono text-[11px] uppercase tracking-widest text-ink-pink">
        No. {String(i + 1).padStart(2, "0")}
      </div>
      {shared ? (
        <>
          {/* One shared section: names side by side, copy underneath. */}
          <div className="flex items-stretch max-sm:flex-col">
            {p.founders.map((f, fi) => (
              <Fragment key={f.name}>
                {fi > 0 && <Plus />}
                <div className="flex min-w-0 flex-1 flex-col px-4 pt-2">
                  <PersonHead f={f} />
                </div>
              </Fragment>
            ))}
          </div>
          <div className="flex min-w-0 flex-col px-4 pb-4">
            <CopyBody c={p.cells[0]} />
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-stretch max-sm:flex-col">
          {p.founders.map((f, fi) => (
            <Fragment key={f.name}>
              {fi > 0 && <Plus />}
              <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-2">
                <PersonHead f={f} />
                {p.cells[fi] && <CopyBody c={p.cells[fi]} />}
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </article>
  );
}

// Literal classes so Tailwind can see them.
const COL_SPAN: Record<number, string> = {
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  8: "col-span-8",
  12: "col-span-12",
};

// 12-column rows: teams take 6, solo founders 4. Columns left over at the
// end of a row go to that row's solo founders (else its teams), so every
// row fills edge to edge and solos sharing a row get equal widths.
function layoutSpans(projects: Project[]): string[] {
  const want = projects.map((p) => (p.founders.length > 1 ? 6 : 4));
  const spans = [...want];
  let start = 0;
  let used = 0;
  const closeRow = (end: number) => {
    const left = 12 - used;
    if (left <= 0) return;
    const row = Array.from({ length: end - start }, (_, k) => start + k);
    const solos = row.filter((k) => want[k] === 4);
    const takers = solos.length ? solos : row;
    const each = Math.floor(left / takers.length);
    takers.forEach((k, n) => (spans[k] += each + (n < left % takers.length ? 1 : 0)));
  };
  want.forEach((w, k) => {
    if (used + w > 12) {
      closeRow(k);
      start = k;
      used = 0;
    }
    used += w;
  });
  closeRow(want.length);
  return spans.map((n) => COL_SPAN[n] ?? "col-span-12");
}

// -------------------- page --------------------

export default async function DemoDayPage({
  searchParams,
}: {
  searchParams: Promise<{ i?: string; r?: string }>;
}) {
  const { i, r } = await searchParams;
  const [projects, prefill] = await Promise.all([resolveCohort(), resolvePrefill(i, r)]);
  const inviteCode = i && PATTERNS.inviteCode.test(i) ? i : "";
  const founderCount = projects.reduce((n, p) => n + p.founders.length, 0);
  const shownProjects = projects.length || FALLBACK_COUNTS.projects;
  const shownFounders = projects.length ? founderCount : FALLBACK_COUNTS.founders;
  const spans = layoutSpans(projects);

  return (
    <>
      {/* =================== HERO =================== */}
      <section className="relative overflow-x-clip pb-4 pt-9 max-bp:pb-3">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div
            className="pointer-events-none absolute right-[-160px] top-[110px] z-0 h-80 w-80 opacity-85 max-bp:hidden"
            aria-hidden="true"
          >
            <svg
              className="absolute -inset-0 h-full w-full text-ink-dark opacity-95 mix-blend-multiply"
              viewBox="0 0 320 320"
            >
              <path
                d="M106 7 H214 V106 H313 V214 H214 V313 H106 V214 H7 V106 H106 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
              />
            </svg>
            <div className="halftone absolute inset-6 opacity-65 mix-blend-multiply [clip-path:polygon(33%_0,67%_0,67%_33%,100%_33%,100%_67%,67%_67%,67%_100%,33%_100%,33%_67%,0_67%,0_33%,33%_33%)]"></div>
          </div>

          <div className="mb-[18px] flex flex-wrap items-center gap-3 max-bp:hidden">
            <Chip>An Invitation</Chip>
            <Chip tone="pink">
              To <b className="font-bold text-ink-dark">Demo Day</b>
            </Chip>
            <span className="font-display text-xl leading-none text-ink-blue">✻</span>
            <Chip>
              For the First <b className="font-bold text-ink-yellow">Surplus Cohort</b>
            </Chip>
          </div>
          <p className="m-0 mb-3 hidden font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-ink-dark max-bp:block">
            An invitation to <b className="font-bold text-ink-pink">Demo Day</b> for the first{" "}
            <b className="font-bold text-ink-blue">Surplus cohort</b>
          </p>

          <h1 className="misreg relative m-0 whitespace-nowrap font-display text-[clamp(76px,16vw,250px)] leading-[0.8] tracking-[-0.045em] text-ink-dark max-bp:text-[clamp(44px,14.5vw,112px)] max-bp:tracking-[-0.055em]">
            DEMO <span className="misreg-accent text-ink-pink">DAY</span>
          </h1>

          <div className="mt-1 flex items-baseline justify-between border-t-[3px] border-ink-dark pt-2.5 font-mono text-sm uppercase tracking-widest max-bp:flex-col max-bp:items-start max-bp:gap-1.5">
            <span>☞&nbsp;&nbsp;Organized by Manifund &amp; Mox</span>
            <span className="max-bp:hidden">Friday, October 23 · 6pm</span>
            <span className="max-bp:hidden">San Francisco</span>
            <span className="max-bp:hidden"></span>
            <span className="max-bp:hidden"></span>
          </div>

          <div className="relative z-[1] mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 max-bp:mt-5 max-bp:gap-x-5">
            <a
              href="#rsvp"
              className={`${BUTTON_BASE} min-w-[300px] px-12 py-3.5 text-4xl leading-none max-bp:min-w-0 max-bp:px-8 max-bp:text-3xl max-sm:w-full`}
            >
              RSVP
            </a>
            <span className="font-condensed text-[clamp(22px,2.6vw,34px)] font-bold uppercase leading-tight tracking-wide">
              <span className="whitespace-nowrap text-ink-pink">Friday, Oct 23</span>
              <span className="px-2 text-ink-blue">·</span>
              <span className="whitespace-nowrap">Doors 6PM</span>
              <span className="px-2 text-ink-blue">·</span>
              <span className="whitespace-nowrap">Mox SF</span>
            </span>
          </div>

          <p className="relative z-[1] m-0 mt-7 max-w-[40ch] font-serif text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.22] text-ink-dark [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark max-bp:max-w-none">
            <em>Surplus</em> is an incubator for software startups to create{" "}
            <mark>massive public good</mark> in the age of transformative AI. Join us to celebrate
            our founders and their progress.
          </p>

          <div className="relative z-[1] mt-7 grid grid-cols-3 gap-4 max-bp:gap-3 max-sm:grid-cols-1">
            <Stat n={String(shownProjects)} label="Projects presenting" detail={`${shownFounders} founders`} />
            <Stat n="8" label="Minutes per pitch" />
            <Stat n="~40" label="Guests" detail="Invite only" />
          </div>

          <div className="relative z-[1] mt-5 grid grid-cols-3 gap-x-8 gap-y-3 border-t-[1.5px] border-dotted border-ink-dark/40 pt-3 font-mono text-xs uppercase leading-normal tracking-widest max-sm:grid-cols-1">
            <Detail label="Where">Mox SF, 4th floor, 1680 Mission St, San Francisco.</Detail>
            <Detail label="Getting there">Nearest BART is 16th St Mission.</Detail>
            <Detail label="Parking">
              <a
                href={PARKING.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-blue underline underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
              >
                {PARKING.name}
              </a>
              , {PARKING.note}.
            </Detail>
          </div>
        </div>
      </section>

      {/* =================== THE EVENING =================== */}
      <section className="pb-4 pt-6 max-bp:pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead n="01">The Evening</SectionHead>
          <ol className="m-0 mt-3 list-none p-0">
            {SCHEDULE.map((row) => (
              <li key={row.time} className="grid grid-cols-[52px_1fr] items-baseline gap-3 py-0.5">
                <span className="font-mono text-sm text-ink-blue">{row.time}</span>
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className={`font-condensed text-lg font-bold uppercase tracking-wide ${
                      row.key ? "text-ink-pink" : ""
                    }`}
                  >
                    {row.item}
                  </span>
                  {row.note && (
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-dark/60">
                      {row.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =================== THE COHORT =================== */}
      <section className="pb-12 pt-8 max-bp:pb-10 max-bp:pt-6">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead n="02">The Cohort</SectionHead>
          <p className="m-0 mt-2 font-mono text-xs uppercase tracking-widest text-ink-dark/70">
            {shownProjects} projects · {shownFounders} founders · in presenting order · full
            profiles at{" "}
            <Link
              href="/founders"
              className="text-ink-blue underline underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
            >
              surplus.dev/founders
            </Link>
          </p>
          {projects.length > 0 && (
            <div className="mt-4 grid grid-cols-12 border-l-[3px] border-t-[3px] border-ink-dark">
              {projects.map((p, idx) => (
                <ProjectCard key={p.founders[0].name} p={p} i={idx} span={spans[idx]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================== RSVP =================== */}
      <section id="rsvp" className="scroll-mt-6 pb-14 pt-2">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead n="03">
            RSVP <span className="text-ink-pink">here</span>
          </SectionHead>
          <div className="mt-4 max-w-[640px]">
            <Rsvp prefill={prefill} inviteCode={inviteCode} />
            <p className="mt-4 border-t-[1.5px] border-dotted border-ink-dark/40 pt-3 font-serif text-base">
              Questions, or need to cancel? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-ink-blue underline underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* =================== COLOPHON =================== */}
      <footer className="bg-ink-dark pb-7 pt-5 font-mono text-[13px] uppercase tracking-[0.14em] text-paper">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-dotted border-paper/40 pt-4 max-bp:flex-col max-bp:items-start max-bp:gap-2">
            <span className="font-display text-lg tracking-[0.06em] text-paper">SURPLUS - 2026</span>
            <span>
              Organized by Austin of <b className="text-ink-yellow">Manifund</b> &amp;{" "}
              <b className="text-ink-yellow">Mox</b>
            </span>
            <Link href="/" className="text-paper underline underline-offset-2 hover:text-ink-yellow">
              ☜ surplus.dev
            </Link>
            <span>
              With <span className="text-ink-pink">love </span>for all
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
