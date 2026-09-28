---
status: approved
title: Interactive 3D in Webflow that doesn't wreck your mobile score
slug: interactive-3d-webflow-performance
theme: Build notes
topics: [Interactive 3D, WebGL, Three.js, Performance, Mobile]
services: [webgl-data, performance]
missions: [510-visuals]
meta_description: A 3D scene can sit on a Webflow page without slowing the first screen. Load it late, pause it off screen, draw fewer pixels on phones, and always have a still fallback.
---

**The short answer:** heavy 3D doesn't have to mean a slow page. Load the scene only when it's about to be seen, pause it whenever it's off screen, render at a lower pixel ratio on touch devices, and give reduced-motion visitors a still image. The first screen stays fast because the 3D isn't on the critical path at all.

## Why 3D is worth it

A globe of installations, a product you can turn, a map of case results: interactive 3D can show in two seconds what a paragraph fails to say. The goal isn't spectacle. It's giving visitors something they can use to decide.

## Rule 1: don't load it until it matters

```js
var io = new IntersectionObserver(function (entries) {
  if (!entries[0].isIntersecting) return;
  io.disconnect();
  loadScene(); // import Three.js, build the scene
}, { rootMargin: '400px' });
io.observe(document.querySelector('[data-scene]'));
```

The library, the models and the textures all wait. Until then, a lightweight poster image holds the space so nothing jumps when the scene arrives.

## Rule 2: pause it when nobody's looking

A render loop that keeps running below the fold burns battery and steals frames from scrolling. Keep the same observer and pause and resume. Stop it on hidden tabs too.

## Rule 3: draw fewer pixels on phones

Phones have very dense screens. Rendering at their full pixel ratio multiplies the work for detail nobody can see at arm's length.

```js
renderer.setPixelRatio(matchMedia('(pointer: coarse)').matches ? 1 : Math.min(devicePixelRatio, 2));
```

## Rule 4: a fallback that still tells the story

For visitors with **reduced motion** turned on, and for older devices, show a still frame of the scene with the same information. The point of the 3D is the information; the motion is a bonus. (Designing that still frame on purpose, rather than just switching things off, is the subject of [Reduced motion without losing the magic](/observatory/reduced-motion-without-losing-the-magic).)

## Rule 5: measure on a real phone

Lighthouse on a desktop tells you very little. Test on a mid-range phone over a normal connection, and look at when the first screen appears and whether scrolling stays smooth once the scene is running.

## What to put in the CMS

Keep the data (locations, products, results) in Webflow collections and let the scene read it from `data-` attributes on hidden list items. Your team adds an item, publishes, and the 3D updates itself, no developer needed.

---
**Review notes**
- Matches what the 510 Visuals globe and this site's planets do. No performance numbers claimed.
- Positioning follows your direction: interactive 3D that's useful to clients and visitors, not "globes".
