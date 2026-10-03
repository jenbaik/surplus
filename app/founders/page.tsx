import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { listApplicants, listHiddenApplicantIds } from "@/lib/review/airtable";
import { ADMITTED_VIEW_ID, type Applicant } from "@/lib/review/fields";

// Statically prerendered, refreshed from Airtable every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Founders — Surplus",
  description:
    "The founders of Surplus cohort 1 — building software for massive public good. In residence at Mox, San Francisco, July–October 2026.",
};

// -------------------- data shaping --------------------

// Drop placeholder answers ("N/A", "-", "none") so cards only render substance.
function clean(s: string): string {
  const t = s.trim();
  return t.length > 2 && !/^(n\/?a\.?|none\.?|-+)$/i.test(t) ? t : "";
}

// Pull URLs out of free-text link fields ("www.a.com; https://b.com (password: x)")
// — only URL-shaped tokens are kept, so stray commentary never renders publicly.
function extractUrls(raw: string): string[] {
  return raw
    .split(/[\s;,]+/)
    .map((t) => t.replace(/[).,;]+$/, ""))
    .filter(
      (t) =>
        /^https?:\/\/\S+\.\S+/.test(t) ||
        /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(t)
    )
    .map((t) => (t.startsWith("http") ? t : `https://${t}`));
}

function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    const s = u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "");
    return s.length > 28 ? s.slice(0, 26) + "…" : s;
  } catch {
    return url;
  }
}

const isPending = (a: Applicant) => a.status === "Acceptance sent";

// Only these whitelisted, already-sanitized fields may reach the render tree.
// Full Applicant records carry sensitive data (email, reviewer notes, AI
// grades) — project them away at the fetch boundary so no future refactor
// (e.g. a client component) can accidentally serialize them.
type PublicFounder = {
  name: string;
  about: string;
  ideaShort: string;
  ideaLinks: string[];
  ideaLong: string;
  otherIdeas: string;
  pending: boolean;
};

function toPublic(a: Applicant): PublicFounder {
  return {
    name: a.name,
    about: extractUrls(a.link1)[0] ?? "",
    ideaShort: clean(a.ideaShort),
    ideaLinks: extractUrls(a.ideaLink),
    ideaLong: clean(a.mainIdea),
    otherIdeas: clean(a.otherInterests),
    pending: isPending(a),
  };
}

