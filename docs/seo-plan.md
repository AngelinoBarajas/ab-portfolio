# SEO + schema plan (full pass, 2026-09-26)

Staging (`ab-portfolio-723a30.webflow.io`) is blocked by Webflow's own robots.txt (`Disallow: /`), so nothing here is indexable until the custom domain. Everything below is staged for launch. **Status (2026-09-26): titles/descriptions approved and live on staging; OG images live; Missions SEO fields filled. Remaining: the Designer steps in §6, then the launch swaps.**

Earlier pass (step 8 QA): Home title/description, OG mirroring on every static page, hub description trimmed.

## 1. Audit (live staging HTML + MCP, 2026-09-26)

| Page | Title | Desc | OG / Twitter | Canonical | H1 | Heading order | Alt text | Crawlable links | Index? |
|---|---|---|---|---|---|---|---|---|---|
| Home `/` | ✅ 47 | ✅ 151 | tags ✅, **no image** | ❌ none | ✅ 1 | ok (duplicate "Discovery call" h3) | ✅ | ❌ board → missions is script-only | index |
| Work `/work` | ⚠ no keyword | ✅ 143 | same | ❌ | ✅ 1 | ⚠ H1 → H3 (no H2) | ⚠ cover imgs render `alt=""` | ❌ cards → missions script-only | index |
| Services `/services` | ⚠ no keyword | ✅ 152 | same | ❌ | ✅ 1 | ✅ | ✅ | ✅ 8 services | index |
| Process `/process` | ⚠ no keyword | ✅ 155 | same | ❌ | ✅ 1 | ✅ | ✅ | ✅ | index |
| About `/about` | ✅ | ⚠ 122 | same | ❌ | ✅ 1 | ⚠ badge h3s before the first H2 | ✅ | ✅ | index |
| Contact `/contact` | ✅ | ✅ 150 | same | ❌ | ✅ 1 | ✅ | ✅ | ✅ | index |
| 404 | ✅ | ✅ | same | n/a | ✅ | ✅ | ✅ | ✅ | served as 404: noindex by status, nothing to do |
| Mission template `/work/*` | ❌ "AB Portfolio" | ❌ none | ❌ no OG/Twitter at all | ❌ | ✅ | ok (stats h3 read "0 collections" before the counter runs) | ⚠ 510 globe-pin photos `alt=""`; covers 510 + Aguirre have no CMS alt | ❌ Next card + related links script-only | index real ones; **noindex** Aguirre (hidden) + 3 placeholders |
| Services template `/services/*` | ❌ "AB Portfolio" | ❌ none | ❌ none | ❌ | ✅ | ✅ | ✅ | ⚠ related missions script-only | index |
| 12 hidden collections (Glossary, Hub manifest, FAQ, Tools…) | — | — | — | — | — | — | — | — | ✅ already 404 (template pages off): nothing to noindex |

Other findings:
- **No page links to any `/work/<slug>` in the HTML.** The 4 real debriefs are orphans for crawlers (scripts add the links for visitors).
- Footer "Services" column lists 5 of 8 services (no Motion, Design systems, Performance). Home links all 8, so not critical.
- Forms: Home "Mission Planner" ✅, Process "Email Form", Contact "Email Form".
- `<html lang="en">` ✅. No JSON-LD anywhere yet. `/sitemap.xml` 404 (auto-sitemap off).
- **Plan limit:** the sitemap-flag API returns *"Site plan doesn't support sitemap indexing controls"*. Per-page/per-item sitemap flags only work after the site plan is bought (needed for the domain anyway).
- Services collection is at the 60-field cap: its SEO has to come from existing fields (Name, Summary). Missions has 36 fields: room for SEO fields.

## 2. Proposed titles + descriptions

| Page | Title (chars) | Meta description (chars) |
|---|---|---|
| Home | Angelino Barajas · Webflow designer + developer (47) *keep* | *keep* (151) |
| Work | **Webflow projects · Mission archive · Angelino Barajas** (53) | **Webflow sites, brand identities and interactive 3D, each planned, designed in Figma and built from the ground up. Open a mission debrief.** (137) |
| Services | **Services · Webflow, 3D, motion + brand · Angelino Barajas** (57) | *keep* (152) |
| Process | **Web design process · The flight plan · Angelino Barajas** (55) | *keep* (155) |
| About | **About Angelino Barajas · Webflow designer + developer** (53) | **Self-taught designer and developer with a philosophy degree and a soft spot for space. Meet the pilot: how I work, what I build and why.** (136) |
| Contact | *keep* Contact · Open a channel · Angelino Barajas (43) | *keep* (150) |
| 404 | *keep* | *keep* |
| Mission template | `[Name] · Mission debrief · Angelino Barajas` | `[Meta description]` (new Missions field) |
| Services template | `[Name] · Services · Angelino Barajas` (max 55) | `[Summary]` (130–186; two run a little long, Google trims) |

New Missions field **Meta description** (PlainText):

| Mission | Meta description (chars) |
|---|---|
| 510 Visuals | A Webflow site for 5 TEN, a Brooklyn Navy Yard studio behind giant LED installations: a CMS-fed Three.js globe, GSAP scroll systems and WebGL. (142) |
| AB Identity | The identity behind this portfolio: an AB monogram cut through by a ringed planet, a square-first system and one hot accent, from sketch to Illustrator. (152) |
| Knowledge System | A connected content system for the Webflow CMS: one vocabulary links services, projects, answers and videos, so people, Google and AI can follow what you know. (159) |
| Daniel Aguirre Law, 3 placeholders | copy of Summary (noindexed anyway) |

