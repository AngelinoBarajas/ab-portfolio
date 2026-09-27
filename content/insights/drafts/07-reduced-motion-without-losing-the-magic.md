---
status: approved
title: Reduced motion without losing the magic
slug: reduced-motion-without-losing-the-magic
theme: Build notes
topics: [Accessibility, Reduced motion, Motion, GSAP]
services: [motion]
missions: []
meta_description: Some visitors ask their device for less motion. Honoring that doesn't mean a blank, lifeless site. Keep the information, calm the movement, and offer a still version of every moment.
---

**The short answer:** when a visitor's device asks for reduced motion, keep everything the motion was *saying* and drop only the movement. Check `prefers-reduced-motion` in every animation, replace big moves with a fade or a still end state, and design the still version on purpose rather than just switching things off.

## Who this is for

Motion can make people feel sick: vestibular disorders, migraines, or just a long day. Phones and computers let people ask for less of it, and a site can read that preference. It's a small check, and it matters to the people who turned it on.

## Check it everywhere, once

```js
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  gsap.from('.fade-up', { y: 40, opacity: 0, stagger: 0.08 });
}
```

In CSS, the same idea:

```css
@media (prefers-reduced-motion: reduce) {
  .spin, .float, .marquee { animation: none; }
}
```

Put the check in one shared place so every new animation gets it for free.

## Keep the meaning, not the movement

Ask what each animation is *for*:

- A counter ticking up shows a number → show the final number.
- A scroll-scrubbed timeline shows progress → show the finished timeline.
- A warp transition says "you're going somewhere" → a quick fade says it too.
- A game or a cutscene → skip to the result and let people read it at their own pace.

## Design the still version

The lazy version of reduced motion is a site where things are simply missing. The better version is a set of good still frames: the end state of each scene, composed like a poster. If you designed the animation, you already know which frame tells the story.

## Test it in thirty seconds

- **macOS:** Settings › Accessibility › Display › Reduce motion.
- **Windows:** Settings › Accessibility › Visual effects › Animation effects off.
- **Chrome DevTools:** Rendering › Emulate `prefers-reduced-motion`.

Then scroll the whole site and ask: did I lose any information? If not, you've done it right.

---
**Review notes**
- Mirrors the rule already in your code standards (a reduced-motion check in every animation) and how the boss fight handles it.
