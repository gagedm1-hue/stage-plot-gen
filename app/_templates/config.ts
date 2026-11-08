// One place for the absolute URLs the template pages emit.
//
// APP_ORIGIN is the host that ACTUALLY serves these pages. stageplots.app
// answers with a 308 to www.stageplots.app, so a canonical pointing at the bare
// apex would name a URL that never returns 200. Every canonical, og:url and
// JSON-LD @id on these pages comes from here, so they cannot drift apart.

/** The host that returns 200 for these pages (apex 308s to this). */
export const APP_ORIGIN = "https://www.stageplots.app";

/** Absolute URL for a path on the app ("/stage-plot-template"). */
export function appUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${APP_ORIGIN}${clean}`;
}

/**
 * Where the two template pages report that they were seen.
 *
 * These pages live on the app, whose analytics are Vercel's — readable only in
 * the owner's dashboard. The team's own first-party log lives on the marketing
 * site's server, so the page sends it a cookie-free beacon instead. It is a
 * cross-origin POST with a text/plain body: a "simple request", so the browser
 * sends no preflight and the response body is never needed. If the endpoint is
 * down the beacon fails silently — nothing on the page waits for it.
 */
export const BEACON_URL =
  "https://fb696c999ac99b4380999580e32f24fd.cto.site/api/beacon";
