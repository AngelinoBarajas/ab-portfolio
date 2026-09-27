---
status: approved
title: Versioned custom code for Webflow: GitHub, jsDelivr and SRI
slug: webflow-custom-code-github-jsdelivr
theme: Build notes
topics: [Custom code, GitHub, jsDelivr, SRI, Handoff]
services: [webflow-development, custom-deploys]
missions: [510-visuals]
meta_description: Keep Webflow custom code in GitHub, serve each release from jsDelivr pinned to a tag, and lock it with a subresource integrity hash. Rollbacks become one line.
---

**The short answer:** write your custom code in a GitHub repo, tag every release (`v1.4.0`), and load it in Webflow from jsDelivr pinned to that tag with an `integrity` hash. Every deploy is a new URL, so there's no cache to fight, a bad release rolls back by changing one version number, and the browser refuses a file that doesn't match its hash.

## The problem with pasting code into Webflow

Webflow's custom code fields are fine for a few lines. Past that, code pasted into a settings box has no history, no review and no way back. The next developer finds 30 KB of mystery JavaScript and no idea which part is safe to touch.

## The setup

1. **A repo** with `src/` (readable modules) and `dist/` (built files).
2. **A build step** that bundles, minifies and writes a hash for each file.
3. **A tag per deploy:** `git tag -a v1.4.0 && git push --tags`.
4. **Load it from jsDelivr, pinned to the tag:**

```html
<script src="https://cdn.jsdelivr.net/gh/you/site@v1.4.0/dist/site.prod.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
```

## Why pin a tag and not `@main`

`@main` is cached and changes under you. A tag never changes, so the URL *is* the version. Want the previous release back? Change `v1.4.0` to `v1.3.2`. That's the whole rollback.

## What the integrity hash buys you

The `integrity` attribute tells the browser what the file must hash to. If the CDN ever serves something different, it won't run. It also catches your own mistakes: if the hash doesn't match, you deployed a different file than you built.

## Two gotchas from real deploys

- **Don't name files `*.min.js`.** jsDelivr can serve its own minified copy of a `.min.js` path, which won't match your hash. Name builds `*.prod.js`.
- **Verify before you switch.** A brand-new tag can take a minute to appear on the CDN. Fetch the file, hash it, compare with your build's hash, and only then update Webflow.

## The handoff payoff

The client's team sees a short, readable list of scripts with version numbers. A developer who inherits the site gets a repo with a changelog. Nobody has to be afraid of the custom code tab.

---
**Review notes**
- This is exactly how this site and 5 TEN ship code. Swap "you/site" for a real example repo if you'd like to link yours (it's public).
