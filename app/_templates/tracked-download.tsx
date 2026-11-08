"use client";

import type { ReactNode } from "react";

import { trackDownload } from "./beacon";

/**
 * A download link for a template file.
 *
 * It is a plain anchor with `download` and a real `href`, so it works with
 * JavaScript off, on a phone, and when the beacon endpoint is unreachable. The
 * click handler only records the event — it never prevents or delays the
 * navigation, because the file is static and the browser fetches it itself.
 */
export function DownloadButton({
  href,
  children,
  tone = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "quiet";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-center text-sm font-bold transition active:translate-y-px sm:text-[15px]";
  const tones = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500",
    quiet:
      "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800",
  } as const;

  return (
    <a
      href={href}
      download
      onClick={() => {
        trackDownload(href);
      }}
      className={`${base} ${tones[tone]} ${className}`}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0"
      >
        <path d="M10 3v9" />
        <path d="m6.5 8.5 3.5 3.5 3.5-3.5" />
        <path d="M4 16h12" />
      </svg>
    </a>
  );
}
