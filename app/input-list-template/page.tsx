import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appUrl } from "../_templates/config";
import { PageviewBeacon } from "../_templates/beacon";
import { FaqJsonLd, FaqList, type Faq } from "../_templates/faq";
import { DownloadButton } from "../_templates/tracked-download";
import {
  A,
  H2,
  P,
  Section,
  Strong,
  TemplateFooter,
  TemplateHeader,
  TemplatePreview,
} from "../_templates/ui";

const title = "Free Input List Template for Bands (Channel List PDF)";
const description =
  "A free input list template for bands: a printable 24-row channel list in US Letter and A4, a CSV for Google Sheets and Excel, and a filled-in example.";

const PATH = "/input-list-template";
const CANONICAL = appUrl(PATH);

const US_LETTER = "/downloads/input-list-template-us-letter.pdf";
const A4 = "/downloads/input-list-template-a4.pdf";
const CSV = "/downloads/input-list-template.csv";

const PREVIEW_ALT =
  "The blank input list template: a header block for band, venue, date and contact above a 24-row table with columns for channel number, instrument or source, mic or DI, stand, position on stage and notes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    siteName: "StagePlot Pro",
    title,
    description,
    url: CANONICAL,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

// The FAQ copy lives here, once. The page renders it and the FAQPage JSON-LD is
// generated from the same parts, so the structured data and the visible answer
// are the same words by construction.
const faqs: Faq[] = [
  {
    q: "What's the difference between an input list, a channel list and a patch list?",
    a: [
      "In practice, nothing. \u201cInput list\u201d and \u201cchannel list\u201d are the same document under two names, and \u201cpatch list\u201d usually means the same thing — the numbered list of what goes into which channel. Send whichever name they asked for.",
    ],
  },
  {
    q: "Should the lead vocal be channel 1, or should the drums?",
    a: [
      "Either works. Drums-first follows the stage from the back and keeps instrument groups together; vocals-first puts the faders the engineer touches most at the near end of the desk. Pick one, keep it, and write the order you used on the list so nobody has to infer it.",
    ],
  },
  {
    q: "How many channels should the template have?",
    a: [
      "The file gives you 24 numbered rows, which covers a five-piece with a fully mic'd kit and a few spares. If you play bigger bills, print a second copy and keep numbering — don't cram two people into one row.",
    ],
  },
  {
    q: "Do I need to list every drum mic separately?",
    a: [
      "If you want them mic'd separately, yes. One row per input is what lets the engineer patch the desk before you arrive. \u201cDrum kit\u201d as a single line is what you write when you're bringing your own engineer and the house desk isn't involved.",
    ],
  },
  {
    q: "What goes in the notes column?",
    a: [
      "Only things that change what the engineer does: phantom power, in-ears, a click or backing tracks, an unusual instrument, or a spare mic you'd like left open. It's not the place for song titles or requests about the lighting.",
    ],
  },
  {
    q: "Can I open the CSV in Google Sheets or Excel?",
    a: [
      "Yes — it's a plain CSV with the same headers and the same 24 numbered rows as the PDF, and it imports cleanly into both. The PDFs are the ones to print; the CSV is the one to type into.",
    ],
  },
];

// The same 16 channels as the worked example on /stage-plot-template, plus the
// labelled spare at 17. If one page's example changes, this one changes with it:
// the agreement between the two is the whole point the copy makes.
const example: [number, string, string, string, string, string][] = [
  [1, "Kick", "Beta 91A", "—", "Centre, on riser", "Inside the drum"],
  [2, "Snare top", "SM57", "yes", "Centre, on riser", ""],
  [3, "Snare bottom", "SM57", "yes", "Centre, on riser", ""],
  [4, "Hi-hat", "SM81", "yes", "Centre, on riser", "Phantom"],
  [5, "Rack tom", "e604", "clip", "Centre, on riser", ""],
  [6, "Floor tom", "e604", "clip", "Centre, on riser", ""],
  [7, "Overhead L", "KSM137", "yes", "Above the kit", "Phantom"],
  [8, "Overhead R", "KSM137", "yes", "Above the kit", "Phantom"],
  [9, "Bass amp", "e609", "yes", "Stage right", ""],
  [10, "Guitar 1 amp", "e609", "yes", "Stage left", ""],
  [11, "Guitar 2 amp", "SM57", "yes", "Stage right", ""],
  [12, "Keys L", "DI", "—", "Stage left", "Phantom"],
  [13, "Keys R", "DI", "—", "Stage left", "Phantom"],
  [14, "Lead vocal", "SM58", "yes", "Centre front", ""],
  [15, "Backing vocal", "SM58", "yes", "Stage left front", ""],
  [16, "Backing vocal", "SM58", "yes", "Stage right front", ""],
  [17, "Spare", "", "", "", "For the click / tracks laptop"],
];

