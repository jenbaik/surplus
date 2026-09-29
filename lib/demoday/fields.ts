// Airtable schema constants for the Demo Day guest list / RSVP log. Same
// base as the review dashboard (BASE_ID in lib/review/fields.ts); this is
// the "Demo Day" table. Field IDs are rename-proof and verified against the
// live table (Meta API) on 2026-09-29.

export const DEMODAY_TABLE_ID = "tblWsTsbDBtYZ0QYb";

export const G = {
  name: "fldBKOwJdYtiTZjmG", // Name
  email: "fldLHAyKkMI2obW7R", // Email
  org: "fld4HZJyvoYWWSmIt", // Org
  kind: "flduSFp723hT4YvQM", // Kind
  personalNote: "fldoDJwRCv5MqJUJ1", // Personal note
  inviteCode: "fldumNMLClQCO3rvo", // Invite code
  inviteSent: "fldBWgsSraXl2kQtI", // Invite sent
  rsvp: "fldu7OzZPdJ1nZQsv", // RSVP
  diet: "fld2havgiOcz4Fe84", // Dietary restrictions
  anything: "fldIng7eLq3mTVWfE", // Anything else
  token: "fldFQgrjJoamFVkM1", // Token
  confirmSent: "fldEvJHzDV8eMEQrI", // Confirmation sent
  calAdded: "fldW3v4MRyRheplgs", // Added to calendar
  calVia: "fldqkBypuXRVw2Ud5", // Calendar via
  reminderSent: "fldIAGdBajQ8elKGf", // Reminder sent
  submittedAt: "fldqkdqsXRKkdtutO", // Submitted at
  updatedAt: "fld5YAzvOP5QsW8dB", // Updated at
  firstName: "fldIc3nxc3eamSHer", // First name (formula, read-only; used by the automation emails)
} as const;

// filterByFormula can only reference fields by NAME, so the three lookup
// keys are also listed by name. Renaming one of these columns in Airtable
// breaks lookups (writes and reads stay ID-based and are unaffected).
export const G_NAMES = {
  email: "Email",
  inviteCode: "Invite code",
  token: "Token",
} as const;

export type Rsvp = "Yes" | "No";

export type Guest = {
  id: string;
  name: string;
  email: string;
  org: string;
  note: string;
  inviteCode: string;
  rsvp: Rsvp | "";
  diet: string;
  anything: string;
  token: string;
  confirmSent: boolean;
  calAdded: boolean;
  calVia: string;
  submittedAt: string;
  updatedAt: string;
};

type Cell = unknown;
export type RawGuestRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, Cell>;
};

function str(v: Cell): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "name" in (v as object)) {
    return String((v as { name: unknown }).name);
  }
  return String(v);
}

// Checkbox cells are `true` or absent; tolerate a text "true" too, for the
// interim where the column hasn't been retyped from long text yet.
function bool(v: Cell): boolean {
  return v === true || (typeof v === "string" && /^(true|checked|yes|1)$/i.test(v.trim()));
}

// Normalizes a raw record fetched with returnFieldsByFieldId=true.
export function normalizeGuest(rec: RawGuestRecord): Guest {
  const f = rec.fields;
  const rsvp = str(f[G.rsvp]).trim();
  return {
    id: rec.id,
    name: str(f[G.name]).trim(),
    email: str(f[G.email]).trim(),
    org: str(f[G.org]).trim(),
    note: str(f[G.personalNote]).trim(),
    inviteCode: str(f[G.inviteCode]).trim(),
    rsvp: rsvp === "Yes" || rsvp === "No" ? rsvp : "",
    diet: str(f[G.diet]).trim(),
    anything: str(f[G.anything]).trim(),
    token: str(f[G.token]).trim(),
    confirmSent: bool(f[G.confirmSent]),
    calAdded: bool(f[G.calAdded]),
    calVia: str(f[G.calVia]).trim(),
    submittedAt: str(f[G.submittedAt]).trim(),
    updatedAt: str(f[G.updatedAt]).trim(),
  };
}

// Shapes of the three lookup keys, enforced before anything reaches a
// formula or a URL. Shared by the API route, the page, and the client form.
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  inviteCode: /^[a-z0-9][a-z0-9._-]{0,63}$/i,
  token: /^[a-f0-9]{32}$/,
} as const;

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}
