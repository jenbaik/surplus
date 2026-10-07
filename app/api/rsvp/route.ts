import { NextRequest } from "next/server";
import { findGuestBy, saveRsvp, updateGuest } from "@/lib/demoday/airtable";
import { sendConfirmation, sendEditLink } from "@/lib/demoday/email";
import { G, PATTERNS, RSVPS, type Rsvp } from "@/lib/demoday/fields";

// Demo Day RSVP: lookup, upsert, calendar beacon, edit-link resend. All
// Airtable access lives here (server-side, AIRTABLE_API_KEY); the page and
// the client form only ever see the whitelisted shapes returned below.

const { email: EMAIL, inviteCode: CODE, token: TOKEN } = PATTERNS;
const CAL_VIA = new Set(["gcal", "ics"]);

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function invitee(g: { name: string; email: string; org: string; note: string }) {
  // Never the token.
  return { name: g.name, email: g.email, org: g.org, note: g.note };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const lookup = q.get("lookup");
  const token = q.get("token");

  try {
    if (lookup != null) {
      const guest = lookup.startsWith("code:")
        ? CODE.test(lookup.slice(5))
          ? await findGuestBy("inviteCode", lookup.slice(5))
          : null
        : EMAIL.test(lookup.trim())
          ? await findGuestBy("email", lookup)
          : null;
      // 404 is the ordinary "not on the list" outcome, not an error.
      if (!guest) return Response.json({ error: "not found" }, { status: 404 });
      return Response.json(invitee(guest));
    }

    if (token != null) {
      const guest = TOKEN.test(token) ? await findGuestBy("token", token) : null;
      if (!guest) return Response.json({ error: "not found" }, { status: 404 });
      const { name, email, org, note, rsvp, diet, anything } = guest;
      return Response.json({ name, email, org, note, rsvp, diet, anything, token: guest.token });
    }

    return Response.json({ error: "lookup or token required" }, { status: 400 });
  } catch (e) {
    console.error("[rsvp GET]", e);
    return Response.json({ error: "lookup failed" }, { status: 500 });
  }
}

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
