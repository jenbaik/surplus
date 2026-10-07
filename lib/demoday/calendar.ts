// Surplus Demo Day event facts + calendar link / .ics builders. Imported by
// both the client (Google Calendar link, .ics download) and the API route
// (METHOD:REQUEST invitation attached to the confirmation email), so no
// server-only imports here.

export const EVENT = {
  title: "Surplus Demo Day",
  location: "Mox SF, 4th floor, 1680 Mission St, San Francisco, CA 94103",
  description:
    "The first Surplus cohort presents. Doors 6:00pm, pitches from 6:35pm, dinner & mingling from 7:30pm.",
  url: "https://surplus.dev/demoday",
  // Fri 23 Oct 2026, 6:00pm–11:00pm PT (PDT, UTC-7)
  startUtc: "20261024T010000Z",
  endUtc: "20261024T060000Z",
  uid: "surplus-demo-day-2026@surplus.dev",
} as const;

export const CONTACT_EMAIL = "jen@moxsf.com";

export const PARKING = {
  name: "Chorus Valet Garage",
  url: "https://spothero.com/facility/88833/30-otis-st-parking",
  note: "a 2 min walk away",
} as const;

// Where the static .ics lives (app/demoday/invite.ics/route.ts).
export const ICS_PATH = "/demoday/invite.ics";
export const ICS_URL = `https://surplus.dev${ICS_PATH}`;

export function editUrl(token: string): string {
  return `${EVENT.url}?r=${encodeURIComponent(token)}`;
}

export function googleCalendarUrl(): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT.title,
    dates: `${EVENT.startUtc}/${EVENT.endUtc}`,
    location: EVENT.location,
    details: `${EVENT.description}\n${EVENT.url}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}


// RFC 5545 text escaping + 75-octet line folding.
function icsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let curBytes = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (curBytes + n > limit) {
      out.push(cur);
      cur = ch;
      curBytes = n;
    } else {
      cur += ch;
      curBytes += n;
    }
  }
  out.push(cur);
  return out.join("\r\n ");
}

function stamp(d = new Date()): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function vevent(extra: string[], description: string): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${EVENT.uid}`,
    `DTSTAMP:${stamp()}`,
    `DTSTART:${EVENT.startUtc}`,
    `DTEND:${EVENT.endUtc}`,
    `SUMMARY:${icsText(EVENT.title)}`,
    `LOCATION:${icsText(EVENT.location)}`,
    `DESCRIPTION:${icsText(description)}`,
    `URL:${EVENT.url}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    ...extra,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(`${EVENT.title} today`)}`,
    "END:VALARM",
    "END:VEVENT",
  ];
}

function vcalendar(method: "PUBLISH" | "REQUEST", body: string[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surplus//Demo Day//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    ...body,
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}

// Plain "save this event" file for the download button.
export function icsPublish(): string {
  return vcalendar("PUBLISH", vevent([], `${EVENT.description}\n${EVENT.url}`));
}

// A real invitation: ORGANIZER + ATTENDEE with METHOD:REQUEST is what makes
// Gmail / Outlook render Yes-Maybe-No inline and auto-add the event.
export function icsRequest(opts: {
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
  editLink: string;
}): string {
  const lines = [
    `ORGANIZER;CN=${icsText(opts.organizerName)}:mailto:${opts.organizerEmail}`,
    `ATTENDEE;CN=${icsText(opts.attendeeName || opts.attendeeEmail)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${opts.attendeeEmail}`,
  ];
  return vcalendar(
    "REQUEST",
    vevent(lines, `${EVENT.description}\n\nChange your answer: ${opts.editLink}`)
  );
}
