---
status: approved
title: One hour there, seven years here: Interstellar and why waiting feels longer than it is
slug: interstellar-time-dilation-perceived-performance
theme: Why before how
topics: [Science, Time, Perceived performance, Loading states, Interstellar]
services: [performance, motion]
missions: []
meta_description: In Interstellar, time runs slow near a black hole because gravity bends it. On the web, time bends too, in the visitor's head. What physics, philosophy and psychology each say about a loading screen.
---

**The short answer:** in *Interstellar*, an hour on Miller's planet costs seven years back home, because a huge mass nearby really does slow time down relative to a distant observer. On the web, time bends in a different way: a wait with nothing to look at *feels* longer than the same wait with visible progress. You can't change physics, but you can change how a wait is experienced, by showing something useful immediately and making progress visible.

## The physics, briefly

Einstein's general relativity says gravity isn't only a force; it's the shape of spacetime. Close to a very massive object, clocks tick more slowly compared with clocks far away. This isn't a trick of perception. GPS satellites have to correct for it (along with the effect of their speed) or their positions would drift.

The film pushes the idea to an extreme: Miller's planet orbits very close to a supermassive black hole, so close that the crew's hour on the surface costs them years relative to Earth. The physicist Kip Thorne advised the production so the science would hold up, and the black hole itself, Gargantua, was rendered from equations he worked out with the visual effects team.

The detail I love is that nobody on Miller's planet *feels* slow. Their watches tick normally. Their hour is a real hour. Time dilation only shows up when two clocks are compared. Which is exactly the situation of a website and its visitor.

## Two clocks: the one on the wall and the one in your head

Philosophers noticed long before Einstein that time isn't one simple thing. Saint Augustine wrote in his *Confessions* that he knew perfectly well what time was, until someone asked him to explain it. His best answer was that we measure time in the mind: the past as memory, the future as expectation, the present as attention.

Much later, the French philosopher Henri Bergson drew a line between clock time, which is measured and divided into equal pieces, and *durée*, lived duration, which stretches and shrinks with what we're experiencing. Ten minutes in a dentist's chair and ten minutes with a friend are the same on the clock and nothing alike in *durée*.

A loading screen lives in Bergson's second kind of time. Your analytics measure the clock. Your visitor lives the duration.

## The other kind of slow time

Visitors don't carry atomic clocks. They carry attention. And attention stretches time when there's nothing to hold it: a blank white screen for a couple of seconds feels far longer than the same seconds spent watching content arrive.

Psychologists have studied this in a very un-cinematic place: lines. In a well-known 1985 paper, *The Psychology of Waiting Lines*, David Maister set out a few principles that anyone who has queued will recognize:

- **Occupied time feels shorter than unoccupied time.**
- **Uncertain waits feel longer than known, finite waits.**
- **Unexplained waits feel longer than explained waits.**
- **Waits before a process starts feel longer than waits once it's underway.**

Every one of those maps onto a page load. A blank screen is unoccupied, uncertain, unexplained and hasn't visibly started. It's the worst possible way to spend two seconds.

## What that means on a website

That's why good loading design isn't only about making things faster (though do that too). It's about what the visitor experiences while they wait.

- **Show something real, right away.** Text and layout first, heavy media after. A page that's readable in a second feels fast even if a 3D scene is still loading below.
- **Make progress visible.** A skeleton of the layout, a progress bar that actually moves, a counter. Uncertainty is what makes waiting hurt.
- **Start the process on screen.** Once something is visibly happening, the wait is "underway", and it feels shorter.
- **Keep movement honest.** A spinner that loops forever tells people nothing. A step that fills tells them the wait will end.
- **Don't hide the wait behind decoration.** A long intro animation feels like the site is wasting your time, because it is.

## Designing with the second clock

On this site, moving between pages is a short warp: the stars stretch, then the next page arrives. It isn't there to delay you. It gives the eye something to follow during the moment the next page is loading anyway, so the wait is occupied instead of blank. When a visitor has asked for reduced motion, the warp becomes a simple fade, because an occupied wait should never cost someone their comfort.

The same idea runs through every heavy piece I build. A 3D globe loads only when it's about to come into view, and there's always something readable above it. The expensive thing arrives while you're already busy with the useful thing.

## The point

In the film, time dilation is the price of getting close to something enormous. On the web, there's no reason to pay it. Measure the clock on the wall, but design for the clock in the visitor's head: get people to the good part first, and let the heavy, beautiful things arrive while they're already reading.
