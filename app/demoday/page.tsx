import type { Metadata } from "next";
import Link from "next/link";
import { findGuestBy } from "@/lib/demoday/airtable";
import { CONTACT_EMAIL, PARKING } from "@/lib/demoday/calendar";
import { PATTERNS } from "@/lib/demoday/fields";
import { loadCohort, type Block, type Project } from "@/lib/demoday/cohort";
import { prettyUrl } from "@/lib/founders";
import { Rsvp, type Prefill } from "./rsvp";
import { MONO_LINK } from "./styles";

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
  { time: "4:00", item: "Doors open" },
  { time: "4:30", item: "Introduction by Austin" },
  { time: "4:40", item: "Pitch Block 1", key: true },
  { time: "5:05", item: "Break", note: "15 min" },
  { time: "5:25", item: "Pitch Block 2", key: true },
  { time: "5:50", item: "Close" },
  { time: "6:00", item: "Dinner" },
  { time: "7:00", item: "Continued mingling & happy hour" },
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

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const inWords = (n: number) => WORDS[n] ?? String(n);

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

// Numbered section header, as on the landing page.
function SectionHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] max-bp:gap-4 max-bp:pb-3.5">
      <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">
        {n}
      </span>
      <h2 className="m-0 font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function StatRow({ n, label, detail }: { n: string; label: string; detail: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
      <span className="font-display text-[26px] leading-none text-ink-pink">{n}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
          {label}
        </span>
        <span className="font-mono text-[13px] uppercase leading-[1.15] tracking-widest text-ink-blue">
          {detail}
        </span>
      </span>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;{label}</span>
      <span className="mt-1 block opacity-85">{children}</span>
    </div>
  );
}

