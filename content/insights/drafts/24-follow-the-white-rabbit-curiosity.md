---
status: approved
title: Follow the white rabbit: curiosity as a design material
slug: follow-the-white-rabbit-curiosity-design
theme: Why before how
topics: [Micro-interaction, Philosophy at work, Brand identity]
services: [motion, branding]
missions: [ab-identity]
meta_description: Alice followed a rabbit with a pocket watch. Neo followed one on his screen. Aristotle said wonder is where thinking starts. Why an unexplained detail pulls people further than a button ever will, and how I hid a rabbit in this site.
---

**The short answer:** nobody follows a button because it's interesting. People follow things they don't understand yet. Alice chased a rabbit because it had a pocket watch, and rabbits don't have pocket watches. Neo followed one because a message on his screen told him to, and he had no idea why. Aristotle said that wondering about something is where all thinking starts. On a website, that means one strange, unexplained detail can pull a visitor further than any "Learn more." But curiosity is a loan. If you open a question, you have to pay it back.

## A rabbit with a watch

In *Alice's Adventures in Wonderland*, Alice is bored on a riverbank. Her sister's book has no pictures. Then a White Rabbit runs past saying he's going to be late.

That alone doesn't surprise her. Carroll is clear about that: a talking rabbit seemed almost normal at the time. What gets her is when it takes a watch out of its waistcoat pocket and checks it. That's the detail. She's up and running across the field before she's thought about it, and down the hole before she wonders how she'll get out.

I love that it isn't the big impossible thing that does it. It's the small specific one. A talking rabbit is a fairy tale. A rabbit that's *worried about the time* is a question.

## Wake up, Neo

*The Matrix* is one of my all-time favorite movies. The first one, I mean. It's an action movie that's secretly a philosophy class, and it borrows Alice on purpose. Neo is asleep at his desk when his computer starts typing to him on its own. It tells him to follow the white rabbit. A few minutes later there's a knock at the door, and one of the people outside has a white rabbit tattooed on her shoulder. He goes with them.

Later Morpheus tells him he must feel a bit like Alice, falling down the rabbit hole, and then offers him the two pills. Everyone remembers the pills. I think the rabbit is the smarter part. Before anyone explained anything, before the choice, something odd showed up and Neo chose to follow it. The movie gets you in the same way: it doesn't explain itself for a long time, and that's exactly why you keep watching.

## Wonder comes first

Aristotle opens his *Metaphysics* with a line I think about a lot: all people, by nature, want to know. His proof is almost funny in how simple it is. We enjoy our senses even when they're no use to us. We like looking at things just to look at them.

A bit further on, he says that philosophy begins in wonder. People first wondered about the small puzzles right in front of them, then slowly worked up to the big ones: the moon, the sun, the stars, how everything began. (Plato says nearly the same thing in the *Theaetetus*: wonder is where philosophy starts.)

Two ideas in there are useful for anyone who designs things:

- **Wonder starts small.** Nobody starts with the origin of the universe. They start with something near them that doesn't quite make sense.
- **It builds.** Every small answer makes room for a bigger question. Curiosity doesn't stop when it's satisfied. It goes looking for the next thing.

That second part is the rabbit hole. Not one question, but a trail of them, each one a little deeper.

## Why a rabbit beats a button

Most of a website tells people what to do. Click here. Get started. Book a call. That's fine. Those things need to be clear, and they should be.

But an instruction can only push. It says "go here," and you either do or you don't. A strange detail pulls. It doesn't say anything at all. It just sits there not making sense, and your brain can't leave it alone.

I wrote about the science side of this in [The first easter egg](/observatory/warren-robinett-easter-eggs-hidden-details): curiosity is the itch of a gap between what you know and what you want to know. This one is about the design side. What makes a good rabbit?

- **It's specific.** Not "something cool is hidden here." A rabbit, with a watch, that's late. Vague mysteries don't pull. Precise ones do.
- **It's unexplained.** The second you add a tooltip that says "click for a surprise," it stops being a rabbit and becomes a button with a costume on.
- **It's slightly out of place.** A rabbit in a meadow is scenery. A rabbit in your terminal window is a question.
- **It leads somewhere.** This is the one people skip.

## Curiosity is a loan

Every time you make someone curious, they lend you a little attention. They're trusting that it's worth it.

If the rabbit leads nowhere, if the strange detail is just decoration or the hidden link is broken, you don't just lose that click. You teach them that the odd things on your site don't mean anything. Next time they won't follow.

So the rule I build by: **open a question, pay it back.** Every hint on this site has an answer. The odd planet really is a wormhole. The hungry footer really eats things. If I can't make the payoff good, I don't plant the question.

## The rabbit on this site

There's a card on the homepage about custom deploys. It shows a little code editor typing out an HTML file, then the CSS, then the JavaScript, then a terminal running a deploy: `git push`, build, checks, live. Then it loops. Most people glance at it and keep scrolling. That's fine. That's what it's for.

