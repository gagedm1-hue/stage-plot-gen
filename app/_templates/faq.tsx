// The FAQ block and the FAQPage structured data, from ONE array.
//
// An answer is a list of parts: a plain string, or `{ text, href }` for a piece
// that has to be a link on the page. `faqAnswerText` joins the parts into the
// plain string the JSON-LD needs, so the visible answer and the structured data
// are the same words by construction — there is nothing to retype and nothing
// that can drift.
import type { ReactNode } from "react";

export type FaqPart = string | { text: string; href: string };
export type Faq = { q: string; a: FaqPart[] };

/** The answer as plain text — what goes into `acceptedAnswer.text`. */
export const faqAnswerText = (answer: FaqPart[]): string =>
  answer.map((part) => (typeof part === "string" ? part : part.text)).join("");

/** The `FAQPage` node for a page's <script type="application/ld+json">. */
export const faqPageJsonLd = (canonical: string, faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${canonical}#faq`,
  url: canonical,
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item.a) },
  })),
});

/** The <script> tag itself. One line in the page, one source of truth. */
export function FaqJsonLd({
  canonical,
  faqs,
}: {
  canonical: string;
  faqs: Faq[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqPageJsonLd(canonical, faqs)),
      }}
    />
  );
}

const renderAnswer = (answer: FaqPart[]): ReactNode =>
  answer.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <a
        key={i}
        href={part.href}
        className="font-medium text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 transition hover:text-indigo-200"
      >
        {part.text}
      </a>
    ),
  );

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-8 divide-y divide-slate-800 border-y border-slate-800">
      {faqs.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15.5px] font-semibold text-slate-100 marker:hidden hover:text-white [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full border border-slate-700 text-slate-400 transition group-open:rotate-45"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                className="size-3.5"
              >
                <path d="M8 3.5v9M3.5 8h9" />
              </svg>
            </span>
          </summary>
          <p className="pr-10 pb-5 text-[14.5px] leading-relaxed text-slate-300">
            {renderAnswer(item.a)}
          </p>
        </details>
      ))}
    </div>
  );
}
