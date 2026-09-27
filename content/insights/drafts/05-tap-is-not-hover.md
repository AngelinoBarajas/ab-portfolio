---
status: draft · for Angelino's review
title: Tap is not hover: the touch bug hiding in interactive Webflow builds
slug: tap-is-not-hover-touch-bugs
theme: Build notes
topics: [Touch, Pointer events, Interaction, Mobile, Debugging]
services: [motion, webflow-development]
missions: []
meta_description: On phones, one tap fires enter, leave and click in a row. If your hover code toggles state, it can undo the tap before your click handler sees it.
---

**The short answer:** on a touchscreen, a single tap fires `pointerenter`, `pointerleave` and then `click`, one after another. If hover code opens something on enter and closes it on leave, it closes it again before your click handler runs. Ignore touch in the hover handlers (`if (e.pointerType === 'touch') return;`) and let taps use `click` alone.

## The bug

On my About page there's an Interstellar card. On desktop, you hover it and a little ring ship flies close to a black hole. Up close, tapping the black hole fast fires the ship's thrusters. On phones, tapping did... nothing. The card flew close, but the thrusters never fired.

## What was actually happening

Here's the order of events for one tap:

1. `pointerenter` → my hover code added `is-close`.
2. `pointerleave` → my hover code removed `is-close`.
3. `click` on the black hole → "is the ship close?" No. Ignore the tap.
4. `click` bubbles to the card → the tap toggle sets `is-close` again.

So the ship *looked* close, but every thruster tap was checked in the split second when it wasn't. Two handlers, each correct on its own, cancelling each other out.

## The fix

```js
card.addEventListener('pointerenter', function (e) {
  if (e.pointerType === 'touch') return; // taps use click
  card.classList.add('is-close');
});
card.addEventListener('pointerleave', function (e) {
  if (e.pointerType === 'touch') return;
  card.classList.remove('is-close');
});
```

Mouse and pen still get hover. Touch gets one clear path: tap to open, tap to close.

## How to catch these before a client does

- **Log the event order** once on a real phone. You'll be surprised what a tap sends.
- **Don't trust desktop emulation alone.** Device mode fakes the screen size, but its clicks still arrive as mouse clicks.
- **Test with synthetic events** when you can't hold the device: dispatch `PointerEvent`s with `pointerType: 'touch'` in the order a real tap uses, then assert the state.

## The general lesson

Hover is a mouse idea. On touch there's no "hovering", only a tap that briefly pretends. Any interaction that means something on hover needs a separate, deliberate answer for touch.

---
**Review notes**
- This is the v0.23.5 fix from this session, told plainly. You may want to link the About page card once the article is live.
