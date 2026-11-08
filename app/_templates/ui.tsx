// Layout pieces for the two template pages, in the app's own visual language:
// slate-950 page, slate-900 cards with slate-800 borders, indigo for anything
// you can click, mono for channel numbers. Deliberately the same palette and
// corner radius as the editor at "/" — someone arriving from a forum post
// should recognise where they landed.
import type { ReactNode } from "react";

/** Sticky top bar. Links back to the editor, which is the conversion. */
export function TemplateHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2 text-base font-extrabold tracking-tight text-white transition hover:text-indigo-300"
        >
          <span aria-hidden className="text-lg">
            🎚️
          </span>
          StagePlot Pro
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <span className="hidden sm:inline">Build your plot free</span>
          <span className="sm:hidden">Build free</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}

export function TemplateFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-base font-extrabold tracking-tight text-white">
            <span aria-hidden>🎚️</span> StagePlot Pro
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            A stage plot and patch list generator for bands, built for the people
            who mix them.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-slate-200 transition hover:text-indigo-300"
          >
            Open StagePlot Pro <span aria-hidden>→</span>
          </a>
          <a
            href="/stage-plot-template"
            className="text-slate-400 transition hover:text-indigo-300"
          >
            Free stage plot template
          </a>
          <a
            href="/input-list-template"
            className="text-slate-400 transition hover:text-indigo-300"
          >
            Free input list template
          </a>
          {/* No year here on purpose: `new Date()` is an unstable value, and
              `cacheComponents` refuses to prerender a page that reads one. A
              footer date is not worth making these pages dynamic. */}
          <span className="text-slate-500">© StagePlot Pro</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * The printed page, shown as proof the download is real — a render of the
 * template itself, not an illustration.
 *
 * Below 640 px the browser only ever has the 640 × 828 file as a candidate, so
 * a phone cannot fetch the 1275 × 1650 one. Same pattern as the marketing site
 * and the app's homepage hero.
 */
export function TemplatePreview({
  slug,
  alt,
}: {
  slug: "stage-plot-template" | "input-list-template";
  alt: string;
}) {
  return (
    <picture className="block">
      <source
        media="(min-width: 640px)"
        srcSet={`/images/${slug}-preview-640.png 640w, /images/${slug}-preview.png 1275w`}
        sizes="(min-width: 1024px) 460px, 44vw"
      />
      <img
        src={`/images/${slug}-preview-640.png`}
        alt={alt}
        width={640}
        height={828}
        className="block w-full rounded-xl border border-slate-700 bg-white shadow-2xl shadow-black/60"
        decoding="async"
      />
    </picture>
  );
}

/** One body section of a template page. */
export function Section({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
        {children}
      </div>
    </section>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 text-lg font-bold tracking-tight text-white">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[15.5px] leading-relaxed text-slate-300">
      {children}
    </p>
  );
}

/** Strong lead-in inside body copy. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>;
}

/** Inline link in body copy. Internal links stay on the app. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 transition hover:text-indigo-200 hover:decoration-indigo-300"
    >
      {children}
    </a>
  );
}

/** The card the long-form copy sits in, matching the editor's panels. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
      {children}
    </div>
  );
}
