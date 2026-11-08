import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appUrl } from "../_templates/config";
import { PageviewBeacon } from "../_templates/beacon";
import { FaqJsonLd, FaqList, type Faq } from "../_templates/faq";
import { DownloadButton } from "../_templates/tracked-download";
import {
  A,
  Card,
  H2,
  H3,
  P,
  Section,
  Strong,
  TemplateFooter,
  TemplateHeader,
  TemplatePreview,
} from "../_templates/ui";

const title = "Free Stage Plot Template for Bands (PDF, Printable)";
const description =
  "A free blank stage plot template you can print and fill in by hand — US Letter and A4, plus a filled-in example of what the venue's sound engineer needs.";

const PATH = "/stage-plot-template";
const CANONICAL = appUrl(PATH);

const US_LETTER = "/downloads/stage-plot-template-us-letter.pdf";
const A4 = "/downloads/stage-plot-template-a4.pdf";

const PREVIEW_ALT =
  "The blank stage plot template: a header of band and contact fields above a gridded stage diagram with stage right and stage left labelled and the audience marked along the bottom edge.";

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
// are the same words by construction — never retype these into the markup.
const faqs: Faq[] = [
  {
    q: "What is a stage plot?",
    a: [
      "A one-page diagram of your band on stage: where each person and piece of gear sits, which channel each thing goes into, and what the venue needs to provide. It's usually sent to the venue ahead of the show so the sound engineer can plan the patch and the stage before load-in.",
    ],
  },
  {
    q: "Is the template really free?",
    a: [
      "Yes. Both PDFs download directly — no email address, no account, no sign-up. Print as many copies as you like and give them to whoever needs one.",
    ],
  },
  {
    q: "Can I print it at home?",
    a: [
      "That's what it's for. It's black and white, vector, and sized to fit a normal printer's margins in both US Letter and A4, so nothing important gets clipped.",
    ],
  },
  {
    q: "Can I type into the PDF instead of printing it?",
    a: [
      "Not this one — it's a print-and-fill form, and the fields are lines to write on rather than text boxes. If you want to type it, ",
      { text: "build it in the app", href: "/" },
      " instead: it's free, and it gives you a finished PDF without any handwriting.",
    ],
  },
  {
    q: "Do I need a stage plot for a small venue or an open mic?",
    a: [
      "Often not. A pub gig with an engineer who has worked the room a hundred times doesn't need one. Where a plot earns its keep: festivals, multi-band bills, venues you haven't played before, and anywhere changeover is on a clock and nobody wants to spend it asking questions.",
    ],
  },
  {
    q: "What's the difference between a stage plot and an input list?",
    a: [
      "A stage plot is the picture of where everyone stands. An input list is the channel-by-channel list of what plugs into what. Most engineers want both, and they want the numbers to agree. There's a ",
      { text: "free input list template", href: "/input-list-template" },
      " here too — the worked example on it uses the same 16 channels as the example above.",
    ],
  },
];

const channels: [string, string, string][] = [
  [
    "1–8",
    "Drum kit, mic'd individually (kick, snare top and bottom, hi-hat, two toms, two overheads)",
    "Centre upstage, on the riser",
  ],
  ["9", "Bass amp", "Stage right"],
  ["10", "Guitar 1 amp", "Stage left"],
  ["11", "Guitar 2 amp", "Stage right"],
  ["12–13", "Keys, stereo DI", "Stage left"],
  ["14", "Lead vocal", "Centre front"],
  ["15", "Backing vocal", "Stage left front"],
  ["16", "Backing vocal", "Stage right front"],
];

const diagram = `                        A U D I E N C E   /   F O H
        STAGE RIGHT                                           STAGE LEFT
        (house left)                                          (house right)

   ┌──────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │        [Bass amp 9]        ┌──────────────┐                      │
   │                            │   DRUMS      │                      │
   │        (Sam, bass)         │   1 – 8      │      [Gtr 1 amp 10]  │
   │                            │  on 8×8      │                      │
   │                            │  riser       │      (Gtr 1: Alex)   │
   │   [Gtr 2 amp 11]           └──────────────┘                      │
   │                                                                  │
   │   (Gtr 2: Priya)                                  [Keys 12–13]   │
   │                                                   (Mo)           │
   │      ● Vox 16          ● Vox 14          ● Vox 15                │
   │      (Sam)             (Jo, lead)        (Alex)                  │
   └──────────────────────────────────────────────────────────────────┘
                    ▲ POWER ×2            ▲ POWER ×1        ▲ POWER ×1`;