// Group cofounding teams (connected components over the cofounder links,
// restricted to the admitted set), teams first, both in view order.
function groupFounders(list: Applicant[]): Applicant[][] {
  const byId = new Map(list.map((a) => [a.id, a]));
  const seen = new Set<string>();
  const teams: Applicant[][] = [];
  const solos: Applicant[][] = [];
  for (const a of list) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    const group: Applicant[] = [];
    const queue = [a.id];
    while (queue.length) {
      const rec = byId.get(queue.shift()!);
      if (!rec) continue;
      group.push(rec);
      for (const next of rec.cofounderIds) {
        if (byId.has(next) && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    (group.length > 1 ? teams : solos).push(group);
  }
  return [...teams, ...solos];
}

// -------------------- pieces --------------------

// Collapsed by default to a 4-line preview; clicking anywhere on the block
// (label or preview) expands it in place.
function Expand({ label, text }: { label: string; text: string }) {
  return (
    <details className="group mt-2.5 border-t-[1.5px] border-dotted border-ink-dark/40 pt-1.5">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-blue transition-colors duration-150 group-hover:text-ink-pink">
          <span
            aria-hidden="true"
            className="inline-block font-display text-xs leading-none transition-transform duration-200 ease-out group-open:rotate-90"
          >
            ☞
          </span>
          {label}
        </span>
        <span className="mt-1 line-clamp-4 whitespace-pre-line font-serif text-sm leading-snug group-open:hidden">
          {text}
        </span>
        <span className="mt-1 hidden whitespace-pre-line font-serif text-sm leading-snug text-pretty group-open:block">
          {text}
        </span>
      </summary>
    </details>
  );
}

function FounderCell({ f, className = "" }: { f: PublicFounder; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col px-4 pb-4 pt-3.5 ${className}`}>
      <h3 className="text-balance font-condensed text-[22px] font-bold uppercase leading-[0.95] tracking-wide">
        {f.name}
        {f.pending && (
          // Absolutely positioned so the oversized glyph never shifts the
          // name's line box.
          <span className="relative inline-block w-2">
            <a
              href="#pending-confirmation"
              title="Pending confirmation"
              className="absolute -top-3.5 left-1 font-serif text-2xl leading-none text-ink-pink no-underline"
            >
              *
            </a>
          </span>
        )}
      </h3>
      {f.about && (
        <a
          href={f.about}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 self-start font-mono text-[11px] uppercase tracking-widest text-ink-blue underline decoration-1 underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
        >
          ☞ {prettyUrl(f.about)}
        </a>
      )}
      {f.ideaShort && (
        <p className="mt-2 text-pretty font-serif text-[15px] italic leading-snug text-ink-dark">
          {f.ideaShort}
        </p>
      )}
      {f.ideaLinks.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {f.ideaLinks.map((u) => (
            <a
              key={u}
              href={u}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-widest text-ink-blue underline decoration-1 underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
            >
              ✦ {prettyUrl(u)}
            </a>
          ))}
        </div>
      )}
      {f.ideaLong && <Expand label="Full idea" text={f.ideaLong} />}
      {f.otherIdeas && <Expand label="Other ideas" text={f.otherIdeas} />}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full border-b-[3px] border-r-[3px] border-ink-dark bg-paper-deep px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-ink-blue">
      {children}
    </div>
  );
}

// -------------------- page --------------------

export default async function FoundersPage() {
  const [applicants, hiddenIds] = await Promise.all([
    listApplicants({ view: ADMITTED_VIEW_ID }),
    listHiddenApplicantIds(),
  ]);
  // Founders marked "Hidden" in the Founders table are dropped before
  // grouping, so a hidden founder's teammate renders as a solo founder.
  const admitted = applicants.filter((a) => !hiddenIds.has(a.id));
  // Grouping needs record ids; everything after this line sees only the
  // whitelisted PublicFounder projection.
  const groups = groupFounders(admitted).map((g) => g.map(toPublic));
  const founderCount = groups.reduce((n, g) => n + g.length, 0);
  const teams = groups.filter((g) => g.length > 1);
  const solos = groups.filter((g) => g.length === 1);
  const anyPending = groups.some((g) => g.some((f) => f.pending));
  // Team cards span 2 of the 4 desktop columns; square off the frame when the
  // team rows don't fill the last row exactly.
  const teamFillerCols = (4 - ((teams.length * 2) % 4)) % 4;

  return (
    <>
      {/* =================== HERO =================== */}
      <section className="pb-5 pt-7 max-bp:pb-4 max-bp:pt-5">
        <div className="mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <h1 className="misreg m-0 font-display text-[clamp(40px,6vw,88px)] leading-[0.8] tracking-[-0.04em] text-ink-dark max-bp:text-[clamp(34px,9vw,56px)]">
            FOUNDERS
          </h1>
          <div className="mt-1.5 flex items-baseline justify-between border-t-[3px] border-ink-dark pt-2 font-mono text-sm uppercase tracking-widest max-bp:flex-col max-bp:items-start max-bp:gap-1">
            <span>
              ☞&nbsp;&nbsp;{founderCount} founders · {groups.length} projects
            </span>
            <span className="max-bp:hidden">Aug 3 → Oct 23 · San Francisco</span>
          </div>
        </div>
      </section>

      {/* =================== COHORT 1 =================== */}
      <div className="bg-ink-dark px-10 py-2.5 text-center font-condensed text-lg font-bold uppercase tracking-wider text-paper max-bp:px-5 max-bp:text-sm">
        —&nbsp;&nbsp; Summer 2026&nbsp;&nbsp;—
      </div>

      <section className="pb-14 pt-7 max-bp:pb-10 max-bp:pt-5">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-4 border-l-[3px] border-t-[3px] border-ink-dark max-bp:grid-cols-2 max-sm:grid-cols-1">
            {teams.length > 0 && <GroupLabel>— Cofounding teams —</GroupLabel>}
            {teams.map((team) => (
              <article
                key={team[0].name}
                className="col-span-2 border-b-[3px] border-r-[3px] border-ink-dark bg-paper max-sm:col-span-full"
              >
                <div className="flex items-stretch max-sm:flex-col">
                  {team.map((f, mi) => (
                    <Fragment key={f.name}>
                      {mi > 0 && (
                        <div className="relative flex items-center justify-center px-0.5 max-sm:py-1">
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-4 left-1/2 border-l-[1.5px] border-dotted border-ink-dark/40 max-sm:inset-x-4 max-sm:inset-y-auto max-sm:left-4 max-sm:top-1/2 max-sm:border-l-0 max-sm:border-t-[1.5px]"
                          ></span>
                          <span className="relative select-none bg-paper py-1 font-display text-2xl leading-none text-ink-blue">
                            +
                          </span>
                        </div>
                      )}
                      <FounderCell f={f} className="flex-1" />
                    </Fragment>
                  ))}
                </div>
              </article>
            ))}
            {teamFillerCols > 0 && (
              <div
                aria-hidden="true"
                className="border-b-[3px] border-r-[3px] border-ink-dark bg-paper-deep max-bp:hidden"
                style={{ gridColumn: `span ${teamFillerCols} / span ${teamFillerCols}` }}
              ></div>
            )}

            {solos.length > 0 && <GroupLabel>— Solo founders —</GroupLabel>}
            {solos.map(([f]) => (
              <article
                key={f.name}
                className="border-b-[3px] border-r-[3px] border-ink-dark bg-paper"
              >
                <FounderCell f={f} />
              </article>
            ))}
          </div>

          {anyPending && (
            <p
              id="pending-confirmation"
              className="mt-4 font-mono text-base uppercase tracking-widest opacity-85"
            >
              <span className="text-ink-pink">*</span>&nbsp;&nbsp;Invited, pending confirmation
            </p>
          )}
        </div>
      </section>

      {/* =================== COLOPHON =================== */}
      <footer className="bg-ink-dark pb-7 pt-5 font-mono text-[13px] uppercase tracking-[0.14em] text-paper">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-dotted border-paper/40 pt-4 max-bp:flex-col max-bp:items-start max-bp:gap-2">
            <span className="font-display text-lg tracking-[0.06em] text-paper">
              SURPLUS - 2026
            </span>
            <Link
              href="/"
              className="text-paper underline underline-offset-2 hover:text-ink-yellow"
            >
              ☜ Back to surplus.dev
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
