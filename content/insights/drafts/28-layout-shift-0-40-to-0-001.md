---
status: draft
title: How I cut my layout shift from 0.40 to 0.001 in Webflow
slug: webflow-layout-shift-cls-fix
theme: Build notes
topics: [Mobile performance, Perceived speed, Custom code, Webflow CMS]
services: [performance, webflow-development]
missions: [ab-identity]
meta_description: Layout shift (CLS) is the page jumping while you read it. Four causes I found on my own Webflow site, script-filled boxes, font swaps, split headings and CMS sections hidden after paint, and the fix for each.
---

**The short answer:** layout shift is the page jumping under you while it loads. Google measures it as CLS (Cumulative Layout Shift), and under 0.1 counts as good. My Observatory page scored 0.40 on phones. The fix wasn't one big trick. It was four small causes, each with its own fix: reserve space for anything a script fills in, give your web fonts a fallback with the same shape, start split headings in their final layout, and let the CMS leave out empty sections before the page is sent instead of hiding them afterward.

## What a 0.40 feels like

You open a page, start reading the first line, and then everything drops 400 pixels because something above it finished loading. You lose your place. If you were about to tap a link, you tap the wrong one. That's what CLS measures: how much visible content moves, and how far, without you doing anything.

On my own site, the Observatory (the library of these field notes) was the worst page. Lighthouse gave it 0.40 on a phone and a performance score of 53. That one number alone was costing about 15 points.

I didn't notice it from a score. I noticed it on my phone. This site alternates dark sections and light ones, and where a light section meets a dark one, the seam is a hard line across the screen. On load, that line would slide. The background seemed to change under the text for a moment, then settle. Once you see a seam move, you can't stop seeing it. The score just confirmed what my eyes already knew.

## How I found the causes

Lighthouse tells you the score. It doesn't really tell you *why*. For that I used the browser's own record of every shift:

```js
new PerformanceObserver(function(list){
  list.getEntries().forEach(function(e){
    if (e.hadRecentInput) return;
    console.log(e.value.toFixed(3), e.sources.map(function(s){ return s.node; }));
  });
}).observe({ type: 'layout-shift', buffered: true });
```

Paste that in the console, reload, and every jump is logged with the elements that moved. Two habits made it much more useful:

- **Slow the CPU down.** In Chrome DevTools, Performance › CPU › 4× slowdown. Most jumps happen in the gap between the HTML painting and the scripts finishing, and a fast laptop closes that gap before you can see it.
- **Test more than one width and more than one page.** My first pass was phones only, one page per template. It showed almost nothing on About or the Services hub. At 1024 and 1440 px those pages were jumping 0.12 to 0.38. CLS depends on what's on screen at that width, so a clean phone score proves nothing about a laptop.

## Cause 1: a box a script fills in, hidden while empty

The Observatory hero has an "ask" box and a stats row. Webflow holds them as empty divs, and the library script fills them in. To keep the empty state tidy, I'd hidden them with `:empty { display: none }`. Tidy in the code, terrible on screen: the page painted without them, then about 430 px of content appeared above the library a second later and pushed everything down.

The fix is to hold the space instead of collapsing it:

```css
.ab_ks-ask:empty{ visibility: hidden; min-height: 312px; }
```

`visibility: hidden` keeps the box invisible while it's empty, and `min-height` keeps its space. The height has to match what the box will be once it's filled, and that changes as the text wraps. So I measured the filled box at every width from 300 to 1000 px and set a `min-height` at each point where the wrapping changed.

**Result:** 0.40 → 0.001 on phones, performance 53 → 70.

**The rule:** anything a script fills in on the first screen gets its space reserved. Never `display: none` while it waits.

## Cause 2: the font swap

This one only showed up on desktop. My About page summary was three lines tall in the fallback font and two lines in the real one (Geist). When Geist arrived, the paragraph shrank, the centered hero re-centered, and everything moved. CLS 0.24.

Webflow writes your font as `Geist, sans-serif`, and on most machines `sans-serif` means Arial, which is a slightly different size. The fix is a fallback that's been adjusted to take up the same room:

```css
@font-face{
  font-family: "Geist Fallback";
  src: local("Arial");
  size-adjust: 102.47%;
  ascent-override: 98.57%;
  descent-override: 29.28%;
  line-gap-override: 0%;
}
:root{ --_typography---font--body: Geist, "Geist Fallback", sans-serif; }
```

