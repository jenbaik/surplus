import { icsPublish } from "@/lib/demoday/calendar";

// Static "add to calendar" file for the confirmation email (an Airtable
// automation links here; it can't generate .ics itself) and for anyone who
// wants the event outside Google Calendar.
export function GET() {
  return new Response(icsPublish(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="surplus-demo-day.ics"',
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