New Missions field **Robots** (PlainText): `noindex` on Daniel Aguirre Law (hidden) and the 3 placeholders; empty on real missions. Template head: `<meta name="robots" content="[Robots]">` (an empty `content` is ignored by crawlers).

OG title/description mirror SEO everywhere (`titleCopied/descriptionCopied: true`).

## 3. OG images (live on staging)

`python og/build.py` renders every card with the site's own code: the planets are drawn by `code/src/core/10-space.js` + the planet CSS in `ab-core.css` (same `data-*` as the pages), the AB Identity image by `AB.markSVG({grid:true})` from `core/21-mark.js`. Outputs in `og/out/`, uploaded as JPEG (LinkedIn is unreliable with WebP).

| Asset | Planet / art | Used on |
|---|---|---|
| og-site.jpg `6ab8149fe5d9f17124004a93` | Home hero ringed gas giant (violet, seed 3) | Home, Process, About, Contact, 404 |
| og-work.jpg `6ab814a0d770c2fa20d32575` | Work archive planet (seed 21) | Work |
| og-services.jpg `6ab814a1ceb091fbb0a8b148` | Services hub planet (Webflow blue, seed 11) | Services hub + Services template (set via MCP) |
| og-ab-identity.jpg `6ab814a242efee0d9ed421e6` | the Work card "Mark" cover: monogram on its construction grid | AB Identity › Social image |
| og-510-visuals / og-knowledge-system / og-daniel-aguirre-law | covers cropped 1200×630, top-left like the cards | each mission's Social image |

Missions got a separate **Social image** field (not Cover) so the Work card keeps its coded Mark cover for AB Identity. Placeholders have none (noindexed). Webflow emits `twitter:card=summary_large_image` without `twitter:image`; X falls back to `og:image`.

## 4. JSON-LD (`seo/make_jsonld.py` → `seo/jsonld/`)

| Page | Graph |
|---|---|
| Home | WebSite + Person (`/#person`, jobTitle, knowsAbout, makesOffer → the 8 Service @ids) + WebPage |
| Work | CollectionPage + BreadcrumbList |
| Services hub | CollectionPage (hasPart → 8 Service @ids) + BreadcrumbList |
| Process | WebPage + BreadcrumbList |
| About | ProfilePage (mainEntity → Person) + BreadcrumbList |
| Contact | ContactPage + BreadcrumbList |
| Mission template | CreativeWork (name, description, image, dateCreated = Year, creator → Person) + BreadcrumbList, in template head with field tokens |
| Services template | Service (name, description, serviceType, audience = Best for, provider → Person) + BreadcrumbList, in template head |
| 404 | none |

**FAQPage: none yet.** Home's FAQ still has `[X–Y weeks]`; Process FAQ is rendered by script (not in the HTML); Services FAQs are final but a CMS template head can't loop a multi-reference into one FAQPage. Google shows FAQ rich results only for government/health sites since 2023, so the only gain is for AI readers. Add Home FAQPage once `[X–Y weeks]` is real.

Template field values must not contain straight double quotes (`"`): they'd break the JSON. Current Name/Summary values are clean.

### Swapped at launch

1. `python seo/make_jsonld.py https://<domain>` → `seo/jsonld/launch/` (every `{{DOMAIN}}` becomes the domain), then `bulk_update_pages_schema_markup` for the 6 static pages and paste the 2 `*.head.html` into the template heads.
2. Add to Person when real: `email`, `sameAs` (LinkedIn/Behance/GitHub/Dribbble), `image` (headshot URL).
3. Site settings › SEO › Global canonical URL = `https://<domain>`.
4. robots.txt (below), sitemap on, sitemap flags via MCP.

## 5. robots.txt + sitemap (launch)

- Site settings › SEO › **Auto-generate sitemap: on**.
- Site settings › SEO › **Disable Webflow subdomain indexing: on** (staging stays out of Google).
- robots.txt (custom domain):

```
User-agent: *
Allow: /

Sitemap: https://<domain>/sitemap.xml
```

- After the plan is live: MCP sets `includeInSitemap: false` on Daniel Aguirre Law + the 3 placeholders (and back to true when a placeholder becomes a real mission).
- Optional: Site settings › SEO › LLMs.txt (custom domain only).
- Google Search Console: verify the domain, submit the sitemap.

## 6. Designer steps for Angelino (MCP can't do these)

1. **Missions template** › Settings › SEO: Title `[Name] · Mission debrief · Angelino Barajas`, Meta description `[Meta description]`. Open Graph: title + description "Same as SEO", OG image = **Social image** field.
2. **Services template** › Settings › SEO: Title `[Name] · Services · Angelino Barajas`, Meta description `[Summary]`, OG "Same as SEO" (OG image already set to og-services).
3. **Missions template** › Custom code › Head: `<meta name="robots" content="[Robots]">` then the block in `seo/jsonld/mission-template.head.html` (insert each `[Field]` with "+ Add field"). **Services template** › Head: `seo/jsonld/services-template.head.html`. Keep `{{DOMAIN}}` until launch, or paste at launch from `seo/jsonld/launch/`.
4. **Crawlable mission links**: Home board frame link, Work mission card link, Services template related-mission card link → *Current Missions page*; Next card link → *Next mission* field.
5. Work card cover Image › alt → from CMS.
6. Rename the Process and Contact forms ("Email Form").
7. Site settings › SEO: Auto-generate sitemap **on**, Disable Webflow subdomain indexing **on**. At launch: Global canonical URL + robots.txt (§5).
8. Optional: Work card name H3 → H2; About badge h3s → text; footer Services column + Motion, Design systems, Performance.
