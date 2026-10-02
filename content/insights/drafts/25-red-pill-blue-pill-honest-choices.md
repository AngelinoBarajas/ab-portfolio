---
status: approved
title: Red pill, blue pill: every interface is a choice you design
slug: red-pill-blue-pill-honest-interface-choices
theme: Why before how
topics: [Philosophy at work, Micro-interaction, Reduced motion]
services: [webflow-development, branding]
missions: [ab-identity]
meta_description: Morpheus tells Neo exactly what each pill does before he chooses. Most websites don't. Sartre on why we can't escape choosing, dark patterns, and how to design a choice that respects the person making it.
---

**The short answer:** every screen with two buttons on it is a choice someone designed, and the design always leans one way or the other. Sartre said we're "condemned to be free": we can't get out of choosing, and even refusing to choose is a choice. Websites can't get out of it either. You decide which option is bigger, which one is already ticked, which one is worded to make you feel bad. Morpheus is a surprisingly good model here. He tells Neo exactly what each pill does, holds them out evenly, and lets him pick. That's what an honest interface looks like.

## Two pills, one in each hand

I've watched the first *Matrix* more times than I can count. It's one of my favorite movies because underneath the kung fu and the slow-motion bullets, it's asking real philosophical questions. The pill scene is the most famous one, famous enough that "red pill" became its own word. Morpheus holds out his hands. Blue: the story ends, Neo wakes up in his bed and believes whatever he wants. Red: he stays in Wonderland, and Morpheus shows him how deep the rabbit hole goes.

What I notice now, watching it as a designer, is how *fair* the setup is.

- **Both options are explained before the choice.** No fine print, no "learn more" link.
- **They're the same size.** One pill in each hand. Neither one glows.
- **Nothing is chosen for him.** Morpheus doesn't slip one into his drink.
- **He's even told what he isn't getting.** Morpheus says he's only offering the truth, nothing more. No promise that it'll feel good.

And then the movie does something brave: it shows someone regretting the red pill. Cypher, one of the crew, ends up wishing he'd taken the blue one. He'd rather have the steak that isn't real. *Ignorance is bliss*, he says. The movie doesn't pretend the honest choice is always the happy one. It just insists that it was his to make.

## Condemned to be free

Jean-Paul Sartre gave a lecture in Paris in 1945 that became the short book *Existentialism Is a Humanism*. The idea everyone remembers is that we're "condemned to be free." Nobody hands us a script. We're thrown into the world and have to choose, and we're responsible for what we choose.

The part I think about most is the trap door he closes: you can't escape by not choosing. If you refuse to decide, that's a decision too, with consequences you own.

Websites have the same problem, just smaller. There's no neutral layout. If one button is orange and the other is gray text, you've chosen. If the box is pre-ticked, you've chosen *for* them. If the "no thanks" link says "No, I don't like saving money," you've chosen to make them feel stupid for disagreeing. The question isn't whether you influence the decision. You will. The question is whether you're honest about it.

## The blue pill nobody chose

There's a name for the dishonest version. In 2010 a UX designer named Harry Brignull started calling them **dark patterns**: interfaces built to trick people into things they didn't mean to do. You've met all of them:

- **The pre-ticked box.** You "agreed" to the newsletter because you didn't notice the check.
- **Confirmshaming.** The decline link is written to make you feel bad: "No thanks, I'll stay uninformed."
- **The roach motel.** Signing up takes one click. Canceling takes a phone call during business hours.
- **The disguised option.** "Accept all" is a big bright button. "Manage settings" is small gray text, three screens deep.

That last one is the blue pill nobody chose. It's a choice that was made for you, dressed up as one you made yourself.

This isn't just a design-ethics argument anymore. In 2019 the EU's top court ruled in the *Planet49* case that a pre-ticked box doesn't count as cookie consent. Regulators in the US have published reports on dark patterns too. The law is slowly catching up to something Morpheus understood in 1999: a choice only counts if the person actually makes it.

## How I tried to build it fair

This site has an actual red pill and blue pill. They're the end of a hidden side quest: a white rabbit hops into a terminal on the homepage, and if you follow it, the screen goes to Matrix rain and the two pills appear. (The full story of the rabbit is in [Follow the white rabbit](/observatory/follow-the-white-rabbit-curiosity-design).)

