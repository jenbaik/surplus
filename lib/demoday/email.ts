import "server-only";
import {
  CONTACT_EMAIL,
  EVENT,
  ICS_URL,
  PARKING,
  editUrl,
  googleCalendarUrl,
  icsRequest,
} from "@/lib/demoday/calendar";
import { firstName, type Guest } from "@/lib/demoday/fields";

// Confirmation + edit-link emails for Demo Day, via Resend (raw REST, same
// as app/api/review/email/send/route.ts). The sending address must be on a
// domain verified in Resend (DKIM + SPF/MX on the bounce subdomain) or
// Resend rejects the send outright. surplus.dev has no mail DNS yet
// (checked 2026-09-29); until it's added in Resend, set DEMODAY_FROM to an
// address on manifund.org, which is verified. The mailbox itself needn't
// exist — replies go to CONTACT_EMAIL via reply_to. ORGANIZER in the .ics
// is derived from the sender so calendar clients show the invite as
// coming from it.
const FROM = process.env.DEMODAY_FROM || "Surplus <demoday@surplus.dev>";
const RESEND_API = process.env.RESEND_API_URL || "https://api.resend.com";

function parseFrom(from: string): { name: string; email: string } {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1] || "Surplus", email: m[2] } : { name: "Surplus", email: from };
}

async function resend(payload: Record<string, unknown>): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { id?: string; message?: string };
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${data.message ?? JSON.stringify(data).slice(0, 300)}`);
  }
  return data.id ?? "";
}

const WHEN = "Friday, October 23, 2026";
const WHERE = "Mox SF, 4th floor, 1680 Mission St, San Francisco";
const TIMINGS = "Doors open 6:00pm · Introduction by Austin 6:30pm · Founder pitches 6:35pm · Dinner & mingling 7:30pm";

// Sent once, on the first "Yes". Carries the METHOD:REQUEST invitation so
// mail clients treat it as a calendar invite rather than a file.
export async function sendConfirmation(guest: Guest): Promise<string> {
  const from = parseFrom(FROM);
  const link = editUrl(guest.token);
  const ics = icsRequest({
    organizerName: from.name,
    organizerEmail: from.email,
    attendeeName: guest.name,
    attendeeEmail: guest.email,
    editLink: link,
  });
  const first = firstName(guest.name);
  const text = `Hi ${first || "there"},

You're in for ${EVENT.title}.

${WHEN}
${WHERE}
${TIMINGS}

For parking, we recommend the ${PARKING.name} (${PARKING.url}), ${PARKING.note}.

Put it in your calendar now:
- Google Calendar: ${googleCalendarUrl()}
- Apple Calendar / Outlook (.ics): ${ICS_URL}
(The invitation is also attached.)

Need to change your answer? Your link: ${link}

Questions? Reply to this email, or write to ${CONTACT_EMAIL}.`;

  return resend({
    from: FROM,
    to: [guest.email],
    reply_to: CONTACT_EMAIL,
    subject: `${EVENT.title} — ${WHEN}`,
    text,
    attachments: [
      {
        filename: "invite.ics",
        content: Buffer.from(ics, "utf8").toString("base64"),
        content_type: "text/calendar; method=REQUEST; charset=UTF-8",
      },
    ],
  });
}

// "Lost your link" — re-sends the personal edit URL. Callers must not
// reveal whether this was sent (the endpoint always returns 200).
export async function sendEditLink(guest: Guest): Promise<string> {
  if (!guest.token) throw new Error("guest has no token yet");
  const first = firstName(guest.name);
  const text = `Hi ${first || "there"},

Here's your link to change your ${EVENT.title} answer:

${editUrl(guest.token)}

${WHEN} · ${WHERE}
${TIMINGS}

Questions? Reply to this email, or write to ${CONTACT_EMAIL}.

— Austin, Manifund & Mox`;

  return resend({
    from: FROM,
    to: [guest.email],
    reply_to: CONTACT_EMAIL,
    subject: `Your ${EVENT.title} link`,
    text,
  });
}
