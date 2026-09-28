---
status: approved
title: Mercury, Gemini, Apollo: how to start a big, slightly crazy website
slug: mercury-gemini-apollo-start-big-website
theme: Why before how
topics: [Discovery, Prototyping, Scope creep, Asking better questions]
services: [webflow-development, design-systems]
missions: [cks]
meta_description: Nobody flew to the Moon on the first try. How to start a huge website, app or redesign: fly the riskiest piece first, keep the ambition, and shrink the first step.
---

**The short answer:** don't start a big idea by building all of it. Start by finding the one part most likely to fail, and fly that first, small and cheap. NASA didn't go to the Moon in one mission. It went through Mercury, Gemini and a string of Apollo test flights, each one proving a single scary thing. A huge website, app or redesign works the same way: keep the ambition whole, make the first step tiny, and let every step answer one question.

## The Moon was not one mission

In 1962 President Kennedy stood in a stadium in Houston and said the United States would go to the Moon before the decade was out. At that point, NASA had put one American into orbit. Nobody knew how to dock two spacecraft, whether people could work outside a capsule, or how to navigate a quarter of a million miles and come back.

So they didn't try the Moon. They broke it into questions:

- **Mercury** asked: can a person survive in orbit at all?
- **Gemini** asked: can two spacecraft find each other and dock? Can an astronaut work in a spacesuit outside the ship? Can a crew last two weeks?
- **Apollo 8** asked: can we get to the Moon and back? (It orbited and came home, no landing.)
- **Apollo 10** flew the whole landing rehearsal, down to about nine miles above the surface, and then turned around on purpose.

When Apollo 11 landed in July 1969, almost nothing about the mission was a first. Every hard part had already flown on its own. The giant leap was really a lot of carefully sized steps.

## Gall's Law

In 1975 a doctor named John Gall wrote a funny, cranky book about why systems fail, and one idea from it became famous among engineers. Paraphrased: every complex system that works grew out of a simple system that worked. A complex system designed from scratch never works, and you can't patch it into working. You have to start over with a simple one that does.

Big web projects break this law all the time. The plan is a 40-page site, a CMS with fifteen collections, a 3D hero, a booking flow and a new brand, all launching on the same day. Everything depends on everything, so nothing can be tested until all of it exists. That's a Moon landing on the first flight.

## Find your Gemini question

The trick is to ask: **what's the part that, if it doesn't work, sinks the whole idea?** That's the first thing you build. Some examples:

- **A redesign:** one real page, end to end. Real content, real type, real mobile layout. If the new direction can't carry a messy real page, it doesn't matter how the homepage mockup looks.
- **An ambitious interactive site:** the one interaction everything else depends on, running on a mid-range phone. If the globe stutters there, better to know in week one.
- **An app:** the core loop. The single thing a person does over and over. Not the settings screen, not the onboarding, not the dark mode.
- **A content-heavy site:** the CMS structure, with twenty real entries in it. The data model is the part that's painful to change later.

Everything else is Apollo 11. It will be easier once the scary part has flown.

## How this site was flown

This site was a big, slightly crazy idea too: a portfolio built like a space program, with planets, warp transitions and a mission archive. It didn't start in Webflow.

- **Prototypes first.** Every page was designed and built as a plain HTML prototype, where it was cheap to throw things away. Only approved pages were rebuilt in Webflow, and the prototypes became the spec.
- **Staging before the world.** Everything ships to a test address first and gets checked there. The real domain comes last.
- **Every release has a number.** Each version of the custom code is tagged, so any step can be undone. [Versioned custom code for Webflow](/observatory/webflow-custom-code-github-jsdelivr) shows the setup.
- **Test flights are labeled.** Concept projects on this site carry a *Test flight* badge: a proof of concept, flown to answer a question, not a finished product. [CKS](/work/cks) is one.

## Keep the Moon, shrink the step

The mistake isn't dreaming too big. Kennedy's goal was ridiculous, and that was useful: it made every smaller mission obviously worth doing. The mistake is making the *first step* as big as the dream.

- **Write the Moon down.** One sentence: what does this look like when it's done, and why does it matter?
- **List the scary questions.** Not features. Questions, like "can this run on a phone?" or "will the team actually update this?"
- **Fly the scariest one first.** Small, fast, real content, real device.
- **Decide after each flight.** Keep going, change course, or scrap it. A cancelled test flight is cheap. A cancelled launch isn't.
- **Say no to extra payload.** New ideas go on the list for a later mission, not onto this one. (Scope creep has its own note: [The camel, the lion and the child](/observatory/nietzsche-three-metamorphoses-scope-creep).)

A big idea doesn't need a big first step. It needs a first step that tells you something.

---

**Review notes**
- Space history is standard and paraphrased: Kennedy's Rice University speech (Sept 1962; one American orbital flight by then, Glenn, Feb 1962), Mercury, Gemini (rendezvous, docking, EVA, 14-day Gemini 7), Apollo 8 (lunar orbit, Dec 1968), Apollo 10 (descent to roughly 47,000 ft / ~9 miles, May 1969), Apollo 11 (July 1969).
- Gall's Law from John Gall's *Systemantics* (1975), paraphrased, no quote.
- Site facts from this build: HTML prototypes first (`prototypes/`, "the prototypes are the spec"), staging-only publishing on webflow.io, tagged releases via jsDelivr, the *Test flight* Mission Type on CKS (and kip). The "40-page site" is a hypothetical, not a client.
- Links to note 10 (*The camel, the lion and the child*) by title; check that the CKS mission slug is `cks` on import.