const columns: { label: string; key: string }[] = [
  { label: "Ch", key: "ch" },
  { label: "Instrument / source", key: "src" },
  { label: "Mic or DI", key: "mic" },
  { label: "Stand?", key: "stand" },
  { label: "Where on stage", key: "where" },
  { label: "Notes", key: "notes" },
];

const rowNotes: { title: string; body: ReactNode }[] = [
  {
    title: "The drum kit is broken out.",
    body: (
      <>
        &ldquo;Drum kit, 8 channels&rdquo; tells the engineer nothing about
        whether you want the hats mic&rsquo;d. Eight separate rows tells them
        exactly what to put up.
      </>
    ),
  },
  {
    title: "Phantom power is flagged on the rows that need it",
    body: (
      <>
        {" "}
        — hi-hat, overheads, keys DIs. That&rsquo;s the note that stops a
        condenser being plugged into a channel with phantom switched off.
      </>
    ),
  },
  {
    title: "The spare at 17 is labelled with what it's for.",
    body: (
      <>
        An unlabelled spare gets used for something else, and then the laptop has
        nowhere to go.
      </>
    ),
  },
];

export default function InputListTemplatePage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <FaqJsonLd canonical={CANONICAL} faqs={faqs} />
      <PageviewBeacon path={PATH} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <TemplateHeader />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <section className="border-b border-slate-800 bg-[radial-gradient(120%_100%_at_50%_0%,#1e293b_0%,#020617_60%)]">
          <div className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
            <nav aria-label="Breadcrumb" className="text-[13px] text-slate-400">
              <a href="/" className="transition hover:text-indigo-300">
                StagePlot Pro
              </a>
              <span aria-hidden> / </span>
              <span className="text-slate-300">Input list template</span>
            </nav>

            <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-slate-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
                  Free PDF + CSV · no email, no sign-up
                </p>

                <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl">
                  Free Input List Template for Bands
                </h1>

                <p className="mt-5 text-[15.5px] leading-relaxed text-slate-300 sm:text-[17px]">
                  An input list is the numbered list of everything going into the
                  mixing desk — one row per input, in the order the engineer
                  should patch them. Some people call it a channel list, some call
                  it a patch list; it&rsquo;s the same document.
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed text-slate-300 sm:text-[17px]">
                  This one is free, printable, and 24 rows long: US Letter and A4
                  PDFs for a clipboard, plus a CSV of the same table if you&rsquo;d
                  rather keep it in Google Sheets or Excel. Page two of each PDF
                  is a filled-in 16-channel example so you can see the level of
                  detail that&rsquo;s actually useful.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
                  <DownloadButton href={US_LETTER}>
                    Download — US Letter (PDF)
                  </DownloadButton>
                  <DownloadButton href={A4} tone="quiet">
                    Download — A4 (PDF)
                  </DownloadButton>
                  <DownloadButton href={CSV} tone="quiet">
                    Download — CSV (Sheets / Excel)
                  </DownloadButton>
                </div>

                <p className="mt-4 text-[13px] text-slate-400">
                  No email, no sign-up. Print it, or open the CSV and type.
                </p>
              </div>

              <div className="lg:sticky lg:top-24">
                <TemplatePreview
                  slug="input-list-template"
                  alt={PREVIEW_ALT}
                />
                <p className="mt-3 text-center text-[12.5px] text-slate-400">
                  Page 1 of the PDF, actual size.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section>
          <H2>What&rsquo;s in the template</H2>
          <P>
            Six columns, 24 rows, and a header block. Nothing else, because the
            list has to be readable across a dark stage.
          </P>
          <P>
            <Strong>The header:</Strong> band, venue, date, a contact name and
            phone number, how many channels you&rsquo;re using, and a box to tick
            if a stage plot is attached. That last one matters — an input list
            without a plot leaves the engineer guessing where the players actually
            stand.
          </P>
          <P>
            <Strong>The rows:</Strong> channel numbers are{" "}
            <Strong>pre-printed 1 to 24</Strong>, so nobody has to number by hand
            and the order can&rsquo;t drift between the version you sent last week
            and the one you send this week. The six columns are:
          </P>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            {[
              ["Ch", "— the channel number, already printed."],
              [
                "Instrument / source",
                "— what's making the sound: \u201ckick\u201d, \u201cbass amp\u201d, \u201clead vocal\u201d.",
              ],
              [
                "Mic or DI",
                "— what you want in front of it, or \u201cDI\u201d if it goes straight in. Leave it blank if you genuinely don't mind.",
              ],
              ["Stand?", "— a tick box. Small column, saves an argument."],
              [
                "Where on stage",
                "— two or three words. \u201cStage left\u201d, \u201ccentre, on riser\u201d.",
              ],
              [
                "Notes",
                "— anything conditional: phantom power, in-ears, click, \u201cspare vocal mic, please\u201d.",
              ],
            ].map(([term, rest]) => (
              <li key={term} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
                />
                <span>
                  <Strong>{term}</Strong> {rest}
                </span>
              </li>
            ))}
          </ul>
          <P>
            <Strong>The CSV</Strong> is the same table with the same headers and
            the same 24 pre-numbered rows, so you can open it in Google Sheets or
            Excel and type instead of writing.
          </P>
        </Section>

        <Section>
          <H2>How to number your channels</H2>
          <P>
            There&rsquo;s no universal standard here, and anyone who tells you
            there is has only worked in one kind of room. Two orders are common:
          </P>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
              />
              <span>
                <Strong>Drums first</Strong>, then bass, guitars, keys, and vocals
                last. This follows the stage from the back and keeps instrument
                groups together, which makes a long list easy to scan.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
              />
              <span>
                <Strong>Vocals first</Strong> — lead vocal on channel 1 — because
                the vocal faders are the ones the engineer touches most, and
                it&rsquo;s nice to have them at the near end of the desk.
              </span>
            </li>
          </ul>
          <P>
            Either is fine. What matters is that you{" "}
            <Strong>pick one and keep it</Strong>, and that you say which one you
            used on the list itself. A band that renumbers between shows is a band
            whose plots and lists stop matching, and that costs more time than the
            ordering ever saves.
          </P>
          <P>Two more habits worth having:</P>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
              />
              <span>
                <Strong>Keep groups together.</Strong> If the drums are 1–8,
                don&rsquo;t put the bass at 5.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
              />
              <span>
                <Strong>Leave your spares at the end.</Strong> Unused rows stay
                blank and numbered. Don&rsquo;t delete them — the numbering is the
                useful part.
              </span>
            </li>
          </ul>
          <P>
            Some engineers will re-patch to their own convention on the day.
            That&rsquo;s normal and fine. The list is a starting point that saves
            them a conversation, not a contract.
          </P>
        </Section>

        <Section>
          <H2>A filled-in example</H2>
          <P>
            Here&rsquo;s a complete 16-channel list for a five-piece: drums, bass,
            two guitars, keys and three vocals. It&rsquo;s the same band as the{" "}
            <A href="/stage-plot-template">stage plot template</A> example, with
            the same channel numbers — which is the point.
          </P>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[42rem] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="bg-slate-900 text-[11.5px] tracking-[0.1em] text-slate-400 uppercase">
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className="px-3 py-3 font-semibold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {example.map(([ch, source, mic, stand, where, notes]) => (
                  <tr key={ch}>
                    <td className="px-3 py-2.5 font-mono text-[12.5px] text-indigo-300">
                      {ch}
                    </td>
                    <td className="px-3 py-2.5 text-slate-200">{source}</td>
                    <td className="px-3 py-2.5 text-slate-400">{mic}</td>
                    <td className="px-3 py-2.5 text-slate-400">{stand}</td>
                    <td className="px-3 py-2.5 text-slate-400">{where}</td>
                    <td className="px-3 py-2.5 text-slate-400">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <P>Three things that make this list better than a list of names:</P>
          <ol className="mt-4 space-y-4">
            {rowNotes.map((note, i) => (
              <li key={note.title} className="flex gap-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 font-mono text-[12px] font-semibold text-indigo-300">
                  {i + 1}
                </span>
                <p className="text-[15.5px] leading-relaxed text-slate-300">
                  <Strong>{note.title}</Strong>
                  {note.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section>
          <H2>Input list, channel list, patch list — same thing?</H2>
          <P>
            Yes, in practice. &ldquo;Input list&rdquo; and &ldquo;channel
            list&rdquo; are used interchangeably, and &ldquo;patch list&rdquo;
            usually means the same document, though it can also mean the
            engineer&rsquo;s own sheet of what&rsquo;s plugged where. If someone
            asks you for your patch list, send them this.
          </P>
          <P>
            What it is <em>not</em> is a{" "}
            <A href="/stage-plot-template">stage plot</A>. The plot is the picture
            of where everyone stands; the list is what plugs into what. Engineers
            want both, and they want the numbers on one to match the other — which
            is exactly why both templates here use the same 16-channel example.
          </P>
        </Section>

        <Section>
          <H2>If you&rsquo;d rather not type it out</H2>
          <P>
            The template is a table you fill in by hand. If you&rsquo;d rather not,{" "}
            <A href="/">StagePlot Pro</A> does the bookkeeping for you: you drag
            the gear onto a stage layout, and each item appends itself to the
            channel list as you add it — numbered, in order, ready to export as a
            PDF alongside the plot.
          </P>
          <P>
            It&rsquo;s free and needs no account. The free export carries a small
            &ldquo;Made with StagePlot Pro&rdquo; line at the foot of the page;
            Pro is $9 once and removes it. Either way you get a plot and a channel
            list that already agree with each other, which is the problem this
            page is trying to solve.
          </P>
          <div className="mt-7">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              Build your plot and channel list — free <span aria-hidden>→</span>
            </a>
          </div>
        </Section>

        <Section>
          <H2>Before you send it</H2>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            {[
              "The channel numbers match your stage plot. Check them side by side, not from memory.",
              "A contact name and a phone number that gets answered are on it.",
              "Phantom power is flagged wherever a condenser or a DI needs it.",
              "Anything unusual is in the notes: in-ears, a click, backing tracks, a horn player who only plays two songs.",
              "You've said whether a stage plot is attached — and then actually attached it.",
              "Unused channels are still numbered, so the list can be read against a desk that has more inputs than you're using.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 size-4 shrink-0 text-emerald-400"
                >
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <H2>Frequently asked questions</H2>
          <FaqList faqs={faqs} />
        </Section>

        <section className="border-t border-slate-800 bg-[radial-gradient(120%_100%_at_50%_100%,#1e293b_0%,#020617_60%)]">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
            <H2>Two templates, one set of numbers</H2>
            <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-slate-300">
              The input list and the{" "}
              <A href="/stage-plot-template">stage plot</A> only work if they
              agree. Print both, fill them in from the same channel plan, and send
              them to the venue as a pair.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <DownloadButton href={US_LETTER}>
                Download — US Letter (PDF)
              </DownloadButton>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-[15px] font-bold text-slate-100 transition hover:bg-slate-800"
              >
                Build it in StagePlot Pro — free <span aria-hidden>→</span>
              </a>
            </div>
            <p className="mt-4 text-[13px] text-slate-400">
              A4 version: <A href={A4}>download</A> · CSV for Sheets or Excel:{" "}
              <A href={CSV}>download</A>
            </p>
          </div>
        </section>
      </main>

      <TemplateFooter />
    </div>
  );
}
