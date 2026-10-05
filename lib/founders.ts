import { listApplicants, listHiddenApplicantIds } from "@/lib/review/airtable";
import { ADMITTED_VIEW_ID, type Applicant } from "@/lib/review/fields";

// Data shaping for the public cohort pages (/founders, /demoday). Everything
// here projects full Applicant records down to whitelisted, sanitized
// PublicFounder values at the fetch boundary — Applicant records carry
// sensitive data (email, reviewer notes, AI grades) that must never reach a
// render tree or a client component.

// Drop placeholder answers ("N/A", "-", "none") so cards only render substance.
export function clean(s: string): string {
  const t = s.trim();
  return t.length > 2 && !/^(n\/?a\.?|none\.?|-+)$/i.test(t) ? t : "";
}

// Pull URLs out of free-text link fields ("www.a.com; https://b.com (password: x)")
// — only URL-shaped tokens are kept, so stray commentary never renders publicly.
export function extractUrls(raw: string): string[] {
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

export function prettyUrl(url: string): string {
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
export type PublicFounder = {
  name: string;
  about: string;
  ideaShort: string;
  ideaLinks: string[];
  ideaLong: string;
  otherIdeas: string;
  pending: boolean;
};

export function toPublic(a: Applicant): PublicFounder {
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
export function groupFounders(list: Applicant[]): Applicant[][] {
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

// Admitted founders as public projections, grouped into teams. `revalidate`
// is the fetch data-cache TTL in seconds, for pages that are otherwise
// dynamic and would hit Airtable on every request.
export async function loadPublicFounders(opts?: {
  revalidate?: number;
}): Promise<PublicFounder[][]> {
  const [applicants, hiddenIds] = await Promise.all([
    listApplicants({ view: ADMITTED_VIEW_ID, ...opts }),
    listHiddenApplicantIds(opts),
  ]);
  // Founders marked "Hidden" in the Founders table are dropped before
  // grouping, so a hidden founder's teammate renders as a solo founder.
  const admitted = applicants.filter((a) => !hiddenIds.has(a.id));
  // Grouping needs record ids; everything after this line sees only the
  // whitelisted PublicFounder projection.
  return groupFounders(admitted).map((g) => g.map(toPublic));
}
