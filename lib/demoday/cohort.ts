import { loadPublicFounders, type PublicFounder } from "@/lib/founders";

// The Demo Day roster: the admitted cohort (same live Airtable data as
// /founders, via lib/founders.ts) minus the founders who aren't presenting.

// Not presenting at Demo Day — matched against the Airtable "Name" field.
const NOT_PRESENTING = new Set([
  "Owen Shen",
  "Theo Ryzhenkov",
  "Cecilia Roos",
  "Aniket Panjwani",
]);

// Two teams wrote separate descriptions rather than a shared one. Until the
// founders say which they want on the invite, the card leads with this
// member's tagline + description (matches the earlier mock). Delete an
// entry to fall back to view order.
const DESCRIPTION_LEAD = new Set(["Francisco Carvalho (xiq)", "Hudson Mitchell-Pullman"]);

// Idea links that are working documents rather than a project site.
const PRIVATE_LINK = /docs\.google\.com|notion\.so/i;

export type Project = {
  founders: { name: string; about: string }[];
  tagline: string;
  blurb: string;
  links: string[];
};

// Cut from the end only: the first paragraph, then at most `maxSentences`
// sentences, then a hard cap at `maxChars` on a sentence boundary. Never
// rewrites — the words are the founders'.
export function leadSentences(text: string, maxSentences = 3, maxChars = 340): string {
  const para = text.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "";
  // A boundary is a terminator + whitespace + a capital/quote, and not an
  // initialism ("U.S. AI"); dots inside URLs never split.
  const sentences = para
    .split(/(?<=(?<![A-Z])[.!?]["')\]]*)\s+(?=["'(\[]?[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
  let out = "";
  for (const s of sentences.slice(0, maxSentences)) {
    const next = out ? `${out} ${s}` : s;
    if (out && next.length > maxChars) break;
    out = next;
  }
  return out || para.slice(0, maxChars);
}

function toProject(team: PublicFounder[]): Project {
  const lead = team.find((f) => DESCRIPTION_LEAD.has(f.name));
  const ordered = lead ? [lead, ...team.filter((f) => f !== lead)] : team;
  const withCopy = ordered.find((f) => f.ideaLong) ?? ordered[0];
  const withTagline = ordered.find((f) => f.ideaShort) ?? ordered[0];
  const ideaLinks = [...new Set(ordered.flatMap((f) => f.ideaLinks))].filter(
    (u) => !PRIVATE_LINK.test(u)
  );
  const links = ideaLinks.length ? ideaLinks : ordered.map((f) => f.about).filter(Boolean);
  return {
    founders: ordered.map((f) => ({ name: f.name, about: f.about })),
    tagline: withTagline.ideaShort,
    blurb: leadSentences(withCopy.ideaLong),
    links: [...new Set(links)],
  };
}

export async function loadCohort(): Promise<Project[]> {
  const groups = await loadPublicFounders({ revalidate: 300 });
  return groups
    .map((g) => g.filter((f) => !NOT_PRESENTING.has(f.name)))
    .filter((g) => g.length > 0)
    .map(toProject);
}
