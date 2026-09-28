---
status: approved
title: Descartes' coordinates and a star chart of ideas
slug: cartesian-coordinates-star-chart
theme: Why before how
topics: [Philosophy, Knowledge System, Micro-interaction]
services: [webgl-data, cms-integrations]
missions: [knowledge-system]
meta_description: Descartes turned shapes into numbers by giving every point an x and a y. The Topics star chart on this site does the same to a vocabulary. How, and why it helps.
---

**The short answer:** Descartes' great mathematical idea was to give every point a pair of numbers, an x and a y, so that shapes could be described with algebra and equations could be drawn as shapes. The star chart on the Topics page does something similar with ideas: each topic in this site's vocabulary gets a position, a size and lines to its neighbors, so you can see how the ideas connect instead of reading a list. A map makes relationships visible that a list hides.

## The fly on the ceiling

There's a famous story that Descartes, lying in bed, watched a fly crawl across the ceiling and realized he could describe its position at any moment with two numbers: its distance from two walls. It's almost certainly a legend. The real idea arrived in *La Géométrie*, published in 1637 as an appendix to the same *Discourse on the Method* that gave us "I think, therefore I am".

Legend or not, the idea changed everything. Before it, geometry was about shapes and algebra was about numbers, and they barely spoke. Descartes (and, independently, Pierre de Fermat) joined them. A circle became an equation. An equation became a curve you could see. Almost every chart you've ever read, and every screen you're reading this on, runs on that marriage. Every pixel has an x and a y.

## A list is one-dimensional

This site has a shared vocabulary: 27 topics in six groups, from who I build for to the ideas I keep returning to. Every project, service and note is tagged with the topics it relates to.

On a page, a vocabulary is naturally a list. Lists are good for scanning and bad at showing relationships. You can read that "Mobile performance" and "Interactive 3D" are both topics, but not that they keep showing up together, or that one group of ideas is dense with connections while another is barely touched.

That's the same problem geometry had before Descartes. The information was there. It just had no space to live in.

## Giving every idea a position

The [star chart on the Topics page](/topics) gives the vocabulary a plane. Under the hood, it's plain coordinates:

- **Each of the six groups has a center**, an x and a y on the chart, so related topics cluster into a constellation.
- **Each topic sits at a small offset** from its group's center, placed by hand so labels don't collide.
- **Each star's size comes from a number**: how many links that topic has across the site. More links, bigger star. It grows with the square root of the count, so the busiest topics don't swallow the chart.
- **Dashed lines join two topics** whenever a single note is tagged with both. Those are the routes between constellations.

None of that is decoration. Every visual property is a value from the CMS, turned into a coordinate or a radius. Tag a new note, and the chart redraws itself with a new route.

## Zooming is just changing the window

When you drag or zoom the chart, nothing moves. The stars keep their coordinates. What changes is the window: which rectangle of the plane you're looking at, and how big. In the code, zooming literally rewrites four numbers, the x, y, width and height of the visible area. It's Descartes' plane with a movable frame on top.

One small detail would have amused him. On screens, the y axis points down. Every chart on the web is drawn in a coordinate system where "up" is negative, and every developer has made that mistake at least once.

## What a map shows that a list can't

Once a vocabulary has positions, it starts answering questions a list can't:

- A tight constellation with many lines inside it says those ideas really are one subject.
- A big star with few routes is a topic used often but rarely combined with others, which usually means an article waiting to be written.
- Lines running from the ideas group to the technical groups show where the "why" and the "how" actually meet, and where they don't yet.

That's the real value of Descartes' idea: once you give things coordinates, you can see structure you couldn't reason your way to.

## In practice

- If your content has tags, you already have data for a map.
- Give each group a place, and let the data decide size and connections.
- Keep the list too. Maps are for exploring; lists are for finding.
- Make the chart readable by keyboard and screen reader, not just by mouse.
- Let it redraw from the CMS, so it never goes stale.

A vocabulary is a set of ideas. Given coordinates, it becomes a sky you can navigate.

---

**Review notes**
- Chart facts from `code/src/knowledge/30-chart.js`: six group centers (hand-set x/y), per-topic hand-placed offsets, star radius = 3 + √links × 1.7, dashed routes = topic pairs that share an observation, pan/zoom = SVG viewBox (x, y, width, height). 27 topics in 6 categories per the current vocabulary.
- The patterns section is phrased as what the chart can show, not claims about the current chart.
- The fly story is flagged as legend; *La Géométrie* (1637) and Fermat's independent work are standard history.
