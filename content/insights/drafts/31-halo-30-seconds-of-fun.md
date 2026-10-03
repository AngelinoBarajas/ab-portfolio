---
status: draft
title: Thirty seconds of fun: what Halo taught me about the smallest loop on a website
slug: halo-30-seconds-of-fun-interaction-loop
theme: Why before how
topics: [Micro-interaction, Motion + scroll, Philosophy at work]
services: [motion, branding]
missions: [ab-identity]
meta_description: Halo's designers built a whole game around one 30-second loop that felt good every time. Websites have loops too: drag, release, return. How to find yours, polish it until it's satisfying, and repeat it instead of adding more features.
---

**The short answer:** Halo's designers talked about the game as "thirty seconds of fun" repeated over and over: see enemies, pick an approach, fight, recover, go again. If those thirty seconds felt great, the rest of the game could be the same loop in new places. Websites have loops too, just smaller: hover, click, drag, release, scroll. The lesson is to find the one small interaction people will repeat on your site, make it feel good every single time, and reuse it, instead of adding ten more features nobody plays with twice.

## Standing on the ring

In an earlier note I wrote that the first time this site worked as a whole, it felt like landing on the first Halo ring and just standing there looking around ([The Alchemist and the treasure under the sycamore](/observatory/alchemist-design-trends-going-home)). That moment is a good place to start, because it's the *opposite* of thirty seconds of fun. It's the big view. The thing that makes you stay, though, isn't the view. It's what you do next, and how good it feels to do it again.

My Halo moment is a specific one. The first real mission: you land, there's a Warthog, and a marine tells you to get in. I was playing alone, and it was amazing. Not because of the view, but because the game handed me something to *do*, and doing it felt great.

## The loop that carried a whole game

*Halo: Combat Evolved* launched with the original Xbox in 2001. Jaime Griesemer, one of its designers at Bungie, is usually credited with describing it as the same thirty seconds of fun, repeated. Roughly:

1. **You see a problem.** A group of enemies, a vehicle, a ridge.
2. **You choose an approach.** Rush in, throw a grenade first, find a better angle, grab a different weapon.
3. **You fight.** Shoot, throw, melee. Each one fast and readable.
4. **You recover.** Duck behind cover, and your shield recharges in a few seconds.
5. **Go again,** somewhere new, with slightly different pieces.

The recharging shield is the clever part. It ends each loop cleanly and resets you for the next one, so a mistake costs you a few seconds, not the whole level. And because the loop itself felt good, Bungie could spend the rest of the game *varying* it (indoors, outdoors, on foot, in a tank) instead of inventing new systems.

## Websites have loops too

Most websites don't think of themselves as having a core loop. But every interactive site does. It's the small thing a person does, gets a response to, and might do again:

- Hover a card, it lifts.
- Click a button, something happens.
- Drag something, let go, watch it settle.
- Scroll, and the next part arrives.

These loops are much shorter than thirty seconds. More like one or two. But the same rule applies: if that tiny moment feels good, people repeat it. If it feels dead, or slow, or slightly broken, they stop, and they don't come back to try again.

## The loops on this site

When I look at my own site through this lens, the interactions that people actually play with all share a shape: **grab, let go, it comes back.**

- **The hero words.** On the homepage you can grab the words of the headline and throw them. They keep their momentum, bump into the edges and stop.
- **The planet.** There's a planet in the services grid you can drag and fling, and it settles back into place.
- **The tool orbit.** You can pull a tool's icon out of its orbit and let go. It finds its way back.
- **Player one.** On the About page there's a little game card. Click it, get XP. Click enough and you level up. (Click a lot more and something hidden happens: [How I hid a boss fight](/observatory/hidden-boss-fight-webflow-build).)

None of these are features in the business sense. They don't sell anything. But they're the moments people mention when they show the site to someone else, and that's a kind of value too.

What makes them work is what makes Halo's loop work:

- **Instant response.** The object moves the moment you touch it. Any delay and it feels like a picture of a thing, not a thing.
- **Readable feedback.** Momentum, a bump, a number going up. You always know what your action did.
- **A clean reset.** It returns to its place. Like the recharging shield, the reset makes it safe to play again, so you do.
- **Small variations.** Same loop, different objects, different pages. You learn it once and get to enjoy it everywhere.

## Polish the loop, don't add features

The temptation on any project is to add more: another section, another effect, another widget. Halo's lesson pulls the other way. Find the loop people will repeat most, then spend your time making that loop better.

For the drag-and-release loop on this site, most of the time went into things you'd never notice unless they were missing:

- **The throw has weight.** It keeps going after you let go and slows down naturally, instead of stopping dead.
- **The edges are soft.** Things bounce gently at the boundary instead of hitting a wall.
- **Touch and mouse both feel right,** which took its own work. ([Tap is not hover](/observatory/tap-is-not-hover-touch-bugs) is about why.)
- **Motion off is a choice, not a broken page.** With reduced motion on, the throwing switches off and things stay put, while every link, card and button still works. ([Reduced motion without losing the magic](/observatory/reduced-motion-without-losing-the-magic).)

That's the unglamorous part of "fun": tuning a single moment until it feels right, then leaving it alone.

## In practice

- **Find your loop.** What's the one thing people do on your site most often? Hover a product, open a menu, filter a list, scroll a story.
- **Time it.** Does it respond instantly? Count the frames if you have to.
- **Make the result readable.** After the action, can you tell what happened, without reading anything?
- **Give it a clean reset.** Close, return, undo. Make it safe to do again.
- **Reuse it.** One well-made interaction, used everywhere, beats five different ones.
- **Only then add more.** And only if the new thing is as good as the loop you already have.

Halo didn't need a hundred ideas. It needed one good thirty seconds. Most websites need one good second.

---

**Review notes**
- *Halo: Combat Evolved*, Bungie, launch title for the original Xbox (November 2001). "Thirty seconds of fun" is widely attributed to Bungie designer Jaime Griesemer (early 2000s interviews); the exact first source is hard to pin down, so the note says "usually credited." The five-step loop is a paraphrase of how the idea is commonly described, not a quote. Recharging shields: Halo popularized them; not claimed as first.
- Personal: the Halo ring comparison is Angelino's own, from note 19 (2026-09-30). The Warthog memory is his (2026-10-03): first real mission, the Warthog, a marine telling him to get in, playing alone. Kept to what he said; no level names.
- Site facts: draggable hero headline words with inertia and bounds (`home/00-hero.js`, Draggable + InertiaPlugin, edgeResistance); throwable planet in the Home services bento; tool orbit lede "Pull a tool out of orbit and let go. It finds its way back." (Home); Player one XP card and level-up toasts (`about/00-about.js`). Reduced motion: hero drag is only set up when motion is on (`home/00-hero.js:47`).
- Links: notes 19, 22, 05, 07. No em dashes, US spelling.
