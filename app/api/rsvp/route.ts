import { NextRequest } from "next/server";
import { findGuestBy, saveRsvp, updateGuest } from "@/lib/demoday/airtable";
import { sendConfirmation, sendEditLink } from "@/lib/demoday/email";
import { G, PATTERNS, RSVPS, type Rsvp } from "@/lib/demoday/fields";

// Demo Day RSVP: upsert, calendar beacon, edit-link resend. All Airtable
// writes from the page go through here (server-side, AIRTABLE_API_KEY). There
// is no GET: guest data (names, personal notes) is never readable over HTTP.

const { email: EMAIL, inviteCode: CODE, token: TOKEN } = PATTERNS;
const CAL_VIA = new Set(["gcal", "ics"]);

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "JSON body required" }, { status: 400 });
  }

  // Beacon: who actually saved the event. Always 200.
  if (action === "calendar") {
    const token = s(body.token, 64);
    const via = s(body.via, 8);
    if (TOKEN.test(token) && CAL_VIA.has(via)) {
      try {
        const guest = await findGuestBy("token", token);
        if (guest) await updateGuest(guest.id, { [G.calAdded]: true, [G.calVia]: via });
      } catch (e) {
        console.error("[rsvp calendar]", e);
      }
    }
    return Response.json({ ok: true });
  }

  // Lost-link resend. Identical response whether or not the address is on
  // the list, so this can't be used to probe the guest list.
  if (action === "resend") {
    const email = s(body.email, 254);
    if (EMAIL.test(email)) {
      try {
        const guest = await findGuestBy("email", email);
        if (guest?.token) await sendEditLink(guest);
      } catch (e) {
        console.error("[rsvp resend]", e);
      }
    }
    return Response.json({ ok: true });
  }

  // The RSVP itself.
  const rsvp = RSVPS.find((r) => r === body.rsvp) ?? null;
  const name = s(body.name, 200);
  const email = s(body.email, 254);
  if (!rsvp) return Response.json({ error: "rsvp must be Yes, Maybe or No" }, { status: 400 });
  if (!name) return Response.json({ error: "name required" }, { status: 400 });
  if (!EMAIL.test(email)) return Response.json({ error: "valid email required" }, { status: 400 });
  const inviteCode = s(body.inviteCode, 64);
  const token = s(body.token, 64);

  try {
    const { guest, created } = await saveRsvp({
      rsvp: rsvp as Rsvp,
      name,
      email,
      // A "No" carries no logistics.
      diet: rsvp === "No" ? "" : s(body.diet, 500),
      anything: rsvp === "No" ? "" : s(body.anything, 2000),
      inviteCode: CODE.test(inviteCode) ? inviteCode : "",
      token: TOKEN.test(token) ? token : "",
    });

    // Confirmation email. By default the Airtable automation on the Demo
    // Day table sends it (from Jen's Gmail, when RSVP flips to Yes) and
    // ticks "Confirmation sent". DEMODAY_SEND_CONFIRMATION=true switches to
    // sending from here via Resend with a METHOD:REQUEST invite instead —
    // needs a verified sending domain. Either way a failed send must not
    // fail the RSVP: the row is already saved and the box stays unticked.
    let emailed = false;
    if (process.env.DEMODAY_SEND_CONFIRMATION === "true" && rsvp === "Yes" && !guest.confirmSent) {
      try {
        await sendConfirmation(guest);
        emailed = true;
        await updateGuest(guest.id, { [G.confirmSent]: true });
      } catch (e) {
        console.error("[rsvp confirmation]", e);
      }
    }

    return Response.json({ ok: true, token: guest.token, name: guest.name, created, emailed });
  } catch (e) {
    console.error("[rsvp POST]", e);
    return Response.json({ error: "couldn't save your answer" }, { status: 500 });
  }
}
