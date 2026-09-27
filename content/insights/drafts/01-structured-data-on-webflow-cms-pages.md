---
status: approved
title: How to add structured data to Webflow CMS pages (no plugin)
slug: structured-data-webflow-cms
theme: Build notes
topics: [JSON-LD, Webflow CMS, Structured data, Search + AI answers]
services: [cms-integrations, webflow-development]
missions: [knowledge-system]
meta_description: Webflow can write JSON-LD for every CMS item from the fields you already have. Where to paste it, how to insert the fields, and the one character that breaks it.
---

**The short answer:** paste a JSON-LD `<script>` block into the CMS template's **Page settings › Custom code › Before `</head>`**, and insert the item's fields with **+ Add field** wherever a value belongs. Every item then ships its own structured data, built from the same fields as the page. Keep straight double quotes (`"`) out of those fields, because one of them breaks the whole block.

## Why bother

Structured data is a small, machine-readable description of what a page is: this is a service, this is a project, this person made it. Search engines use it to understand a page, and AI assistants lean on the same signals when they decide what a site is about. On a static page you write it once. On a CMS template, you want it to write itself for every item.

## The two places JSON-LD can live in Webflow

1. **Static pages:** Page settings › Custom code, or through the API. You write the values in by hand.
2. **CMS template pages:** the template's own Custom code field. This is the one that matters, because it can read the item's fields.

What doesn't work: page-level schema set through the API can't see CMS fields. If your schema needs the item's name, it has to live in the template.

## Step by step

1. Open the collection template (for example **Services Template**) and go to **Page settings**.
2. In **Custom code › Before `</head>`**, paste a skeleton like this:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://yoursite.com/services/[Slug]#service",
  "url": "https://yoursite.com/services/[Slug]",
  "name": "[Name]",
  "description": "[Summary]",
  "provider": { "@id": "https://yoursite.com/#person" }
}
</script>
```

3. Delete each `[Field]` marker and put the cursor there, then use **+ Add field** to insert the real field. Webflow shows it as a purple token.
4. Publish, open an item, view source, and paste the page into Google's Rich Results Test or the Schema.org validator.

## The gotchas I actually hit

- **Quotes break everything.** Webflow inserts field values as plain text. If a summary contains `"like this"`, the JSON ends early and the whole block is ignored, silently. Use curly quotes in copy, or keep a separate plain field for schema. I put the rule right in the field's help text so whoever edits the CMS sees it.
- **Empty images.** If an image field is empty, you get `"image": ""`. Validators warn on that. Either make the field required or keep a fallback image.
- **Stable `@id`s.** Give every entity an absolute `@id` (`https://yoursite.com/#person`) and point other pages at it instead of repeating the details. That's how separate pages add up to one clear picture of who you are.
- **Only describe what's on the page.** FAQ schema for questions that aren't visible, or a rating nobody gave you, is a spam signal. If the page doesn't show it, the markup shouldn't claim it.

## Where this fits

On its own, schema is a label. Connected to a shared vocabulary (the topics a site is known for) it becomes part of a system: the same fields drive the page, the related links and the structured data, so nothing drifts. That's the idea behind the [Knowledge System](/work/knowledge-system).

---
**Review notes**
- Every step and gotcha comes from this site's own SEO pass (Services + Missions templates). Nothing invented.
- Uses `yoursite.com`, not your domain, on purpose.
