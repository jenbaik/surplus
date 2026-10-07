"use client";

// Demo Day RSVP form: anyone can fill it in; submitting saves the answer to
// Airtable via POST /api/rsvp.

import { useRef, useState } from "react";
import { CONTACT_EMAIL, ICS_PATH, googleCalendarUrl } from "@/lib/demoday/calendar";
import { PATTERNS, RSVPS, firstName, type Rsvp as Answer } from "@/lib/demoday/fields";
import { BUTTON, BUTTON_SECONDARY, INPUT, LABEL } from "./styles";

// Resolved server-side from ?r=<token>, the edit link in the confirmation
// email: their saved answers.
export type Prefill = {
  name: string;
  email: string;
  rsvp: Answer | "";
  diet: string;
  anything: string;
  token: string;
};

type Done = { rsvp: Answer; first: string; token: string };

export function Rsvp({ prefill }: { prefill: Prefill | null }) {
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [name, setName] = useState(prefill?.name ?? "");
  const [rsvp, setRsvp] = useState<Answer>(prefill?.rsvp || "Yes");
  const [diet, setDiet] = useState(prefill?.diet ?? "");
  const [anything, setAnything] = useState(prefill?.anything ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const token = useRef(prefill?.token ?? "");
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("We need a name for the door.");
      nameRef.current?.focus();
      return;
    }
    if (!PATTERNS.email.test(email.trim())) {
      setError("That email doesn't look right.");
      emailRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsvp,
          name: name.trim(),
          email: email.trim(),
          diet: diet.trim(),
          anything: anything.trim(),
          token: token.current,
          submittedAt: new Date().toISOString(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { token?: string; error?: string };
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      token.current = data.token ?? token.current;
      setDone({ rsvp, first: firstName(name), token: token.current });
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        doneRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
      );
    } catch {
      setError(`Couldn't save that. Try again, or email ${CONTACT_EMAIL}.`);
    } finally {
      setBusy(false);
    }
  }

  // Who actually saved the event — fire-and-forget.
  function savedCalendar(via: "gcal" | "ics") {
    if (!token.current) return;
    fetch("/api/rsvp?action=calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.current, via }),
      keepalive: true,
    }).catch(() => {});
  }

  if (done) {
    const yes = done.rsvp === "Yes";
    const maybe = done.rsvp === "Maybe";
    return (
      <div ref={doneRef} className="border-[3px] border-ink-dark bg-paper px-6 py-6 max-sm:px-4">
        <p className="m-0 font-condensed text-3xl font-bold uppercase leading-none tracking-wide text-ink-dark max-bp:text-2xl">
          {yes ? `${done.first}, you\u2019re in.` : maybe ? `Thanks, ${done.first}.` : "Next time."}
        </p>
        {yes || maybe ? (
          <>
            <p className="mt-3 font-condensed text-xl font-bold uppercase tracking-wide">
              {yes ? "Put it in your calendar" : "Hold the date"}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => savedCalendar("gcal")}
                className={BUTTON_SECONDARY}
              >
                Google Calendar
              </a>
              <a
                href={ICS_PATH}
                download="surplus-demo-day.ics"
                onClick={() => savedCalendar("ics")}
                className={BUTTON_SECONDARY}
              >
                Apple Calendar / Outlook (.ics)
              </a>
            </div>
            {(yes || maybe) && (
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ink-dark/70">
                A confirmation with these links is on its way to your inbox.
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 max-w-[52ch] font-serif text-lg leading-snug">
            Thanks for letting us know. We\u2019ll send you what the cohort built afterwards.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border-[3px] border-ink-dark bg-paper px-6 py-5 max-sm:px-4">
      <div>
        <label htmlFor="rsvp-email" className={LABEL}>
          Email
        </label>
        <input
          ref={emailRef}
          id="rsvp-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-1.5 ${INPUT}`}
        />
      </div>

      <fieldset className="mt-4 border-0 p-0">
        <legend className={LABEL}>Can you make it?</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-3 max-sm:gap-2">
          {RSVPS.map((v) => (
            <label key={v} className="cursor-pointer">
              <input
                type="radio"
                name="rsvp"
                value={v}
                checked={rsvp === v}
                onChange={() => setRsvp(v)}
                className="peer sr-only"
              />
              <span className="block border-2 border-ink-dark bg-paper px-3 py-2 text-center font-condensed text-xl font-bold uppercase tracking-wide hover:bg-paper-deep peer-checked:bg-ink-dark peer-checked:text-paper peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-pink motion-safe:transition-colors">
                {v}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="rsvp-name" className={LABEL}>
          Name
        </label>
        <input
          ref={nameRef}
          id="rsvp-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1.5 ${INPUT}`}
        />
      </div>

      {rsvp !== "No" && (
        <div className="mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div>
            <label htmlFor="rsvp-diet" className={LABEL}>
              Dietary restrictions
            </label>
            <input
              id="rsvp-diet"
              name="diet"
              type="text"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className={`mt-1.5 ${INPUT}`}
            />
          </div>
          <div>
            <label htmlFor="rsvp-anything" className={LABEL}>
              Anything else?
            </label>
            <input
              id="rsvp-anything"
              name="anything"
              type="text"
              value={anything}
              onChange={(e) => setAnything(e.target.value)}
              className={`mt-1.5 ${INPUT}`}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className={BUTTON}>
          {busy ? "Saving…" : rsvp === "No" ? "Send my regrets" : "Save my answer"}
        </button>
        {error && (
          <p role="alert" className="m-0 font-mono text-sm text-ink-red">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
