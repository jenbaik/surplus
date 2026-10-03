// Airtable schema constants for the Surplus review dashboard.
// Field IDs (rename-proof) for the Applicant table. If you add fields in
// Airtable, add them here and to normalizeApplicant below.

export const BASE_ID = "appaxqJfxht7OronH";
export const APPLICANT_TABLE_ID = "tblsvqV1tD3rSVMfz";

// The "Admitted" grid view: founders with status Confirmed or Acceptance sent.
export const ADMITTED_VIEW_ID = "viwShWo4bvatGvhsH";

// The Founders table (cohort ops): only the fields /founders needs.
export const FOUNDERS_TABLE_ID = "tblpHDFfIZ621AHYk";
export const FOUNDER_F = {
  applicantRecord: "fld3562s1qw4FNOd4",
  hidden: "fldcLYrjBAkGkHtbm",
} as const;

export const F = {
  name: "fld3gZ52ydW6p4Dxo",
  email: "fld4t5pg8cE0wa3Xt",
  ideaShort: "fldzPvZ6D6ull18XH",
  ideaLink: "fldH72JYfVlNlvGmM",
  link1: "fldq2ayJ3szuDwew4",
  link2: "fldPRie9I83dyJ9fQ",
  link3: "fldHwdX33IE7l6adg",
  mostImpactful: "fldcpFv5c5r5fCfxa",
  cofounders: "fldztA0sNGyuEsmR9",
  mainIdea: "fld1Jp2eCvQOMsnHz",
  reasonForIdea: "fld4k7OxnFIT8GVUQ",
  usersAcquisition: "fldnYCGV5hNFH0xxK",
  revenueModel: "fldRrrXTBeuuxpDRd",
  otherInterests: "fldR9VsD1R2fnHA9D",
  location: "fldB8FUgSMrULLR33",
  entityFormed: "fld84tqAGaxlGiy5V",
  entityDetails: "fldYS9YcmNPLWLTR3",
  takenFunding: "fldICPZcIKXqmDwfb",
  fundingDetails: "fldFYj5yDQ8lpy3jB",
  claudeActivity: "fldZhYZnF1icwRgWJ",
  referralSource: "fld9BOQxBV6tVL2Mm",
  recommends: "fldnLmuffPvKEamlR",
  applicationFeedback: "fldmAw9G0dZRN0B4S",
  otherNotes: "fldzARb6HGvREAIrH",
  created: "fldX9VVikQLjp6u18",
  austinPrio: "fldZ5CfIWv1CvbcHf",
  carolPrio: "fldpQmI0FwxJ3b6IT",
  carolNotes: "fld5YGf0q2sx6y9Wu",
  opusNotes: "fld5aiSfWX95v9Am1",
  opusPrio: "fldJHoQsGaBZDjWaa",
  gptPrio: "fldjQ6xnn4IZf2H6P",
  blendedPrio: "fldwcFnbKyAeUEh2P",
  status: "fldJ4tu2Pp63GzVAQ",
  cofounderLink: "fldTxJMGjp8zM3fdj",
  category: "fldjypeeOTiUQ5K91",
  austinNotes: "fldrOOJCwFyHTCbHh",
  austinPostInterviewNotes: "fldKy6GWifxtJY9fw",
  decision: "fld0aQAYyhusEH5t7",
  pangramFractionAi: "fldUROVrbmmubq11u",
} as const;

// Display name of the F.pangramFractionAi field (the Meta API and
// listFieldValues reference fields by name).
export const PANGRAM_FIELD_NAME = "Pangram AI fraction";

export const STATUSES = [
  "Needs score",
  "To add notes",
  "To desk reject",
  "To email for interview",
  "Emailed for interview",
  "Interview scheduled",
  "Interviewed",
  "Acceptance sent",
  "Confirmed",
  "Rejected",
  "Declined",
  "Duplicate",
] as const;
export type Status = (typeof STATUSES)[number];

// "Decision (post-interview)" single-select, best to worst.
export const DECISIONS = ["Yes", "Lean yes", "Very unsure", "Lean no", "No"] as const;
export type Decision = (typeof DECISIONS)[number];

export const CATEGORIES = [
  "AI for Epistemics",
  "Public-facing info",
  "Community infra",
  "Other",
] as const;

export type Applicant = {
  id: string;
  createdTime: string;
  name: string;
  email: string;
  ideaShort: string;
  ideaLink: string;
  link1: string;
  link2: string;
  link3: string;
  mostImpactful: string;
  cofounders: string;
  mainIdea: string;
  reasonForIdea: string;
  usersAcquisition: string;
  revenueModel: string;
  otherInterests: string;
  location: string;
  entityFormed: string;
  entityDetails: string;
  takenFunding: string;
  fundingDetails: string;
  claudeActivity: string;
  referralSource: string;
  recommends: string;
  applicationFeedback: string;
  otherNotes: string;
  austinPrio: number | null;
  carolPrio: number | null;
  carolNotes: string;
  opusNotes: string;
  opusPrio: number | null;
  gptPrio: number | null;
  blendedPrio: number | null;
  pangramFractionAi: number | null;
  status: Status | null;
  decision: Decision | null;
  category: string[];
  cofounderIds: string[];
  cofounderNames: string[];
  austinNotes: string;
  austinPostInterviewNotes: string;
};

type Cell = unknown;
type RawRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, Cell>;
};

