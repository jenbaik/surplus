import "server-only";
import { randomBytes } from "node:crypto";
import { airtable } from "@/lib/review/airtable";
import { BASE_ID } from "@/lib/review/fields";
import {
  DEMODAY_TABLE_ID,
  G,
  G_NAMES,
  normalizeGuest,
  type Guest,
  type RawGuestRecord,
  type Rsvp,
} from "@/lib/demoday/fields";

const TABLE = `/${BASE_ID}/${DEMODAY_TABLE_ID}`;

// Airtable formula string literal: double-quoted, with backslash and quote
// escaped. Callers also validate the shape of each key (see the route), so
// the only user-controlled characters that reach a formula are inside a
// properly escaped literal.
function lit(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

type LookupKey = "email" | "inviteCode" | "token";

// Finds one guest by email (case-insensitive), invite code, or token.
export async function findGuestBy(key: LookupKey, value: string): Promise<Guest | null> {
  const v = value.trim();
  if (!v) return null;
  const formula =
    key === "email"
      ? `LOWER({${G_NAMES.email}}) = ${lit(v.toLowerCase())}`
      : `{${G_NAMES[key]}} = ${lit(v)}`;
  const params = new URLSearchParams({
    filterByFormula: formula,
    maxRecords: "1",
    returnFieldsByFieldId: "true",
  });
  const page = (await airtable(`${TABLE}?${params}`)) as { records: RawGuestRecord[] };
  const rec = page.records[0];
  return rec ? normalizeGuest(rec) : null;
}

export async function updateGuest(id: string, fields: Record<string, unknown>): Promise<Guest> {
  // On writes, returnFieldsByFieldId goes in the body (see lib/review/airtable.ts).
  const rec = (await airtable(`${TABLE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields, typecast: true, returnFieldsByFieldId: true }),
  })) as RawGuestRecord;
  return normalizeGuest(rec);
}

async function createGuest(fields: Record<string, unknown>): Promise<Guest> {
  const rec = (await airtable(TABLE, {
    method: "POST",
    body: JSON.stringify({ fields, typecast: true, returnFieldsByFieldId: true }),
  })) as RawGuestRecord;
  return normalizeGuest(rec);
}

export function newToken(): string {
  return randomBytes(16).toString("hex");
}

export type RsvpInput = {
  rsvp: Rsvp;
  name: string;
  email: string;
  diet: string;
  anything: string;
  inviteCode: string;
  token: string;
};

// Upsert: match on Token if present, else Email. A pre-loaded invitee row
// (no Token yet) gets one on first submit; a stranger gets a fresh row.
// Only text-compatible values are written here, so the RSVP itself lands
// even while the checkbox/date columns are still long text.
export async function saveRsvp(input: RsvpInput): Promise<{ guest: Guest; created: boolean }> {
  const now = new Date().toISOString();
  const existing =
    (input.token ? await findGuestBy("token", input.token) : null) ??
    (await findGuestBy("email", input.email));

  const fields: Record<string, unknown> = {
    [G.rsvp]: input.rsvp,
    [G.name]: input.name,
    [G.diet]: input.diet,
    [G.anything]: input.anything,
    [G.updatedAt]: now,
  };
  // Don't churn the address we invited them at over a casing difference.
  if (!existing || existing.email.toLowerCase() !== input.email.toLowerCase()) {
    fields[G.email] = input.email;
  }

  if (existing) {
    if (!existing.token) fields[G.token] = newToken();
    if (!existing.submittedAt) fields[G.submittedAt] = now;
    return { guest: await updateGuest(existing.id, fields), created: false };
  }

  fields[G.token] = newToken();
  fields[G.submittedAt] = now;
  if (input.inviteCode) fields[G.inviteCode] = input.inviteCode;
  return { guest: await createGuest(fields), created: true };
}
