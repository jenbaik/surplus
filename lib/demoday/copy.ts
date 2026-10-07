// Founder card copy for /demoday. Every word below comes from the founders'
// own sections of the Notion doc "What have founders been making at
// Surplus?" (Surplus Home), read 2026-10-07: names, project names, text
// and links. The only edit allowed is cutting words; nothing is added or
// reworded. Checked word-for-word against the doc on 2026-10-07.

// `*word*` renders in italics; a block with `items` renders as a list under
// its lead-in, exactly as the founder wrote it.
export type Block = { text: string; items?: string[] };

export type DocEntry = {
  // Names as the doc writes them (defaults to the Airtable name).
  names?: string[];
  // Project name as the doc gives it.
  tagline: string;
  blocks: Block[];
  // Only links that appear in the doc.
  links: string[];
  // true = one card for the whole team (they wrote one shared section).
  shared?: boolean;
};

export const DOC_COPY: Record<string, DocEntry> = {
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
    names: ["Joey Bream", "Phil Palmer"],
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
    links: [],
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