function BlockCopy({ b }: { b: Block }) {
  return (
    <div>
      <p className="m-0 text-pretty font-serif text-[15px] leading-snug">
        <Rich text={b.text} />
      </p>
      {b.items && (
        <ul className="m-0 mt-1 list-none p-0 font-serif text-[15px] leading-snug [&_li]:relative [&_li]:py-0.5 [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
          {b.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <article className="relative flex min-w-0 flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-6 pt-6 max-sm:px-5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-3.5 h-[50px] w-[50px] rounded-full bg-ink-yellow opacity-70 mix-blend-multiply"
      ></span>
      <div className="relative z-[1] mb-3 flex items-start gap-4">
        <span className="shrink-0 font-display text-6xl leading-none text-ink-pink misreg-blue max-bp:text-5xl">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="m-0 mt-1 text-balance font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
          {p.founders.map((f, fi) => (
            <span key={f.name}>
              {fi > 0 && <span className="px-1 font-display text-ink-blue">+</span>}
              {f.name}
            </span>
          ))}
        </h3>
      </div>
      {p.tagline && (
        <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-sm uppercase tracking-widest text-ink-blue">
          <Rich text={p.tagline} />
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {p.blocks.map((b) => (
          <BlockCopy key={b.text} b={b} />
        ))}
      </div>
      {p.links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-0.5 pt-3">
          {p.links.map((u) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" className={MONO_LINK}>
              ✦ {prettyUrl(u)}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

// Fills the last row of the 3-column cohort grid (span 1, 2 or a full row).
const FILLER_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
};

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
  const fillerSpan = (3 - (projects.length % 3)) % 3 || 3;

  return (
    <>
      {/* =================== HERO =================== */}
      <section className="relative overflow-x-clip pb-14 pt-9 max-bp:pb-10">
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
            <span className="max-bp:hidden">Friday, October 23 · 4 to 9pm</span>
            <span className="max-bp:hidden">San Francisco</span>
            <span className="max-bp:hidden"></span>
            <span className="max-bp:hidden"></span>
          </div>

          {/* Desktop: statement + details on the left, stats + RSVP badge on
              the right. Phones: statement, then stats + badge, then details. */}
          <div className="relative z-[1] mt-6 grid grid-cols-[1.35fr_1fr] items-start gap-x-10 gap-y-6 max-bp:mt-7 max-bp:grid-cols-1 max-bp:gap-7">
            <div className="col-start-1 row-start-1 max-bp:col-auto max-bp:row-auto">
              <p className="m-0 max-w-[30ch] font-serif text-[clamp(24px,2.6vw,34px)] font-medium leading-[1.2] text-ink-dark [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark max-bp:max-w-none">
                {inWords(shownProjects)} projects, <em>ten weeks</em>, and{" "}
                <mark>six minutes each</mark> to show you what they built.
              </p>

              <p className="m-0 mt-6 font-condensed text-[clamp(22px,2.6vw,34px)] font-bold uppercase leading-tight tracking-wide">
                <span className="whitespace-nowrap text-ink-pink">Friday, Oct 23</span>
                <span className="px-2 text-ink-blue">·</span>
                <span className="whitespace-nowrap">Doors 4PM</span>
                <span className="px-2 text-ink-blue">·</span>
                <span className="whitespace-nowrap">Mox SF</span>
              </p>
            </div>

            <div className="col-start-1 row-start-2 grid grid-cols-2 gap-x-8 gap-y-4 self-start border-t-[1.5px] border-dotted border-ink-dark/40 pt-4 font-mono text-sm uppercase leading-normal tracking-widest max-bp:order-last max-bp:col-auto max-bp:row-auto max-sm:grid-cols-1">
                <Detail label="Where">Mox SF, 1680 Mission St, San Francisco.</Detail>
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
                <Detail label="Who">~40 guests, invite only.</Detail>
            </div>

            <aside className="relative col-start-2 row-span-2 row-start-1 flex flex-col items-stretch gap-5 max-bp:col-auto max-bp:row-auto max-bp:row-span-1">
              <div className="border-[3px] border-ink-dark bg-paper">
                <StatRow n={String(shownProjects)} label="Projects presenting" detail={`${shownFounders} founders`} />
                <StatRow n="6" label="Minutes per pitch" detail="Two pitch blocks" />
                <StatRow n="~40" label="Guests" detail="Invite only" />
              </div>

              <div className="flex justify-end pt-2 max-bp:justify-center">
                <a
                  href="#rsvp"
                  aria-label="RSVP"
                  className="relative inline-block h-[230px] w-[230px] -rotate-6 cursor-pointer no-underline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink-blue motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-rotate-3 motion-safe:hover:scale-105 max-bp:h-[190px] max-bp:w-[190px]"
                >
                  <span className="absolute inset-0 z-[-1] translate-x-2 translate-y-2 rounded-full bg-ink-blue opacity-90 mix-blend-multiply"></span>
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-ink-pink text-center text-paper shadow-[inset_0_0_0_4px_var(--color-paper),inset_0_0_0_6px_var(--color-ink-pink)]">
                    <span className="flex flex-col items-center gap-1.5">
                      <span className="font-display text-5xl leading-none tracking-wide max-bp:text-4xl">RSVP</span>
                      <span className="font-mono text-sm uppercase tracking-widest">Fri, Oct 23</span>
                      <span className="mt-0.5 font-display text-xl tracking-wider">☞ ☞ ☞</span>
                    </span>
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =================== BANNER =================== */}
      <div className="border-y-[3px] border-t-8 border-ink-dark bg-ink-dark px-10 py-4 text-center font-condensed text-[clamp(18px,2.2vw,26px)] font-bold uppercase leading-tight tracking-wider text-paper max-bp:px-5 max-bp:py-3.5 max-bp:text-sm">
        ✦&nbsp;&nbsp;Pitches · Dinner · Happy hour ·{" "}
        <em className="not-italic text-ink-yellow">The first Surplus cohort</em>&nbsp;&nbsp;✦
      </div>

      {/* =================== THE EVENING =================== */}
      <section className="pb-6 pt-14 max-bp:pt-10">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead n="01">The Evening</SectionHead>
          <ol className="m-0 list-none p-0">
            {SCHEDULE.map((row) => (
              <li
                key={row.time}
                className="grid grid-cols-[120px_48px_1fr_220px] items-center gap-6 border-b-[3px] border-ink-dark py-4 max-bp:grid-cols-[64px_24px_1fr] max-bp:gap-3"
              >
                <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">
                  {row.time}
                </span>
                {row.key ? (
                  <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)] max-bp:h-5 max-bp:w-5"></span>
                ) : (
                  <span className="h-3.5 w-3.5 justify-self-center rounded-full bg-ink-dark"></span>
                )}
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                    {row.item}
                  </span>
                  {row.note && (
                    <span className="font-serif text-sm italic text-ink-dark">{row.note}</span>
                  )}
                </div>
                <span className="text-right font-mono text-sm uppercase tracking-widest text-ink-blue max-bp:hidden">
                  {row.key && <b className="text-ink-pink">The pitches</b>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =================== THE COHORT =================== */}
      <section className="pb-16 pt-12 max-bp:pb-12 max-bp:pt-8">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead n="02">The Cohort</SectionHead>
          <div className="grid grid-cols-[1.4fr_1fr] items-end gap-10 pb-8 pt-7 max-bp:grid-cols-1 max-bp:gap-3 max-bp:pb-6 max-bp:pt-5">
            <p className="m-0 font-serif text-xl leading-snug [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold max-bp:text-lg">
              <b>{inWords(shownProjects)} projects</b> from the first Surplus cohort, in the order
              they present.
            </p>
            <div className="text-right font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:hidden">
              ☞ ☞ ☞
            </div>
          </div>
          {projects.length > 0 && (
            <div className="grid grid-cols-3 border-l-[3px] border-t-[3px] border-ink-dark max-bp:grid-cols-1">
              {projects.map((p, idx) => (
                <ProjectCard key={p.founders[0].name} p={p} i={idx} />
              ))}
              <Link
                href="/founders"
                className={`group flex min-h-[140px] flex-col justify-between gap-4 border-b-[3px] border-r-[3px] border-ink-dark bg-ink-dark px-[26px] py-6 text-paper no-underline hover:bg-ink-blue focus-visible:outline-[3px] focus-visible:-outline-offset-[6px] focus-visible:outline-ink-yellow max-bp:col-span-1 ${FILLER_SPAN[fillerSpan]}`}
              >
                <span className="font-mono text-sm uppercase tracking-widest opacity-70">
                  Full profiles
                </span>
                <span className="font-condensed text-3xl font-bold uppercase leading-none tracking-wide">
                  Meet the founders <span className="font-display text-ink-yellow">☞</span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =================== RSVP =================== */}
      <section
        id="rsvp"
        className="relative overflow-hidden bg-ink-dark pb-16 pt-20 text-paper max-bp:pb-12 max-bp:pt-14"
      >
        <span
          aria-hidden="true"
          className="halftone pointer-events-none absolute -right-[100px] -top-[100px] h-[500px] w-[500px] opacity-50 [--dot-gap:14px] [--dot:3px]"
        ></span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[150px] -left-[120px] h-[420px] w-[420px] rounded-full bg-ink-blue opacity-40 mix-blend-screen"
        ></span>
        <div className="relative z-[1] mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <h2 className="m-0 font-display text-[clamp(56px,8vw,120px)] leading-[0.82] tracking-[-0.04em]">
            <span className="text-ink-yellow">RSVP</span> FOR
            <br />
            <span className="text-ink-pink">OCT 23</span>
          </h2>
          <div className="mt-[30px] grid grid-cols-[1fr_minmax(0,600px)] items-start gap-12 border-t-[3px] border-paper pt-[30px] max-bp:grid-cols-1 max-bp:gap-8">
            <div className="max-w-[40ch]">
              <p className="m-0 font-serif text-xl leading-snug max-bp:text-lg">
                Friday, October 23 at Mox SF, 1680 Mission St. Doors at four, first pitch at 4:40,
                dinner at six.
              </p>
              <p className="m-0 mt-6 font-mono text-sm uppercase tracking-widest opacity-80">
                Questions, or need to cancel?
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-mono text-sm uppercase tracking-widest text-ink-yellow underline underline-offset-2 hover:text-paper"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="text-ink-dark shadow-[8px_8px_0_var(--color-ink-blue)]">
              <Rsvp prefill={prefill} inviteCode={inviteCode} />
            </div>
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
