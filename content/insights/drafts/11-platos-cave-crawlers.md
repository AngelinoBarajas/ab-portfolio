---
status: approved
title: Plato's cave: what a crawler sees is not what your visitors see
slug: platos-cave-crawlers-raw-html
theme: Why before how
topics: [Philosophy, Crawlable links, Search + AI answers]
services: [webflow-development, cms-integrations]
missions: [knowledge-system]
meta_description: Plato's prisoners only saw shadows on a wall. Search and AI crawlers often only see your raw HTML. Here is how I found the gap on my own site, and closed it.
---

**The short answer:** in Plato's cave, prisoners mistake shadows on a wall for the real world. A crawler reading your site is in a similar spot: it often sees only the raw HTML the server sends, not the page your visitors get after scripts run. If your links, titles or content only appear after JavaScript, some machines are reading the shadow. The fix is to put the real thing in the HTML itself.

## The allegory, briefly

In Book VII of the *Republic*, Plato asks us to picture people chained in a cave since childhood, facing a wall. Behind them a fire burns, and between the fire and their backs, objects are carried past. All the prisoners ever see are the shadows those objects cast. They name the shadows, predict them, argue about them. For them, the shadows are reality.

Plato meant it as a story about education and truth: most of what we take for knowledge is a projection, and seeing clearly takes effort, even pain. It was not written about search engines. But it describes one of the most common problems on modern websites surprisingly well.

## Two versions of every page

Every page on the web exists twice.

- **The raw HTML** is what the server sends: a text file with the structure, the words, the links.
- **The rendered page** is what a browser builds from it after the CSS loads and the scripts run: the animations, the filters, sometimes the content itself.

People see the rendered page. Crawlers vary. Google does run JavaScript, but in a separate, later pass, and it follows links it finds as real `href` addresses. Plenty of other crawlers, including many of the ones feeding AI assistants, read only the raw HTML and move on. For them, the raw file is the whole world. It is the wall of the cave.

## I found shadows on my own site

This site has a section called the Observatory, where these notes live, and a set of topic pages. Each list of notes and topics is built from the Webflow CMS. For visitors, everything worked: click a card, land on the note.

Then I read the raw HTML. Every observation card on the Observatory page pointed to `/observatory`, the page you were already on. Every topic link pointed to `/topics`. A small script was quietly rewriting those addresses in the browser, so people never noticed. A crawler reading the file would have found 37 links that led only to those two pages, and no path to a single note or topic.

The page looked right. The shadow was wrong.

## Turning around

In the allegory, freedom starts when a prisoner turns around and sees the fire and the objects. It hurts, the light is too bright, and the old shadows seem more real for a while. Then the prisoner climbs out.

On a website, turning around is less dramatic. It means opening the page source (not the inspector, which shows the rendered page, but the actual file) and reading it the way a machine would. The fix on my site was just as unglamorous: in the Webflow Designer, each card's link was set to the current CMS item's page instead of a static page. After one publish, the raw HTML carried the real address, `/observatory/` plus the note's slug, on every card. The script that used to patch the links is now redundant. If you want the step-by-step version, including a whole-site check with `curl`, it's in [Your Webflow project pages might be invisible to Google](/observatory/crawlable-collection-links-webflow).

## What belongs outside the cave

Not everything has to be in the raw HTML. A star chart, a hover effect or a playful animation can live in scripts, as long as the page still makes sense without them. What should never depend on JavaScript:

- **Links.** Real `href` addresses to real pages, not click handlers.
- **The main content.** The words someone came for, in the HTML, not injected later.
- **The title and description.** Per page, from your CMS fields, not one site-wide default.
- **Structured data** you want quoted, in the page source.

A simple test: view the page source and search it for the thing you care about. If it's not there, some reader somewhere can't see it.

## The philosopher's return

Plato's story doesn't end when the prisoner gets out. He goes back down into the cave to tell the others, and they don't believe him, because the shadows are all they know.

I think about that part when I explain this to clients. The site looks perfect in their browser, so it's hard to believe anything is missing. That's why I show them the raw file instead of describing it. Seeing 37 links all pointing to the same two pages does more than any argument.

## In practice

- View the page source, not the inspector, on your key pages.
- Search it for your links, your title and your main heading.
- Make CMS links real: set them to the current item's page in the Designer.
- Keep scripts for enhancement, not for content or navigation.
- Check again after every publish. Shadows come back quietly.

The goal isn't to stop using JavaScript. It's to make sure the wall and the world say the same thing.

---

**Review notes**
- Build story is from this site, 2026-09-27: Observatory cards rendered `/observatory` and topic links `/topics` in the raw HTML until the Designer links were set to *Current Observation* / *Current Topic* (verified per slug on staging).
- "Google renders JavaScript in a later pass" and "many AI crawlers read only raw HTML" are stated generally; no specific bot names or numbers.
- Plato reference: *Republic*, Book VII (paraphrased, no quotes).
