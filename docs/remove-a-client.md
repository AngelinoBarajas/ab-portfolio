# Removing a client from the site

If a client asks not to be shown, one switch takes them off the whole site.

## Do this

1. Webflow › CMS › **Missions** › the client's mission.
2. Turn on **Hide from site**. Save.
3. **Publish** the site.

That's it. To bring them back, turn the switch off and publish.

## What the switch removes

| Where | How |
|---|---|
| Work archive grid | Designer filter (Hide from site is off) |
| Home work board | Designer filter |
| Home testimonials ("Incoming") | CMS list of Missions › Client quote, filtered; the section hides itself if no quotes are left |
| Mission switcher + "next mission" card | switcher is filtered; the next card follows the switcher |
| The mission's own page (`/work/<slug>`) | sends visitors to `/work` (script) |
| Services pages › Related missions | cloned from the Work grid, so hidden missions never appear |
| Services hub › logbook + flight plans ("flown before") | hub Missions list is filtered |
| Process › "flown before" examples | hidden list `[data-hidden-missions]`; the script skips hidden examples |
| 404 page | no client names at all |

## Why not Unpublish?

Webflow refuses to unpublish an item while other published items reference it (a mission is referenced by its channels, systems, stats, problems, the Services it belongs to and other missions' "next mission"). Unpublishing means clearing every one of those first. The switch avoids all of that.

## Deleting a client for good

Only if the mission should never come back: set the switch on and publish first (so nothing breaks), then in the CMS delete or unpublish its Mission Channels, Mission Systems, Mission Stats, Problems Solved and Globe Pins items, remove it from each Service's **Related missions**, clear any **Next mission** / **Process example** that points at it, and finally delete the mission.

## Rule for new content

Client names live **only in the CMS** (Missions and the collections that reference them). Don't type a client's name or link their page as static text in the Designer: static copy can't be switched off. If a page needs to feature a mission, use a Collection List of Missions filtered by *Hide from site is off*.

## Currently hidden

- **Daniel Aguirre Law** (2026-09-26, Angelino's call). The mission, its page and its quote stay in the CMS; Process examples for Webflow development and Performance now point at 510 Visuals.
