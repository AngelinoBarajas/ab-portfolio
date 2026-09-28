---
status: approved
title: Smooth scroll without the stutter: Lenis + GSAP in Webflow
slug: lenis-gsap-webflow-smooth-scroll
theme: Build notes
topics: [GSAP, Lenis, Smooth scroll, Motion, Performance]
services: [motion, performance]
missions: [510-visuals]
meta_description: Smooth scroll that stutters usually has two clocks fighting. Drive Lenis from GSAP's ticker, load its stylesheet, and pause what's off screen.
---

**The short answer:** most Lenis + GSAP stutter in Webflow comes from three things: two animation clocks running at once, Lenis's stylesheet missing, and canvas animations that never pause. Drive Lenis from `gsap.ticker`, add Lenis's CSS, and stop anything that isn't on screen.

## 1. One clock, not two

Lenis ships with its own `requestAnimationFrame` loop. GSAP has another. Run both and the scroll position and your ScrollTriggers update on slightly different beats, which reads as a tiny, maddening judder.

```js
var lenis = new Lenis({ autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

Now there's one heartbeat: GSAP ticks, Lenis moves, ScrollTrigger reads the new position in the same frame.

## 2. Load the Lenis stylesheet

Lenis relies on a few CSS rules (on `html.lenis`, `.lenis-smooth` and friends). Without them, the browser's own smooth scrolling and scroll anchoring fight Lenis. It's one `<link>` in your site head and easy to forget.

## 3. Pause what nobody can see

A WebGL scene or a canvas starfield that keeps drawing while it's off screen steals frame time from the scroll. Pause it:

```js
new IntersectionObserver(function (entries) {
  entries[0].isIntersecting ? scene.play() : scene.pause();
}).observe(document.querySelector('.scene'));
```

Same for hidden tabs: stop the loop when `document.hidden` is true. If the thing you're pausing is a 3D scene, [Interactive 3D in Webflow that doesn't wreck your mobile score](/observatory/interactive-3d-webflow-performance) covers the rest: loading it late and drawing fewer pixels on phones.

## Two smaller ones

- **Panels that grow on click.** If a section expands under the reader, the browser's scroll anchoring can jump the page by hundreds of pixels. Give that area `overflow-anchor: none`.
- **Nested scroll areas.** A scrollable list inside a Lenis page won't scroll with the wheel until you add `data-lenis-prevent` to it.

## How to know it's fixed

Record the page with the Performance panel open while you scroll. You want one steady rhythm of frames, not two interleaved ones, and no long tasks landing mid-scroll. Then try it on a mid-range phone, because that's where your visitors actually are.

---
**Review notes**
- These are the fixes from your own site's scroll work (the "smoothness trio").
- The Lenis option name `autoRaf` matches recent Lenis versions; double-check against the version you load before publishing.
