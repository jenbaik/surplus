import "server-only";
import {
  APPLICANT_TABLE_ID,
  BASE_ID,
  normalizeApplicant,
  type Applicant,
} from "@/lib/review/fields";

// Overridable so local runs/tests can point at a stand-in server.
const API = process.env.AIRTABLE_API_URL || "https://api.airtable.com/v0";

function headers(): HeadersInit {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) throw new Error("AIRTABLE_API_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

// Low-level authenticated request against the Airtable REST API; shared by
// the review dashboard and the Demo Day RSVP route (lib/demoday/airtable.ts).
export async function airtable(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${API}${path}`, { ...init, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

type RawRecord = { id: string; createdTime: string; fields: Record<string, unknown> };

export async function listApplicants(opts?: {
  view?: string;
  // fetch data-cache TTL (seconds); omit for uncached
  revalidate?: number;
}): Promise<Applicant[]> {
  const records: RawRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({
      returnFieldsByFieldId: "true",
      pageSize: "100",
    });
    if (opts?.view) params.set("view", opts.view);
    if (offset) params.set("offset", offset);
    const page = (await airtable(
      `/${BASE_ID}/${APPLICANT_TABLE_ID}?${params}`,
      opts?.revalidate ? { next: { revalidate: opts.revalidate } } : undefined
    )) as { records: RawRecord[]; offset?: string };
    records.push(...page.records);
    offset = page.offset;
  } while (offset);
  return records.map(normalizeApplicant);
}

export async function getApplicant(id: string): Promise<Applicant> {
  const rec = (await airtable(
    `/${BASE_ID}/${APPLICANT_TABLE_ID}/${id}?returnFieldsByFieldId=true`
  )) as RawRecord;
  return normalizeApplicant(rec);
}

// `fields` keys may be field IDs or field names; values follow Airtable's
// write format (select values as plain name strings, null to clear).
export async function updateApplicant(
  id: string,
  fields: Record<string, unknown>
): Promise<Applicant> {
  // Note: on writes, returnFieldsByFieldId must be in the body (the query
  // param is ignored and fields come back keyed by name).
  const rec = (await airtable(`/${BASE_ID}/${APPLICANT_TABLE_ID}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields, typecast: true, returnFieldsByFieldId: true }),
  })) as RawRecord;
  return normalizeApplicant(rec);
}

// Returns { recordId: value } for a single field, referenced by field NAME
// (used to check which applicants already have an "<label> prio" grade).
export async function listFieldValues(
  fieldName: string
): Promise<Record<string, unknown>> {
  const values: Record<string, unknown> = {};
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    params.append("fields[]", fieldName);
    if (offset) params.set("offset", offset);
    const page = (await airtable(
      `/${BASE_ID}/${APPLICANT_TABLE_ID}?${params}`
    )) as { records: RawRecord[]; offset?: string };
    for (const rec of page.records) values[rec.id] = rec.fields[fieldName];
    offset = page.offset;
  } while (offset);
  return values;
}

// --- Meta API: used by the AI pipeline to create result fields on demand ---

type MetaField = { id: string; name: string; type: string };

export async function listFieldNames(): Promise<Set<string>> {
  const meta = (await airtable(`/meta/bases/${BASE_ID}/tables`)) as {
    tables: { id: string; fields: MetaField[] }[];
  };
  const table = meta.tables.find((t) => t.id === APPLICANT_TABLE_ID);
  return new Set((table?.fields ?? []).map((f) => f.name));
}

export async function createField(field: {
  name: string;
  type: string;
  options?: Record<string, unknown>;
}): Promise<void> {
  await airtable(`/meta/bases/${BASE_ID}/tables/${APPLICANT_TABLE_ID}/fields`, {
    method: "POST",
    body: JSON.stringify(field),
  });
}

// Ensures "<label> prio" (number) and "<label> notes" (long text) exist.
export async function ensureAiFields(label: string): Promise<{
  prioField: string;
  notesField: string;
}> {
  const prioField = `${label} prio`;
  const notesField = `${label} notes`;
  const existing = await listFieldNames();
  if (!existing.has(prioField)) {
    await createField({ name: prioField, type: "number", options: { precision: 1 } });
  }
  if (!existing.has(notesField)) {
    await createField({ name: notesField, type: "multilineText" });
  }
  return { prioField, notesField };
}
