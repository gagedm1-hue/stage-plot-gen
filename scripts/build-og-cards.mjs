// Builds the two 1200×630 social (og:image) cards for the template pages.
//
//   node scripts/build-og-cards.mjs    (from the repo root)
//
// Writes public/images/og-stage-plot-template.png and
//        public/images/og-input-list-template.png
// and prints each one's measured pixel size and byte count, throwing if a card
// is not exactly 1200×630 or has grown past 300 KB (crawlers fetch these).
//
// The document on each card is the REAL page render — public/images/<slug>-preview.png,
// the same 1275×1650 raster the template pages display — composited onto a
// slate-950 / indigo card. Portrait, so it is cropped by the card edge, never
// squashed. No illustration, no generated imagery: a stranger sees the form.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";

const APP = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const WORK = "/tmp/og/work";
const CHROME = "/usr/local/bin/chromium";

const W = 1200;
const H = 630;

const CARDS = [
  {
    slug: "stage-plot-template",
    title: ["Free Stage Plot", "Template for Bands", "(PDF, Printable)"],
    sub: "Print and fill in by hand \u2014 US Letter and A4.",
    docLabel: "Page 1 of the blank template",
  },
  {
    slug: "input-list-template",
    title: ["Free Input List", "Template for Bands", "(Channel List PDF)"],
    sub: "24 numbered channels \u2014 US Letter, A4, CSV.",
    docLabel: "Page 1 of the blank template",
  },
];

const html = (card, docDataUri, fontDataUri) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 100 900;
    font-display: block;
    src: url(${fontDataUri}) format("woff2");
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #020617; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    font-family: "Inter", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .card { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
  .glow {
    position: absolute; inset: 0;
    background:
      radial-gradient(620px 460px at 104% -8%, rgba(79,70,229,0.55), rgba(2,6,23,0) 68%),
      radial-gradient(520px 420px at -6% 108%, rgba(49,46,129,0.55), rgba(2,6,23,0) 70%);
  }
  .rule { position: absolute; left: 0; top: 0; width: ${W}px; height: 5px;
          background: linear-gradient(90deg, #818cf8, #4338ca 55%, rgba(67,56,202,0)); }
  .text { position: absolute; left: 72px; top: 84px; width: 486px; }
  .pill {
    display: inline-block; padding: 9px 17px; border-radius: 999px;
    background: rgba(99,102,241,0.16); border: 1px solid rgba(129,140,248,0.45);
    color: #c7d2fe; font-size: 14px; font-weight: 600;
    letter-spacing: 0.13em; text-transform: uppercase;
  }
  h1 { margin: 26px 0 0; font-size: 50px; line-height: 1.08; letter-spacing: -0.028em;
       color: #f8fafc; font-weight: 700; }
  .sub { margin: 22px 0 0; font-size: 21px; line-height: 1.45; color: #94a3b8; font-weight: 400; }
  .divider { position: absolute; left: 72px; bottom: 120px; width: 486px; height: 1px;
             background: linear-gradient(90deg, rgba(148,163,184,0.35), rgba(148,163,184,0.06)); }
  .host { position: absolute; left: 72px; bottom: 62px; display: flex; align-items: center;
          gap: 13px; font-size: 21px; font-weight: 600; color: #e2e8f0; letter-spacing: -0.01em; }
  .mark { width: 27px; height: 27px; border-radius: 8px;
          background: linear-gradient(140deg, #818cf8, #4338ca);
          box-shadow: 0 0 0 1px rgba(165,180,252,0.45); }
  .doc {
    position: absolute; left: 636px; top: 58px; width: 528px;
    border-radius: 10px 10px 0 0; overflow: hidden; background: #fff;
    box-shadow: 0 34px 70px -14px rgba(0,0,0,0.75), 0 0 0 1px rgba(148,163,184,0.22);
  }
  .doc img { display: block; width: 528px; height: auto; }
  .label {
    position: absolute; left: 636px; top: 22px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: #a5b4fc;
  }
</style></head>
<body>
  <div class="card">
    <div class="glow"></div>
    <div class="rule"></div>
    <div class="label">${card.docLabel}</div>
    <div class="text">
      <div class="pill">Free template · printable PDF</div>
      <h1>${card.title.join("<br>")}</h1>
      <p class="sub">${card.sub}</p>
    </div>
    <div class="divider"></div>
    <div class="host"><span class="mark"></span>stageplots.app</div>
    <div class="doc"><img src="${docDataUri}" alt=""></div>
  </div>
</body></html>`;

const run = (cmd) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd[0], cmd.slice(1), { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    proc.stdout.on("data", (d) => { out += String(d); });
    proc.stderr.on("data", (d) => { err += String(d); });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd.join(" ")} failed (${String(code)})\n${err || out}`));
    });
    proc.on("error", reject);
  });

const pngSize = (buf) => {
  const v = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (v.getUint32(0) !== 0x89504e47) throw new Error("not a PNG");
  return [v.getUint32(16), v.getUint32(20)];
};

await mkdir(WORK, { recursive: true });
const fontDataUri = `data:font/woff2;base64,${Buffer.from(
  await readFile(`${APP}/public/fonts/inter-latin-var.woff2`),
).toString("base64")}`;

for (const card of CARDS) {
  const docDataUri = `data:image/png;base64,${Buffer.from(
    await readFile(`${APP}/public/images/${card.slug}-preview.png`),
  ).toString("base64")}`;

  const htmlPath = `${WORK}/${card.slug}-og.html`;
  const pngPath = `${APP}/public/images/og-${card.slug}.png`;
  await writeFile(htmlPath, html(card, docDataUri, fontDataUri));

  await run([
    CHROME,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${W},${H}`,
    `--screenshot=${pngPath}`,
    `file://${htmlPath}`,
  ]);

  const png = await readFile(pngPath);
  const [w, h] = pngSize(png);
  const ok = w === W && h === H && png.byteLength < 300 * 1024;
  console.log(
    `${ok ? "OK  " : "FAIL"} og-${card.slug}.png  ${w}x${h} ` +
      `bytes=${png.byteLength} (${(png.byteLength / 1024).toFixed(1)} KB)`,
  );
  if (!ok) throw new Error(`og card wrong for ${card.slug}`);
}