const steps: { title: string; body: ReactNode }[] = [
  {
    title: "Start with the drums.",
    body: (
      <>
        Put the kit centre-upstage — on the riser if the venue has one, on the
        grid if it doesn&rsquo;t. Everything else is positioned relative to the
        kit, so it goes down first.
      </>
    ),
  },
  {
    title: "Place the amps and keys where they actually stand,",
    body: (
      <>
        not where you&rsquo;d like them to stand in an ideal room. The plot is a
        description, not a wish list. If the guitar amp is always jammed against
        the wall on stage left, draw it there.
      </>
    ),
  },
  {
    title: "Mark the singers.",
    body: (
      <>
        Lead vocal centre front where the engineer can hear them, backing vocals
        wherever those people also play an instrument.
      </>
    ),
  },
  {
    title: "Number as you go.",
    body: (
      <>
        Every mark gets a channel number, and those numbers must match your input
        list exactly. If your plot says channel 4, your{" "}
        <A href="/input-list-template">input list</A> says channel 4. Mismatched
        numbers are the single most common way a plot causes confusion instead of
        preventing it.
      </>
    ),
  },
  {
    title: "Fill the notes box last,",
    body: <>once the drawing has told you what the questions are.</>,
  },
];

export default function StagePlotTemplatePage() {
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
        {/* Hero + download */}
        <section className="border-b border-slate-800 bg-[radial-gradient(120%_100%_at_50%_0%,#1e293b_0%,#020617_60%)]">
          <div className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
            <nav aria-label="Breadcrumb" className="text-[13px] text-slate-400">
              <a href="/" className="transition hover:text-indigo-300">
                StagePlot Pro
              </a>
              <span aria-hidden> / </span>
              <span className="text-slate-300">Stage plot template</span>
            </nav>

            <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-slate-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
                  Free PDF · no email, no sign-up
                </p>

                <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl">
                  Free Stage Plot Template for Bands
                </h1>

                <p className="mt-5 text-[15.5px] leading-relaxed text-slate-300 sm:text-[17px]">
                  A stage plot is the map of your stage that the venue&rsquo;s
                  sound engineer reads before you load in: who stands where, what
                  plugs into which channel, and what you&rsquo;re bringing with
                  you. This template is a blank one you can print and fill in by
                  hand. US Letter and A4, black and white, two pages — page one
                  is the blank form, page two is the same form filled in for a
                  five-piece band so you can see what a finished one looks like.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
                  <DownloadButton href={US_LETTER}>
                    Download the template — US Letter (PDF)
                  </DownloadButton>
                  <DownloadButton href={A4} tone="quiet">
                    Download the template — A4 (PDF)
                  </DownloadButton>
                </div>

                <p className="mt-4 text-[13px] text-slate-400">
                  No email, no sign-up. Two pages, black and white, prints on any
                  home printer.
                </p>
              </div>

              <div className="lg:sticky lg:top-24">
                <TemplatePreview slug="stage-plot-template" alt={PREVIEW_ALT} />
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
            Three parts: a header, the stage itself, and a notes box. That&rsquo;s
            the whole document — a plot doesn&rsquo;t need to be more complicated
            than that, and a one-page version is much likelier to get read.
          </P>

          <H3>The header</H3>
          <P>
            Nine fields across the top: band name, contact name, phone, email,
            venue, date of show, set time, load-in time, and how many people are
            on stage.
          </P>
          <P>
            The phone number matters more than the rest. It&rsquo;s the one the
            engineer calls when the drum riser doesn&rsquo;t fit through the door.
          </P>

          <H3>The stage area</H3>
          <P>
            A gridded rectangle with the audience marked along the bottom edge.
            The side edges are labelled stage right and stage left from the
            performer&rsquo;s point of view, not the audience&rsquo;s. There&rsquo;s
            a dashed drum riser you can use or ignore, plus markers for power
            drops and DI boxes so you don&rsquo;t have to invent your own symbols.
          </P>
          <P>
            Every person and every piece of gear gets a mark on the grid, with its
            channel number written next to it.
          </P>

          <H3>The notes box</H3>
          <P>
            Six lines and four prompts: power needs, what backline you&rsquo;re
            bringing, whether you use in-ears, a click or backing tracks, and
            whether your drums are acoustic or electronic.
          </P>
          <P>
            This is the part that turns a drawing into something useful. It&rsquo;s
            where you answer the questions the engineer would otherwise have to
            ask you at load-in, when nobody has time.
          </P>
        </Section>

        <Section>
          <H2>How to fill it in</H2>
          <ol className="mt-6 space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 font-mono text-[12px] font-semibold text-indigo-300">
                  {i + 1}
                </span>
                <p className="text-[15.5px] leading-relaxed text-slate-300">
                  <Strong>{step.title}</Strong> {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section>
          <H2>
            Stage left or house left? Draw it the way the engineer reads it
          </H2>
          <P>
            Stage right and stage left belong to the performer, not the audience.
            On a plot drawn with the audience at the bottom of the page, that
            means stage right sits on the <Strong>left-hand</Strong> side of the
            paper and stage left on the <Strong>right-hand</Strong> side.
          </P>
          <P>
            It looks backwards the first time. It isn&rsquo;t: the band is facing
            the audience, so the band&rsquo;s left hand points at the right side
            of the page.
          </P>
          <P>
            Why it matters: a mirrored plot puts the guitar amp on the wrong side,
            and the engineer spends the first ten minutes of changeover working
            out which way round the drawing is. If you&rsquo;re ever unsure, write
            the words on the plot — <em>stage right</em>, <em>stage left</em>,{" "}
            <em>audience this way</em> — rather than trusting a bare arrow.
          </P>
        </Section>

        <Section>
          <H2>What the sound engineer actually looks at</H2>
          <P>In roughly this order:</P>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            {[
              [
                "Positions.",
                "Who is where, and whether the kit is on a riser. This decides where the mics, wedges and power go before you've even arrived.",
              ],
              [
                "Channel numbers.",
                "They patch the desk from these. A plot with positions but no numbers means they have to write your input list for you.",
              ],
              [
                "Power.",
                "Where you need a socket, and how many. Marking two drops behind the drums and one for the keys saves a hunt for extension leads.",
              ],
              [
                "What you're bringing.",
                "The most common surprise at load-in is a band that expected a house drum kit. Say what's yours.",
              ],
            ].map(([lead, rest]) => (
              <li key={lead} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400"
                />
                <span>
                  <Strong>{lead}</Strong> {rest}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <H2>A filled-in example</H2>
          <P>
            Page two of the PDF is this plot filled in for{" "}
            <Strong>Night Shift</Strong>, a made-up five-piece — drums, bass, two
            guitars, keys and three vocals. Here&rsquo;s the same thing in text,
            so you can see the shape of it before you download anything:
          </P>

          <Card>
            <div className="overflow-x-auto">
              <pre className="w-max font-mono text-[10.5px] leading-[1.45] text-slate-300">
                {diagram}
              </pre>
            </div>
          </Card>

          <P>
            And the numbers, which are the part that has to match the input list:
          </P>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-slate-900 text-[12px] tracking-[0.12em] text-slate-400 uppercase">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Ch
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Source
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {channels.map(([ch, source, position]) => (
                  <tr key={ch}>
                    <td className="px-4 py-3 font-mono text-[12.5px] whitespace-nowrap text-indigo-300">
                      {ch}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{source}</td>
                    <td className="px-4 py-3 text-slate-400">{position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <P>
            The notes box on that example reads:{" "}
            <em>
              We bring all backline and the full drum kit — no house backline
              needed. Keys are stereo DI and need phantom power. Click and tracks
              run from a laptop at the drum riser; we&rsquo;ll take one spare XLR
              to FOH for it if you have a channel. Three of us are on in-ears and
              bring our own packs — we just need sends. Contact on the day: Sam,
              who answers the phone.
            </em>
          </P>
        </Section>

        <Section>
          <H2>If you&rsquo;d rather not draw it by hand</H2>
          <P>
            The template is a form, and forms are slower than they need to be when
            the thing you&rsquo;re describing already exists in your head.
          </P>
          <P>
            <A href="/">StagePlot Pro</A> is a free browser tool that does the
            same job the other way round: you drag the gear onto a stage layout,
            and each item writes itself into the channel list as you add it. When
            you&rsquo;re done you export a one-page PDF and send it to the venue.
          </P>
          <P>
            It&rsquo;s free and needs no account — the free export carries a small
            &ldquo;Made with StagePlot Pro&rdquo; line at the foot of the page.
            Pro is $9 once and removes it. Either way the engineer gets one page
            they can read at a glance, which is the whole point.
          </P>
          <div className="mt-7">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              Build your plot in StagePlot Pro — free <span aria-hidden>→</span>
            </a>
          </div>
        </Section>

        <Section>
          <H2>Before you send it</H2>
          <P>A six-point check, in the order that catches the most mistakes:</P>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-slate-300">
            {[
              "Every mark on the plot has a channel number, and the numbers match your input list.",
              "There's a phone number on it that someone will actually answer on the day.",
              "You've marked the power drops you need, not just the ones the venue already has.",
              "You've said what you're bringing — especially drums, amps and anything with a DI.",
              "Set time and load-in time are both on it.",
              "Someone who has never met your band could put the vocal mic in the right place from this page alone.",
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
            <H2>One page, either way</H2>
            <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-slate-300">
              Print the template and fill it in with a pen, or build it in the app
              and export the PDF. The engineer doesn&rsquo;t care which — they
              care that the channel numbers match and the phone number works.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <DownloadButton href={US_LETTER}>
                Download the template — US Letter (PDF)
              </DownloadButton>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-[15px] font-bold text-slate-100 transition hover:bg-slate-800"
              >
                Build it in StagePlot Pro — free <span aria-hidden>→</span>
              </a>
            </div>
            <p className="mt-4 text-[13px] text-slate-400">
              A4 version: <A href={A4}>download</A>
            </p>
          </div>
        </section>
      </main>

      <TemplateFooter />
    </div>
  );
}
