---
status: approved
title: Descartes' method of doubt: publish, then check
slug: descartes-method-of-doubt-publish-then-check
theme: Why before how
topics: [Philosophy, Asking better questions, Crawlable links]
services: [webflow-development, performance]
missions: []
meta_description: Descartes resolved to accept nothing as true that he had not verified himself. His four rules of method make a surprisingly good checklist for shipping a website.
---

**The short answer:** Descartes built his philosophy on one rule: accept nothing as true unless you've seen for yourself that it is. On a website, that means a change isn't done when a tool says "saved" or "published". It's done when you've checked the live page and found it there. Descartes' four rules of method (verify, divide, order, enumerate) turn out to be a very good checklist for shipping a site.

## The man who doubted everything

In 1637, René Descartes published the *Discourse on the Method*, a short book about how to think clearly. His plan was radical: throw out every belief he couldn't be certain of, even the ones that seemed obvious, and rebuild from whatever survived. Almost nothing did. His senses could fool him, his reasoning could slip, he might even be dreaming. The one thing he couldn't doubt was that he was doubting, and so thinking, and so existing. *I think, therefore I am.*

That line gets all the attention. The part I find more useful is quieter: the four rules he set himself for the work that came after.

## Rule one: accept nothing you haven't verified

Descartes' first rule was never to accept anything as true unless he clearly knew it to be so, and to avoid haste.

Website tools are full of confident messages. "Saved." "Published." "Updated successfully." They're usually right. But on recent projects I've seen:

- A link set through an automated tool report success, while the published page still pointed to the wrong address.
- A custom code field written, read back correctly, and then quietly overwritten when someone saved the page's settings in another window.
- A publish that completed without errors and changed nothing public, because it wasn't told which domains to publish to.

None of these were dramatic failures. Each tool told the truth about its own step. The page just wasn't what anyone thought. So the rule on this project is Descartes' rule: after every publish, I read the live page's raw HTML and look for the thing that was supposed to change. If it's not there, it didn't happen. (Why the raw HTML, and not the page in the browser, is the subject of [Plato's cave](/observatory/platos-cave-crawlers-raw-html).)

## Rule two: divide the difficulty

His second rule was to divide each difficulty into as many parts as possible, and as many as needed to solve it.

A big launch checklist is overwhelming. "Make the site crawlable" isn't a task, it's a wish. Divided, it becomes: this link on this page, set to this target, verified on this URL. When I work through Designer changes with a client, it's one step at a time, and each step ends with a check before the next one starts. It feels slower. It's much faster than finding out three steps later that step one never worked.

## Rule three: simplest first

The third rule was to take things in order, starting with the simplest and easiest to know, and climbing step by step to the more complex.

For a site, the simple things are the foundations everything else stands on. Links before page titles, titles before structured data, structured data before the social preview images. If the links are wrong, a perfect title just decorates a page nobody can reach. Working from the ground up means each check builds on something already proven.

## Rule four: count everything

The last rule was to make enumerations so complete and reviews so general that you can be sure nothing was left out.

This is the one people skip. Checking one card and assuming the other nine are fine is the same as not checking. When I verified the links on this site, the check wasn't "the first one looks right", it was every link on the page compared against its own slug, and a count at the end: 54 of 54. Machines are good at this, so let them do it. A small script that fetches the page and counts is more thorough than any careful human scrolling.

## Doubt as a kindness

Descartes' doubt sounds cold, but I think it's the opposite. Checking your own work is a way of respecting the person who'll use it. A client should never be the one to discover that a published change didn't publish.

It also makes the good news trustworthy. When I tell someone "it's live and verified", it means I looked, not that a tool said so.

## In practice

- Treat "saved" and "published" as claims, not facts.
- After every publish, check the live page, ideally the raw HTML.
- Split big goals into single steps that each end in a check.
- Fix foundations first: links, then titles, then everything built on them.
- Count, don't sample. Let a script check every item.

Descartes needed doubt to find one certain thing. A website needs it for the same reason: so that what's left standing is actually true.

---

**Review notes**
- Failure examples: the first two are from this site; the third from an earlier Webflow project (MCP-set collection links rendering the static URL; a Designer Page-settings save overwriting an API write to the template head, 2026-09-27; `publish_site` without custom domains succeeding with no public change). Written without tool names so it stays general.
- "54 of 54" = the topic-link check on `/observatory` + `/topics`, 2026-09-27.
- Descartes' four rules: *Discourse on the Method*, Part II, paraphrased.