function str(v: Cell): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  // aiText fields come back as { state, value, isStale }
  if (typeof v === "object" && "value" in (v as object)) {
    return str((v as { value: unknown }).value);
  }
  return String(v);
}

function num(v: Cell): number | null {
  return typeof v === "number" ? v : null;
}

function selectName(v: Cell): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "name" in (v as object)) {
    return String((v as { name: unknown }).name);
  }
  return "";
}

// Normalizes a raw Airtable record (fetched with returnFieldsByFieldId=true)
export function normalizeApplicant(rec: RawRecord): Applicant {
  const f = rec.fields;
  const category = Array.isArray(f[F.category])
    ? (f[F.category] as Cell[]).map(selectName).filter(Boolean)
    : [];
  // Linked-record cells come back as record-ID strings (or {id, name} objects
  // in some API shapes) — keep both the ids and any names we can get.
  const cofounderCells = Array.isArray(f[F.cofounderLink])
    ? (f[F.cofounderLink] as (string | { id?: string; name?: string })[])
    : [];
  const cofounderIds = cofounderCells
    .map((c) => (typeof c === "string" ? c : c?.id ?? ""))
    .filter(Boolean);
  const cofounderNames = cofounderCells
    .map((c) => (typeof c === "string" ? "" : c?.name ?? ""))
    .filter(Boolean);
  return {
    id: rec.id,
    createdTime: rec.createdTime,
    name: str(f[F.name]),
    email: str(f[F.email]),
    ideaShort: str(f[F.ideaShort]),
    ideaLink: str(f[F.ideaLink]),
    link1: str(f[F.link1]),
    link2: str(f[F.link2]),
    link3: str(f[F.link3]),
    mostImpactful: str(f[F.mostImpactful]),
    cofounders: str(f[F.cofounders]),
    mainIdea: str(f[F.mainIdea]),
    reasonForIdea: str(f[F.reasonForIdea]),
    usersAcquisition: str(f[F.usersAcquisition]),
    revenueModel: str(f[F.revenueModel]),
    otherInterests: str(f[F.otherInterests]),
    location: str(f[F.location]),
    entityFormed: selectName(f[F.entityFormed]),
    entityDetails: str(f[F.entityDetails]),
    takenFunding: selectName(f[F.takenFunding]),
    fundingDetails: str(f[F.fundingDetails]),
    claudeActivity: str(f[F.claudeActivity]),
    referralSource: str(f[F.referralSource]),
    recommends: str(f[F.recommends]),
    applicationFeedback: str(f[F.applicationFeedback]),
    otherNotes: str(f[F.otherNotes]),
    austinPrio: num(f[F.austinPrio]),
    carolPrio: num(f[F.carolPrio]),
    carolNotes: str(f[F.carolNotes]),
    opusNotes: str(f[F.opusNotes]),
    opusPrio: num(f[F.opusPrio]),
    gptPrio: num(f[F.gptPrio]),
    blendedPrio: num(f[F.blendedPrio]),
    pangramFractionAi: num(f[F.pangramFractionAi]),
    status: (selectName(f[F.status]) || null) as Status | null,
    decision: (selectName(f[F.decision]) || null) as Decision | null,
    category,
    cofounderIds,
    cofounderNames,
    austinNotes: str(f[F.austinNotes]),
    austinPostInterviewNotes: str(f[F.austinPostInterviewNotes]),
  };
}

// The long-form application sections, in reading order, used by the detail
// view, the AI grading prompt, and {{ALL_RESPONSES}} in emails.
export const APPLICATION_SECTIONS: { label: string; key: keyof Applicant }[] = [
  { label: "Idea (short)", key: "ideaShort" },
  { label: "Idea (long)", key: "mainIdea" },
  { label: "Why this idea", key: "reasonForIdea" },
  { label: "Idea link", key: "ideaLink" },
  { label: "Most impactful project", key: "mostImpactful" },
  { label: "Users & acquisition", key: "usersAcquisition" },
  { label: "Revenue model", key: "revenueModel" },
  { label: "Other idea interests", key: "otherInterests" },
  { label: "Cofounders", key: "cofounders" },
  { label: "Links", key: "link1" },
  { label: "Base location", key: "location" },
  { label: "Legal entity formed?", key: "entityFormed" },
  { label: "Entity structure & equity", key: "entityDetails" },
  { label: "Taken funding?", key: "takenFunding" },
  { label: "Funding details", key: "fundingDetails" },
  { label: "Claude Fable activity", key: "claudeActivity" },
  { label: "Referral source", key: "referralSource" },
  { label: "Recommends", key: "recommends" },
  { label: "Application feedback", key: "applicationFeedback" },
  { label: "Other notes", key: "otherNotes" },
];

// Plain-text rendering of an application, e.g. for the AI grading prompt
// and for emailing applicants a copy of their responses.
export function applicationText(a: Applicant): string {
  const lines: string[] = [`Name: ${a.name}`];
  for (const { label, key } of APPLICATION_SECTIONS) {
    if (key === "link1") {
      const links = [a.link1, a.link2, a.link3].filter(Boolean).join("\n");
      if (links) lines.push(`Links:\n${links}`);
      continue;
    }
    const v = a[key];
    if (typeof v === "string" && v.trim()) lines.push(`${label}:\n${v.trim()}`);
  }
  return lines.join("\n\n");
}
