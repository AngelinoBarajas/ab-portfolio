---
status: approved
title: Your Webflow project pages might be invisible to Google. Check your links.
slug: crawlable-collection-links-webflow
theme: Build notes
topics: [Internal linking, Webflow CMS, SEO audit, Custom code]
services: [webflow-development, performance]
missions: [knowledge-system]
meta_description: If a script builds your card links, crawlers may never find the pages behind them. A two-minute check, and the Designer setting that fixes it.
---

**The short answer:** if JavaScript adds your cards' links, the HTML Google downloads may not link to your project pages at all. View the page source (not the inspector) and search for `/work/` or your collection's path. If nothing comes up, set each card's link to **Current [Collection] page** in the Designer so the link exists before any script runs.

## How I found it on my own site

During the SEO pass on this portfolio I downloaded every page the way a crawler sees it and listed the links. The home page linked to every service. The Work page linked to every service. Neither linked to a single mission debrief.

The cards worked perfectly for people. The script that animates them also sets their `href`, so in a browser everything clicked through. But the raw HTML had placeholder links, and the four real case studies were orphans: nothing a crawler reads pointed to them.

## Why it happens

It's a natural side effect of interactive builds. You hand a card to a script for a warp transition, a hover effect or a filter, and at some point the script becomes the thing that knows where the card goes. Google does run JavaScript, but later and less reliably than it reads HTML, and plenty of other crawlers and AI tools don't run it at all. Links that exist only after a script runs are links you're hoping for, not links you have.

## The two-minute check

1. Open the page, then **View page source** (Ctrl+U / Cmd+Option+U). The inspector shows the page after scripts ran, so it will lie to you here.
2. Search the source for your collection path (`/work/`, `/projects/`, `/blog/`).
3. Every item you want found should appear as a real `href`.

If you'd rather check a whole site: fetch each page with `curl`, pull out every `href`, and list which collection items nobody links to.

## The fix in Webflow

- Select the card's **Link Block** inside the Collection List.
- Link settings › **Current [Collection] page** (for a reference field, the referenced item's page).
- Keep your script, but let it *read* the `href` instead of writing it. Enhance the link; don't be the link.

For "next project" cards, bind the link to the reference field (for example *Next mission*) so each page links forward in plain HTML.

## A related trap: hidden and placeholder items

While you're in there, look at what *is* linked. A hidden client or a placeholder project still has a live page if its item is published. Give the template a `noindex` switch (a plain text field inserted into a robots meta tag works well) and keep those items out of the sitemap until they're real.

---
**Review notes**
- True story from this build (the Designer fix is still on your list).
- The line about AI tools not running JavaScript is a general statement; fine to keep or soften.