But if you watch the whole thing, all the way to the end of the deploy, the card stops for a second. Then a small pixel white rabbit hops in along the bottom of the terminal and sits down. The output scrolls up a line, like a real terminal, and a new line types out in that Matrix green: *Follow the white rabbit…*

No button. No explanation. If you don't click, the rabbit waits a few seconds, hops away, and the deploy starts over like nothing happened.

If you do click it, the screen goes black and the digital rain takes over, falling green characters, then two pills. Each one does what Morpheus promised. The blue pill ends the story: your eyes blink open, a little blurry at first, and you're back on the page. The red pill shows you how deep the rabbit hole goes. On this site, that's literal: it decodes the full list of side quests hidden across the site, the ones you've found by name and the rest as hints. Twenty of them, counting this one.

A few build notes for the curious:

- **The rabbit is drawn as pixels in code.** Each frame is a little grid of characters, one per pixel, turned into an SVG. Two frames, sitting and mid-hop, swapped while it jumps. It's the same trick I used for the hidden boss fight (the full build is in [How I hid a boss fight in a website](/observatory/hidden-boss-fight-webflow-build)).
- **The rain is real random code, not a video.** Half-width Japanese characters and numbers drawn on a canvas, mirrored, with a bright head on each falling column and a trail that fades behind it.
- **The waking up took two tries.** My first version used two black eyelids that closed from the top and bottom. Looking at it again, I noticed light leaking through at the corners where the curves met, which ruins the whole "eyes shut" feeling. Now it's one black layer with an eye-shaped hole that grows, and two layers of blur underneath, so the first blink is very blurry, the second a little less, and the last one opens into focus.
- **It respects the off switch.** With Engines off (the motion switch in the nav), the rabbit is already sitting there, the rain is a still frame, and nothing types. You can still follow it.

The part I like most is the condition. The rabbit only shows up for people who watched something most people skip. That's the whole idea of the thing: it doesn't find you. You have to be paying attention.

## In practice

- **Plant one specific oddity.** Not "something's hidden." A rabbit with a pocket watch. Precise details pull, vague ones don't.
- **Don't explain it.** The moment you label the mystery, it's a button.
- **Put it at the end of something.** The bottom of a scroll, the last frame of a loop, the back of a card. Reward people who stayed.
- **Always pay it back.** Every question you open needs an answer worth the click.
- **Let it lead somewhere deeper.** The best rabbits point to more rabbits. Wonder builds.
- **Keep the main path plain.** Mysteries live in the margins. Navigation, contact and the work never hide.

Alice didn't follow the rabbit because someone told her to. She followed it because it was late, and rabbits aren't supposed to be late. Give people something that isn't supposed to be there, and make sure it's worth finding.

---

**Review notes**
- *Alice's Adventures in Wonderland* (Lewis Carroll, 1865, public domain): Alice bored on the bank, the sister's book with no pictures, the White Rabbit saying it will be late; the text says she didn't think it very remarkable to hear the rabbit talk, but started up when it took a watch out of its waistcoat pocket. Paraphrased, no direct quotes.
- *The Matrix* (1999): Neo's computer types "Follow the white rabbit", a knock at the door, a white rabbit tattoo on one of the visitors' shoulders, Morpheus comparing Neo to Alice before the red/blue pill choice. Paraphrased; the only quoted words are the site's own line "Follow the white rabbit…", which is also the film's on-screen text (3 words, fine).
- Aristotle, *Metaphysics* I.1 (980a): all people by nature desire to know; delight in the senses apart from usefulness, especially sight. I.2 (982b): philosophy begins in wonder, from small puzzles to the moon, sun, stars and the origin of everything. Plato, *Theaetetus* 155d: wonder is the beginning of philosophy. Paraphrased from standard translations.
- Site facts from `home/20-services.js` (terminal card: index.html → site.css → app.js → terminal deploy; 1.4 s pause, rabbit on an 18 × 12 pixel grid with two frames, output scrolls a line, green line typed, hops off after 9 s; mirrored half-width katakana canvas rain; blue = blinking eye opening with two blur layers; red = every side quest decoded, found ones by name, the rest as hints; Engines off = rabbit sitting, still rain, no typing) and `core/24-quests.js` (20 quests). Eyelid light-leak fix shipped in v0.33.36 (2026-10-02).
- Eyelid leak: Angelino spotted it on staging (2026-10-02); written as "I noticed".
- Links: note 21 (/observatory/warren-robinett-easter-eggs-hidden-details), note 22 (/observatory/hidden-boss-fight-webflow-build). No em dashes, US spelling.
- Personal: the first *Matrix* is one of Angelino's all-time favorite movies because it's so philosophical (his words, 2026-10-02); the sequels deliberately not mentioned.
- Approved by Angelino 2026-10-02 ("publish them all").
