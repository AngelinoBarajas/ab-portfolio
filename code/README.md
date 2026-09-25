# Custom code

`src/` holds one file per module from `docs/code-map.md`. `dist/` holds the minified builds Webflow loads from jsDelivr.

Shape of every module:

```js
window.Webflow = window.Webflow || [];
window.Webflow.push(function() {
  if (window.__abModuleNameInit) return;
  window.__abModuleNameInit = true;
  if (!window.gsap) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ...
});
```

Suggested bundles: `ab-core.js` (site-wide: starfield, planets, nav, selection UI, frame labels, Lenis, reveals, footer + black hole, cursor HUD, toast, warp transitions), `ab-home.js`, `ab-work.js`, `ab-mission.js`, `ab-services.js`, `ab-about.js`, `ab-404.js`.
