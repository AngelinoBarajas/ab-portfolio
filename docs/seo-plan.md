# SEO plan (step 8 SEO pass, 2026-09-26)

Staging is `noindex` (webflow.io default); everything below goes live with the custom domain.

## Done on staging (MCP)

| Page | Title | Description | OG |
|---|---|---|---|
| Home | Angelino Barajas · Webflow designer + developer | Webflow sites with gravity: interactive 3D that's useful to clients and visitors, content wired to the CMS, and motion people remember. Plan a mission. | mirrors SEO |
| Work | (unchanged) Work · Mission archive · Angelino Barajas | (unchanged) | mirrors SEO (new) |
| Process | (unchanged) | (unchanged) | mirrors SEO (new) |
| Services hub | (unchanged) | Eight services, one pilot: Webflow builds, interactive 3D + data, motion, brand identity, custom code, CMS integrations, design systems and performance. (trimmed from ~180) | mirrors SEO (new) |
| About, Contact, 404 | already set | already set | already mirrored |

## Designer steps for Angelino

1. **Sitemap**: Site settings › SEO › Auto-generate sitemap → on (today `/sitemap.xml` returns the 404 page).
2. **Mission template** (Pages › Missions Template › Settings › SEO): Title = `[Name] · Mission debrief · Angelino Barajas`, Meta description = `[Summary]` (insert the fields with the "+ Add field" button). Open Graph: check "Same as SEO" for both.
3. **Services template**: Title = `[Name] · Services · Angelino Barajas`, Meta description = `[Summary]`, OG same as SEO.
4. **Crawlable mission links**: Home › Work board › the board frame link, and Work › mission card link → Link settings → *Current Missions page* (today they render `detail_work` / `/work`; the scripts fix them for visitors, crawlers don't run them).
5. **Forms**: rename the Process and Contact forms ("Email Form") and confirm the notification email (Site settings › Forms).
6. **OG image**: none yet. A 1200×630 social card (AB mark + "Websites with gravity") uploaded as an asset, then set on every page (or Site settings › SEO default). I can make it from the logo artwork when you want.

## JSON-LD (push at launch, when the domain is known)

Replace `{{DOMAIN}}` (e.g. `https://angelinobarajas.com`). Static pages go in via `bulk_update_pages_schema_markup`; the two templates need an HTML Embed with the Webflow field tokens bound in the Designer (page-level JSON-LD can't read CMS fields). Fill `sameAs` and `email` once the Site Settings placeholders are real; don't ship them empty.

**Home** (`WebSite` + `Person`, the site's two root entities):

```json
{"@context":"https://schema.org","@graph":[
 {"@type":"WebSite","@id":"{{DOMAIN}}/#website","url":"{{DOMAIN}}/","name":"Angelino Barajas","publisher":{"@id":"{{DOMAIN}}/#person"}},
 {"@type":"Person","@id":"{{DOMAIN}}/#person","name":"Angelino Barajas","url":"{{DOMAIN}}/","jobTitle":"Webflow designer and developer",
  "knowsAbout":["Webflow development","Interactive 3D","Motion design","Brand identity","CMS integrations","Design systems","Web performance"]}
]}
```

**About**: `{"@context":"https://schema.org","@type":"ProfilePage","@id":"{{DOMAIN}}/about#page","url":"{{DOMAIN}}/about","mainEntity":{"@id":"{{DOMAIN}}/#person"}}`

**Contact**: `{"@context":"https://schema.org","@type":"ContactPage","@id":"{{DOMAIN}}/contact#page","url":"{{DOMAIN}}/contact","about":{"@id":"{{DOMAIN}}/#person"}}`

**Work**: `{"@context":"https://schema.org","@type":"CollectionPage","@id":"{{DOMAIN}}/work#page","url":"{{DOMAIN}}/work","name":"Mission archive","author":{"@id":"{{DOMAIN}}/#person"}}`

**Mission template** (HTML Embed, fields bound in the Designer):

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CreativeWork","@id":"{{DOMAIN}}/work/[Slug]#work","url":"{{DOMAIN}}/work/[Slug]","name":"[Name]","description":"[Summary]","creator":{"@id":"{{DOMAIN}}/#person"}}</script>
```

**Services template** (HTML Embed):

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","@id":"{{DOMAIN}}/services/[Slug]#service","url":"{{DOMAIN}}/services/[Slug]","name":"[Name]","description":"[Summary]","provider":{"@id":"{{DOMAIN}}/#person"}}</script>
```

No `FAQPage` markup: the FAQ accordions are real, but keep it off until the answers are final (Home's still has `[X–Y weeks]`).
