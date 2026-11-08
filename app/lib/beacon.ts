// Two events the business plan needs and the owner's Vercel dashboard will not
// hand the team: how many PDF exports happen, and how many of those visitors
// start a checkout. Both go to the same first-party, cookie-free endpoint the
// template pages already report to, so `bun run stats` on the marketing site
// can print "exports this week" and "checkouts per 100 exports".
//
// WHAT IS SENT, and nothing else:
//   { event: "export",   path: "/", watermarked: true | false }
//   { event: "checkout", path: "/" }
//
// `watermarked` is the state the PDF actually had — the same expression the
// editor renders the watermark from. `true` means the free export (the
// "Made with StagePlot Pro" line), `false` means it went out clean. Not sent,
// deliberately: no user id, no session id, no cookie, no IP, no band name, no
// venue, no plot contents, no file name, no timestamp we do not already get
// from the server. The log side drops anything that is not one of the two
// events on an allow-listed path.
//
// Everything here is best-effort and off the critical path: `no-cors` +
// `keepalive`, and every failure is swallowed. An export or a checkout must
// never wait on measurement, and must work with it completely broken.
import { BEACON_URL } from "../_templates/config";

type BeaconEvent =
  | { event: "export"; path: string; watermarked: boolean }
  | { event: "checkout"; path: string };

function send(payload: BeaconEvent): void {
  try {
    void fetch(BEACON_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* measurement is optional; the page must never care */
    });
  } catch {
    /* same */
  }
}

/** One PDF export that actually completed, and whether it was watermarked. */
export function trackExport(watermarked: boolean): void {
  send({ event: "export", path: window.location.pathname, watermarked });
}

/** One click on the upgrade button, recorded before the Stripe redirect. */
export function trackCheckout(): void {
  send({ event: "checkout", path: window.location.pathname });
}
