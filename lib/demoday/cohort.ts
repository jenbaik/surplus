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
  "Francisco Carvalho (xiq)",
  "Beat Hagenlocher",
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

// Card copy. `*word*` renders in italics; a block with `items` renders as
// a list under its lead-in, exactly as the founder wrote it.
export type Block = { text: string; items?: string[] };

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

type DocEntry = { tagline: string; blocks: Block[]; links: string[]; shared?: boolean };

// Founder-written copy from the Notion doc "What have founders been making
// at Surplus?" (Surplus Home), read 2026-10-07. Rule: their sentences and
// phrasing only, cut to condense, never reworded. Keyed by any one founder
// on the team (Airtable "Name"). Teams not listed fall back to their
// application text. `tagline` is the project name as the doc gives it.
// `shared: true` = the entry covers the whole team in one cell.
const DOC_COPY: Record<string, DocEntry> = {
  "Hudson Mitchell-Pullman": {
    shared: true,
    tagline: "Mathetic",
    blocks: [
      {
        text: "Hudson Mitchell-Pullman (16, high school dropout) and David Barron (24, former PhD student) are building Mathetic, a public benefit corporation building tools for research and discovery that incentivize human autonomy and augment cognition. Our first tool is called Engelbart, a research notebook that remembers where all of your thoughts came from. It aggregates context from across the research tools you already use (like Overleaf, Zotero, Google Drive, and GitHub) so you can work without re-explaining your projects or re-attaching files and context.",
      },
    ],
    links: ["https://www.loom.com/share/5fb1862c7b6d421f88e5bd536fab9267"],
  },
  "Joey Bream": {
    shared: true,
    tagline: "safely.bio",
    blocks: [
      {
        text: "safely.bio builds security software for companies that sell DNA. Normally, it takes a PhD-level scientist hours to review flagged customers. We automate screening for less than $1 and in a few seconds.",
      },
      {
        text: "We’ve finished a demo of our product, which is an API that calls agents to scrape the web and provide over 20 KYC checks in a matter of seconds.",
      },
    ],
    links: ["https://safely.bio"],
  },
  "Francisco Carvalho (xiq)": {
    tagline: "CA",
    blocks: [
      {
        text: "CA is an open social data project that",
        items: [
          "Archives people’s tweets",
          "Lets people (and me) build tools for epistemics and cooperation and community",
          "Enables scientific research on how ideas spread",
        ],
      },
    ],
    links: [],
  },
  "Christine Shiba": {
    tagline: "Cuties!",
    blocks: [
      {
        text: "Christine Shiba is a designer, community builder, and weaver of social infrastructure. She is working on Cuties!, a curated social app and vouch network that helps community-members find friends, opportunities, and people to date. Cuties! has over 2K users and has led to over 120 self-reported meet ups, including many friendships, collaborations, relationships, engagements and even 1 baby.",
      },
    ],
    links: ["https://cuties.app"],
  },
  "Haoxing Du": {
    tagline: "Susan Calvin Project",
    blocks: [
      {
        text: "Haoxing is a physicist by training who has spent her career evaluating AI models, from frontier LLMs at METR to AI weather models at WindBorne. She started the Susan Calvin Project, an independent observatory of AI behavior in the wild, named after the robopsychologist in Asimov. She is currently working with real user data from a coding agent company and exploring partnerships with AI safety researchers.",
      },
    ],
    links: ["https://susancalvin.org", "https://susancalvinproject.substack.com"],
  },
  "Derik Kauffman": {
    tagline: "Blacklight",
    blocks: [
      {
        text: "Derik studied physics and math at Brown, and co-founded Cavendish Labs (AI safety and biosecurity nonprofit) and RunRL (YC X25, reinforcement learning as a service). Now he’s building Blacklight, a tool to find errors and inconsistencies in scientific papers. Blacklight is built to scale: we’ve already found thousands of errors, and plan to scan all 1.6 million RCTs on PubMed in the coming months.",
      },
    ],
    links: ["https://blacklight.science"],
  },
  "Vaishnav Sunil": {
    tagline: "Clout",
    blocks: [
      {
        text: "Vaishnav has spent his career moving between investing, startups, and nonprofits. He started building Clout in early 2025 after receiving an Emergent Ventures grant to think and write about talent. Clout helps customers build lower-noise systems for finding and evaluating talent.",
      },
      {
        text: "Clout’s customers include AI safety fellowships, agent infrastructure startups, nonprofits from the progress studies world, and medium-sized businesses in healthcare and financial services.",
      },
    ],
    links: ["https://www.cloutcareers.com"],
  },
  "Beat Hagenlocher": {
    tagline: "*links*",
    blocks: [
      {
        text: "Beat Hagenlocher is currently building a set of *humane tools.* The first tool is something simple: A link-sharing and -saving inbox called *links.* It’s Beat’s take on removing the ‘hundreds of open tabs’ and ‘sending links to yourself on Whatsapp’ and ‘Oh, I have this saved *somewhere*’ situations.",
      },
    ],
    links: ["https://links.humane.tools"],
  },
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
  const founders = ordered.map((f) => ({ name: f.name, about: f.about }));
  const names = ordered.map((f) => f.name);

  const shared = ordered.map((f) => DOC_COPY[f.name]).find((d) => d?.shared);
  if (shared) return { founders, cells: [{ names, ...shared }] };

  if (ordered.some((f) => DOC_COPY[f.name])) {
    return {
      founders,
      cells: ordered.map((f) => {
        const d = DOC_COPY[f.name];
        return d ? { names: [f.name], ...d } : fallbackCell([f]);
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
