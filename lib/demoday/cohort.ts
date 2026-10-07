import { loadPublicFounders, type PublicFounder } from "@/lib/founders";

// The Demo Day roster: the admitted cohort (same live Airtable data as
// /founders, via lib/founders.ts) minus the founders who aren't presenting.

// Not presenting at Demo Day — matched against the Airtable "Name" field.
const NOT_PRESENTING = new Set([
  "Owen Shen",
  "Theo Ryzhenkov",
  "Cecilia Roos",
  "Aniket Panjwani",
  "Sophia Wang",
  "Anushree Chaudhuri",
]);

// Running order on the invite. Each entry is any one founder on the team
// (Airtable "Name"); teams not listed follow in Admitted-view order.
const RUNNING_ORDER = [
  "Hudson Mitchell-Pullman",
  "Joey Bream",
  "Haoxing Du",
  "Beat Hagenlocher",
  "Francisco Carvalho (xiq)",
  "Vaishnav Sunil",
  "Derik Kauffman",
];

function slot(p: Project): number {
  const i = Math.min(
    ...p.founders.map((f) => {
      const k = RUNNING_ORDER.indexOf(f.name);
      return k === -1 ? Infinity : k;
    })
  );
  return i;
}

// Two teams wrote separate descriptions rather than a shared one. Until the
// founders say which they want on the invite, the card leads with this
// member's tagline + description (matches the earlier mock). Delete an
// entry to fall back to view order.
const DESCRIPTION_LEAD = new Set(["Francisco Carvalho (xiq)", "Hudson Mitchell-Pullman"]);

// Idea links that are working documents rather than a project site.
const PRIVATE_LINK = /docs\.google\.com|notion\.so/i;

import { DOC_COPY, type Block } from "@/lib/demoday/copy";

export type { Block };

// One cell on the card. A team that wrote one shared description gets a
// single cell naming everyone; a team that wrote separately gets one cell
// per founder (the /founders layout).
export type Cell = {
  names: string[];
  tagline: string;
  blocks: Block[];
  links: string[];
};

export type Project = {
  founders: { name: string; about: string }[];
  cells: Cell[];
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

// Application-text fallback for anyone without doc copy.
function fallbackCell(people: PublicFounder[]): Cell {
  const withCopy = people.find((f) => f.ideaLong) ?? people[0];
  const withTagline = people.find((f) => f.ideaShort) ?? people[0];
  const ideaLinks = [...new Set(people.flatMap((f) => f.ideaLinks))].filter(
    (u) => !PRIVATE_LINK.test(u)
  );
  const links = ideaLinks.length ? ideaLinks : people.map((f) => f.about).filter(Boolean);
  return {
    names: people.map((f) => f.name),
    tagline: withTagline.ideaShort,
    blocks: [{ text: leadSentences(withCopy.ideaLong) }],
    links: [...new Set(links)],
  };
}

function toProject(team: PublicFounder[]): Project {
  const lead = team.find((f) => DESCRIPTION_LEAD.has(f.name));
  const ordered = lead ? [lead, ...team.filter((f) => f !== lead)] : team;
  // Names as the Notion doc writes them where it does (e.g. "Phil Palmer"
  // for Airtable's "Dr. Phil Palmer"); `about` is their personal site, the
  // same link /founders shows.
  const docNames = ordered.flatMap((f) => DOC_COPY[f.name]?.names ?? []);
  const display = (name: string) => docNames.find((n) => name.endsWith(n)) ?? name;
  const founders = ordered.map((f) => ({ name: display(f.name), about: f.about }));
  const names = founders.map((f) => f.name);

  const shared = ordered.map((f) => DOC_COPY[f.name]).find((d) => d?.shared);
  if (shared) {
    const { shared: _shared, ...copy } = shared;
    void _shared;
    return { founders, cells: [{ ...copy, names: copy.names ?? names }] };
  }

  if (ordered.some((f) => DOC_COPY[f.name])) {
    return {
      founders,
      cells: ordered.map((f) => {
        const d = DOC_COPY[f.name];
        if (!d) return fallbackCell([f]);
        const { shared: _shared, ...copy } = d;
        void _shared;
        return { ...copy, names: copy.names ?? [display(f.name)] };
      }),
    };
  }
  return { founders, cells: [fallbackCell(ordered)] };
}

export async function loadCohort(): Promise<Project[]> {
  const groups = await loadPublicFounders({ revalidate: 300 });
  return groups
    .map((g) => g.filter((f) => !NOT_PRESENTING.has(f.name)))
    .filter((g) => g.length > 0)
    .map(toProject)
    .sort((a, b) => slot(a) - slot(b));
}
