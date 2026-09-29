// Class strings shared by the server page and the client form. (Kept out of
// rsvp.tsx: everything exported from a "use client" module becomes a client
// reference when imported by a server component.)

// Plain primary button: the review dashboard's flat bordered button at the
// landing page's 3px border weight, in the accent ink.
// Unsized, so a caller can set its own padding / type size (Tailwind's
// stylesheet order, not class order, decides between two size utilities).
export const BUTTON_BASE =
  "inline-block border-[3px] border-ink-dark bg-ink-pink text-center font-condensed font-bold uppercase tracking-wide text-paper no-underline hover:bg-ink-blue focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink-blue disabled:opacity-50 disabled:hover:bg-ink-pink motion-safe:transition-colors motion-safe:duration-150";

export const BUTTON = `${BUTTON_BASE} px-6 py-2 text-xl`;

export const BUTTON_SECONDARY =
  "inline-block border-2 border-ink-dark bg-paper px-4 py-1.5 text-center font-condensed text-lg font-bold uppercase tracking-wide text-ink-dark no-underline hover:bg-ink-yellow focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink-pink motion-safe:transition-colors motion-safe:duration-150";

export const INPUT =
  "w-full border-2 border-ink-dark bg-paper px-3 py-2 font-mono text-base outline-none focus:border-ink-pink";

export const LABEL = "block font-mono text-sm uppercase tracking-widest";

export const MONO_LINK =
  "font-mono text-[11px] uppercase tracking-widest text-ink-blue underline decoration-1 underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-pink";
