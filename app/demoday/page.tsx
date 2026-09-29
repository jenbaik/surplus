import type { Metadata } from "next";
import Link from "next/link";
import { findGuestBy } from "@/lib/demoday/airtable";
import { CONTACT_EMAIL } from "@/lib/demoday/calendar";
import { PATTERNS } from "@/lib/demoday/fields";
import { loadCohort, type Project } from "@/lib/demoday/cohort";
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
  { time: "4:00", item: "Doors open", note: "Come early, meet people" },
  { time: "4:30", item: "Host framing", note: "Austin on Surplus" },
  { time: "4:40", item: "Pitch Block 1", note: "Four projects", key: true },
  { time: "5:05", item: "Break", note: "Twenty minutes · eat something" },
  { time: "5:25", item: "Pitch Block 2", note: "Four projects", key: true },
  { time: "5:50", item: "Close" },
  { time: "6:00", item: "Dinner" },
  { time: "7:00", item: "Continued mingling & happy hour", note: "Until we’re done" },
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

// -------------------- pieces --------------------

function Chip({ accent, children }: { accent?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`whitespace-nowrap px-3 py-1.5 font-mono text-sm uppercase tracking-widest text-paper max-bp:px-2 max-bp:py-1 max-bp:text-xs ${
        accent ? "bg-ink-pink" : "bg-ink-dark"
      }`}
    >
      {children}
    </span>
  );
}

function Stat({ n, label, detail }: { n: string; label: string; detail: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 border-[3px] border-ink-dark bg-paper px-3.5 py-3">
      <span className="min-w-[2ch] font-display text-[34px] leading-none text-ink-pink">{n}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
          {label}
        </span>
        <span className="font-mono text-[12px] uppercase leading-[1.15] tracking-widest text-ink-blue">
          {detail}
        </span>
      </span>
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 border-b-[3px] border-ink-dark pb-2 font-condensed text-4xl font-bold uppercase leading-none tracking-wide max-bp:text-2xl">
      {children}
    </h2>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <article className="flex min-w-0 flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-4 pb-4 pt-3.5">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-base leading-none text-ink-pink">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="m-0 text-balance font-condensed text-[22px] font-bold uppercase leading-[0.95] tracking-wide">
          {p.founders.map((f, fi) => (
            <span key={f.name}>
              {fi > 0 && <span className="px-1.5 font-display text-ink-blue">+</span>}
              {f.name}
            </span>
          ))}
        </h3>
      </div>
      {p.tagline && (
        <p className="mt-2 text-pretty font-serif text-[15px] italic leading-snug">{p.tagline}</p>
      )}
      {p.blurb && (
        <p className="mt-2 text-pretty font-serif text-sm leading-snug">{p.blurb}</p>
      )}
      {p.links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
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

  return (
    <>
      {/* =================== HEAD =================== */}
      <section className="pb-5 pt-7 max-bp:pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Chip>An invitation</Chip>
            <Chip accent>Demo Day</Chip>
            <span className="font-display text-xl leading-none text-ink-blue">✳</span>
            <Chip>
              The first <b className="font-bold text-ink-yellow">Surplus</b> cohort
            </Chip>
          </div>

          <h1 className="misreg m-0 font-display text-[clamp(64px,12vw,176px)] leading-[0.8] tracking-[-0.045em] text-ink-dark max-bp:text-[clamp(48px,15vw,104px)]">
            DEMO <span className="misreg-accent text-ink-pink">DAY</span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 max-bp:mt-5 max-bp:gap-x-5">
            <a
              href="#rsvp"
              className={`${BUTTON_BASE} min-w-[300px] px-12 py-3.5 text-4xl leading-none max-bp:min-w-0 max-bp:px-8 max-bp:text-3xl max-sm:w-full`}
            >
              RSVP
            </a>
            <span className="font-condensed text-[clamp(22px,2.6vw,34px)] font-bold uppercase leading-tight tracking-wide">
              <span className="whitespace-nowrap text-ink-pink">Friday, Oct 23</span>
              <span className="px-2 text-ink-blue">·</span>
              <span className="whitespace-nowrap">Doors 4PM</span>
              <span className="px-2 text-ink-blue">·</span>
              <span className="whitespace-nowrap">Mox SF</span>
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t-[3px] border-ink-dark pt-2 font-mono text-sm uppercase tracking-widest max-bp:flex-col max-bp:items-start max-bp:gap-1">
            <span>☞&nbsp;&nbsp;Organized by Manifund &amp; Mox</span>
            <span>1680 Mission St, San Francisco</span>
          </div>

          <p className="mt-6 max-w-[38ch] font-serif text-[clamp(24px,3vw,38px)] font-medium leading-[1.15] text-ink-dark [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark">
            Eight projects, <em>ten weeks</em>, and <mark>six minutes each</mark> to show you what
            they built.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 max-bp:gap-3 max-sm:grid-cols-1">
            <Stat n="8" label="Projects" detail="12 founders" />
            <Stat n="6" label="Minutes each" detail="Then the floor is yours" />
            <Stat n="~40" label="Guests" detail="Invite only" />
          </div>
        </div>
      </section>

      {/* =================== THE EVENING =================== */}
      <section className="pb-6 pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead>
            The <span className="text-ink-pink">evening</span>
          </SectionHead>
          <ol className="m-0 mt-1 list-none p-0">
            {SCHEDULE.map((row) => (
              <li
                key={row.time}
                className="grid grid-cols-[72px_1fr] items-baseline gap-4 border-b-[1.5px] border-ink-dark py-2.5 last:border-b-0 max-sm:grid-cols-[52px_1fr] max-sm:gap-3"
              >
                <span className="font-display text-lg leading-none text-ink-blue max-sm:text-base">
                  {row.time}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span
                    className={`font-condensed text-xl font-bold uppercase tracking-wide ${
                      row.key ? "text-ink-pink" : ""
                    }`}
                  >
                    {row.item}
                  </span>
                  {row.note && (
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-dark/70">
                      {row.note}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =================== THE COHORT =================== */}
      <section className="pb-8 pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead>
            The <span className="text-ink-pink">cohort</span>
          </SectionHead>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-dark/70">
            {projects.length > 0 && (
              <>
                {projects.length} projects · {founderCount} founders ·{" "}
              </>
            )}
            Full profiles at{" "}
            <Link href="/founders" className="text-ink-blue underline underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline">
              surplus.dev/founders
            </Link>
          </p>
          {projects.length > 0 && (
            <div className="mt-3 grid grid-cols-2 border-l-[3px] border-t-[3px] border-ink-dark max-sm:grid-cols-1">
              {projects.map((p, i) => (
                <ProjectCard key={p.founders[0].name} p={p} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================== RSVP =================== */}
      <section id="rsvp" className="scroll-mt-6 pb-10 pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <SectionHead>
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
            <span>Mox SF · 1680 Mission St, San Francisco · Nearest BART is 16th St Mission</span>
            <Link href="/" className="text-paper underline underline-offset-2 hover:text-ink-yellow">
              ☜ surplus.dev
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
