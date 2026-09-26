// Build the Webflow custom code bundles.
//   cd code && npm install && npm run build
// Minified files are *.prod.js / *.prod.css, not *.min.*: for a .min.js path jsDelivr may serve its
// own on-the-fly minified build instead of the committed file, which breaks the SRI hash.
// src/core/*.js  → dist/ab-core.js + .prod.js   (site-wide, Site settings › Custom code › Footer)
// src/home/*.js  → dist/ab-home.js + .prod.js   (Home page › Custom code › Before </body>)
// src/work/*.js  → dist/ab-work.js + .prod.js   (Work page › Custom code › Before </body>)
// src/mission/*.js → dist/ab-mission.js + .prod.js (Missions template › Before </body>); src/ab-mission.css → template <head> <link>
// src/services/*.js → dist/ab-services.js + .prod.js (Services template › Before </body>); src/ab-services.css → template <head> <link>
// src/about/*.js → dist/ab-about.js + .prod.js (About page › Before </body>); src/ab-about.css → page <head> <link>
// src/process/*.js → dist/ab-process.js + .prod.js (Process page › Before </body>); src/ab-process.css → page <head> <link>
// src/hub/*.js → dist/ab-hub.js + .prod.js (Services hub /services › Before </body>); src/ab-hub.css → page <head> <link>
// src/contact/*.js → dist/ab-contact.js + .prod.js (Contact /contact › Before </body>); src/ab-contact.css → page <head> <link>
// src/404/*.js → dist/ab-404.js + .prod.js (404 utility page › Before </body>); src/ab-404.css → page <head> <link>
// vendor/*.js (510 globe, Aguirre case map): served as-is from the repo, loaded lazily by ab-mission
// src/ab-core.css → dist/ab-core.css + .prod.css (aliases mapped to Webflow variable names)
// Every bundle is one Webflow.push with one __ab<Name>Init guard, and must parse as ES5.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import { minify } from 'terser';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'src'), DIST = join(HERE, 'dist');
const pkg = JSON.parse(readFileSync(join(HERE, 'package.json'), 'utf8'));
mkdirSync(DIST, { recursive: true });

// same alias table as webflow/build/prep.py
const ALIAS = {
  void: '--_color---neutral--void', deep: '--_color---neutral--deep', panel: '--_color---neutral--panel',
  hair: '--_color---neutral--hair', hair2: '--_color---neutral--hair-strong', glass: '--_color---neutral--glass',
  star: '--_color---text--primary', soft: '--_color---text--secondary', dust: '--_color---text--tertiary',
  signal: '--_color---brand--signal', 'on-signal': '--_color---brand--on-signal', nebula: '--_color---brand--nebula',
  select: '--_color---ui--select', live: '--_color---status--live', alert: '--_color---status--alert',
  display: '--_typography---font--display', body: '--_typography---font--body', mono: '--_typography---font--mono',
  script: '--_typography---font--script', gutter: '--_spacing---layout--gutter', max: '--_spacing---layout--max-width',
};

const sri = {};
const banner = (name) => `/*! AB Portfolio · ${name} v${pkg.version} · github.com/AngelinoBarajas/ab-portfolio */\n`;
function hash(buf) { return 'sha384-' + createHash('sha384').update(buf).digest('base64'); }
function write(file, text) { writeFileSync(join(DIST, file), text); sri[file] = hash(Buffer.from(text)); }

// split: the first module runs inline (it holds the shared helpers); every later module becomes its own task,
// yielded through a MessageChannel (not throttled in background tabs), so page init is several short tasks instead
// of one long one (Lighthouse TBT). Later modules must not share top-level names (checked for home 2026-09-26).
async function bundle(dir, out, guard, opts = {}) {
  const files = readdirSync(join(SRC, dir)).filter((f) => f.endsWith('.js')).sort();
  const parts = files.map((f, i) => {
    const body = `  /* ===== ${dir}/${f} ===== */\n` + readFileSync(join(SRC, dir, f), 'utf8');
    return opts.split && i > 0 ? `  __steps.push(function(){\n${body}\n  });` : body;
  });
  const run = opts.split
    ? `\n  (function(){\n    var i = 0, ch = window.MessageChannel ? new MessageChannel() : null;\n` +
      `    function next(){ if (i >= __steps.length){ if (window.ScrollTrigger) ScrollTrigger.refresh(); return; } __steps[i++](); if (ch) ch.port2.postMessage(0); else setTimeout(next, 0); }\n` +
      `    if (ch) ch.port1.onmessage = next;\n    next();\n  })();`
    : '';
  const code = banner(out) +
    `window.Webflow = window.Webflow || [];\nwindow.Webflow.push(function(){\n  if (window.${guard}) return;\n  window.${guard} = true;\n` +
    (opts.split ? '  var __steps = [];\n' : '') + parts.join('\n') + run + `\n});\n`;
  try { parse(code, { ecmaVersion: 5 }); }
  catch (e) {
    const line = code.split('\n')[e.loc.line - 1];
    throw new Error(`${out}: not ES5 at ${e.loc.line}:${e.loc.column}: ${e.message}\n  ${line.trim()}`);
  }
  write(out + '.js', code);
  const min = await minify(code, { ecma: 5, compress: { passes: 2 }, mangle: true, format: { comments: /^!/ } });
  write(out + '.prod.js', min.code + '\n');
  console.log(`${out}.js ${(code.length / 1024).toFixed(1)} KB → .prod.js ${(min.code.length / 1024).toFixed(1)} KB`);
}

function css(name) {
  let s = readFileSync(join(SRC, name + '.css'), 'utf8');
  // an unclosed block swallows every rule after it without any browser error: fail the build instead
  let depth = 0;
  for (const ch of s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"]*"/g, '')) {
    depth += ch === '{' ? 1 : ch === '}' ? -1 : 0;
    if (depth < 0) throw new Error(name + '.css: unbalanced "}"');
  }
  if (depth) throw new Error(`${name}.css: ${depth} unclosed "{"`);
  s = s.replace(/var\(--([\w-]+)\)/g, (m, k) => (ALIAS[k] ? `var(${ALIAS[k]})` : m));
  const full = banner(name + '.css') + s;
  write(name + '.css', full);
  const min = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim();
  write(name + '.prod.css', banner(name + '.css') + min + '\n');
  console.log(`${name}.css ${(full.length / 1024).toFixed(1)} KB → .prod.css ${(min.length / 1024).toFixed(1)} KB`);
}

await bundle('core', 'ab-core', '__abCoreInit');
await bundle('home', 'ab-home', '__abHomeInit', { split: true });
await bundle('work', 'ab-work', '__abWorkInit');
await bundle('mission', 'ab-mission', '__abMissionInit');
await bundle('services', 'ab-services', '__abServicesInit');
await bundle('about', 'ab-about', '__abAboutInit');
await bundle('404', 'ab-404', '__ab404Init');
await bundle('process', 'ab-process', '__abProcessInit');
await bundle('hub', 'ab-hub', '__abHubInit');
await bundle('contact', 'ab-contact', '__abContactInit');
css('ab-core');
css('ab-mission');
css('ab-services');
css('ab-about');
css('ab-404');
css('ab-process');
css('ab-hub');
css('ab-contact');
writeFileSync(join(DIST, 'sri.json'), JSON.stringify(sri, null, 2) + '\n');
console.log('SRI hashes → dist/sri.json');