It's just an easter egg. But it was a good excuse to practice the rules on something small:

- **Both choices are spelled out first.** The two lines from the movie type out before the pills appear, so you know what each one does before you can click.
- **Same size, same weight.** Two pixel pills side by side. Hover one and the other line dims, so you can see what you're pointing at.
- **No default.** Nothing is pre-selected. (On a keyboard, the focus has to start somewhere, so it lands on the first pill, but nothing happens until you choose.)
- **A real way out.** There's an "Esc · Wake up" button the whole time. Leave without choosing, and nothing gets logged. Not choosing is allowed, and it's treated as its own choice.
- **Both endings are real.** The blue pill isn't a punishment. Your eyes blink open, a little blurry, and you're back on the page. The red pill shows you every side quest hidden on the site. Different, not better or worse.

The same thinking shows up in less silly places on the site:

- **The motion switch.** There's an "Engines on / off" switch in the nav that turns the site's animation off. If your device already asks for reduced motion, the site doesn't argue. It switches off and says so ("Engines off (device)"). You made that choice already, somewhere else. I don't get to overrule it.
- **The contact form.** It starts on a plain question by default. It only starts on "Book a call" if you clicked a button that said *Book a call*. The default follows what you already chose, not what I'd like you to choose.

## The rules I use

- **Explain both options before the choice.** If it needs fine print, it isn't a fair choice.
- **Make them look equal when they are equal.** Save the big bright button for when one option really is the main path, like "Send" on a form.
- **Never pre-tick for them.** An empty box is honest. A checked one is a guess about what they want that happens to suit you.
- **Write the "no" with respect.** "No thanks" is enough. Nobody should feel stupid for declining.
- **Make leaving as easy as joining.** If it's one click in, it's one click out.
- **Respect choices they already made.** Device settings, earlier clicks, a "no" last week.

## In practice

- **Audit your two-button moments.** Signup, cookie banner, upgrade prompt, cancel flow. For each one, ask: would I be comfortable explaining this layout to the person using it?
- **Read your decline copy out loud.** If it sounds like a guilt trip, rewrite it.
- **Count the clicks both ways.** Joining and leaving should cost about the same.
- **Check your defaults.** Every pre-filled field is a choice you made for someone.

Sartre would say you can't design without choosing for people a little. Morpheus would add: then at least tell them what's in each hand.

---

**Review notes**
- *The Matrix* (1999): the pill scene and what each pill means, Morpheus saying he offers only the truth, Cypher regretting the red pill and preferring the simulated steak. Paraphrased; only "ignorance is bliss" (3 words, a common idiom Cypher uses) is quoted.
- Sartre: "condemned to be free" (*Existentialism Is a Humanism*, lecture October 1945, published 1946; the idea also runs through *Being and Nothingness*, 1943). "Not choosing is still a choice" paraphrases his point that refusing to choose is itself a choice.
- Harry Brignull coined "dark patterns" in 2010 (darkpatterns.org, now deceptive.design); "confirmshaming" and "roach motel" are from his catalog. Example decline copy is invented to illustrate the genre, not quoted from a real site.
- *Planet49* (Court of Justice of the EU, C-673/17, October 2019): pre-ticked checkboxes are not valid consent for cookies. US: the FTC staff report *Bringing Dark Patterns to Light* (September 2022). Kept general on purpose; no legal advice.
- Site facts: pill screen in `home/20-services.js` (lines type before the pills appear, equal pills, hover dims the other line, keyboard focus starts on the first pill, "Esc · Wake up" leaves without logging the quest, blue = eyes blink open, red = every side quest decoded). Engines switch in `core/20-ui.js` (device reduced-motion shows "Engines off (device)", locked). Contact in `contact/00-contact.js` (channel 0 by default; `/contact#call` from the Book a call buttons preselects the call channel).
- Link: note 24 (/observatory/follow-the-white-rabbit-curiosity-design), publish 24 first or together. No em dashes, US spelling.
- Personal: the first *Matrix* is one of Angelino's all-time favorite movies because it's so philosophical (his words, 2026-10-02); the sequels deliberately not mentioned.
- Approved by Angelino 2026-10-02 ("publish them all").