That second rule re-declares Webflow's own font variable in a stylesheet loaded after Webflow's, so the fallback slots in without touching the Designer. I got the `size-adjust` number by measuring real text from the site in both fonts and dividing one width by the other.

The mono font was easier. JetBrains Mono and Courier New are both monospaced with the same character width, so only the line height needed adjusting. Before that fix, the diagnostics chips on the Services hub were wrapping to an extra row in Arial and snapping back.

I also preloaded the body font in the site head, so it arrives sooner.

**Results:** About 0.24 → 0.007, Services hub 0.14 → 0.004, Home at 1024 px 0.33 → 0.047.

## Cause 3: headings that change shape when the script splits them

A lot of the motion on this site splits headings into separate words so each word can move. The trouble is what happens between the split and the animation. On my topic pages, each word became its own `display: block` span for a moment, so a two-word title like "Webflow CMS" painted on two lines, then snapped back to one when the script made the words `inline-block`. A one-line jump, and everything under it went down and back up.

The fix is one line of CSS so the words start in the shape they'll end up in:

```css
.ab_dbh_title.is-ks-topic .ab_dbh_word{ display: inline-block; }
```

I'd already fixed this on the main Topics page. I'd missed the topic pages themselves, because their title has a different class. I only caught it while writing this note, by re-running the measurements on every topic at three widths.

**Results:** topic pages 0.25–0.48 → 0.017 or less on desktop.

## Cause 4: CMS sections hidden after the page paints

Each topic page has a "Shown in practice" section listing the projects that used it. 11 of my 27 topics don't have any yet, and on those pages a script hid the empty section after the page had already painted. Everything below it moved up.

CSS can't fix this one, because the browser can't know a section will be empty until the script checks. But Webflow can know before the page is even sent. In the Designer: select the section › Settings › the small purple dot next to **Visibility** › **+ Add condition** › *Missions* › *is set*. Now Webflow leaves the section out of the HTML on pages where the field is empty, and nothing moves because nothing was ever there.

That's my favorite kind of fix: it removes code instead of adding it.

## What I'd check on any Webflow site

- **Measure with the CPU slowed down,** at a phone width and two desktop widths, on at least one page from every CMS template.
- **Script-filled boxes get a `min-height`,** never `display: none` while they're empty.
- **Give your web fonts a size-matched fallback** and preload the main one. Webflow's default `sans-serif` fallback is a different size.
- **Split text should start in its final layout.** If words end up `inline-block`, start them that way.
- **Use conditional visibility for empty CMS sections,** so they're left out before the page loads, not hidden after.
- **Don't trust a single huge number.** One of my pages showed an 8.8-second LCP in Lighthouse. Its observed load time was about 2 seconds; the 8.8 was Lighthouse's simulated estimate, not a delay anyone actually saw.

A page that sits still while you read it doesn't get noticed. That's the point. (Why waiting *feels* longer than it is: [One hour there, seven years here](/observatory/interstellar-time-dilation-perceived-performance).)

---

**Review notes**
- All numbers from `docs/qa-report.md` (Re-check at v0.33.27, Follow-up diagnosis, Layout jumps site-wide v0.33.29/30) and a fresh measurement 2026-10-03 (Playwright, Chrome, 4× CPU, 2 runs; topic pages before vs after the `.is-ks-topic` rule injected into the live page). Fallback values copied from `code/src` (`Geist Fallback`, `JetBrains Mono Fallback`). Ask-box `min-height` 312px is the phone value; other steps 295/252/209/167.
- ⚠️ **Cause 3's fix isn't live yet.** It's in `code/src/ab-knowledge.css`, uncommitted; ship it (ab-knowledge CSS on the Topics template head) before publishing this note, then re-measure and update the "0.017 or less" figure if it changes.
- P1 (conditional visibility) done and verified 2026-10-03.
- Mission LCP 8.8 s: Lighthouse observed LCP 1.7–2.3 s, 8.5 s simulated (qa-report Follow-up).
- Personal (Angelino, 2026-10-03): noticed it on mobile as backgrounds changing where a light and a dark section meet.
- Link: note 09 (interstellar-time-dilation-perceived-performance). No em dashes, US spelling.
