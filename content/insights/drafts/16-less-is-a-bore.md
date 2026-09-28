---
status: approved
title: Less is a bore: when websites got boring, and why I built this one loud
slug: less-is-a-bore-maximalist-web-design
theme: Why before how
topics: [Philosophy at work, Motion + scroll, Interactive 3D, Design systems]
services: [motion, webgl-data, design-systems]
missions: [ab-identity]
meta_description: Websites got boring for good reasons that mostly expired. Why this site goes maximalist on purpose, and the discipline that keeps loud from turning into noise.
---

**The short answer:** websites got boring around 2010 to 2013, and not because designers lost their nerve. Phones arrived, Flash died, responsive layouts and frameworks made the web usable everywhere, and flat design became the safe default. Those were good fixes for real problems. But the problems got solved, the tools got powerful, and the habit of playing it safe stayed. I built this site maximalist on purpose: planets, a starfield, warp transitions, a black hole in the footer. What keeps it from being a mess isn't restraint in *what* it does. It's discipline in *how*.

## The web used to be weird

My first website was an AOL Hometown page. If you had one, you remember how it went: pick a background, then keep adding GIFs until the page felt like you. A spinning logo of the team you'd defend to anyone. An animated Dragon Ball Z sprite powering up in the corner. Whatever you loved that week, moving.

None of it was good design, and none of it needed to be. Those pages weren't trying to convert anyone. They were trying to say *this is who I am*, and they did. You could land on a stranger's page and know in two seconds what they loved. And when you finally got your GIF to spin in the right spot, it felt like you'd built something. Because you had.

The bigger sites of that era were strange in their own way. Flash intros with a "skip" button. Portfolios that were entire little worlds, with custom cursors, sound, menus that unfolded like machines. A lot of it was slow, some of it was unusable, and almost none of it worked with a screen reader. But you remembered where you'd been.

Then, in a few short years, it all got quiet. And that feeling, of a page that was unmistakably *someone's*, went with it. It's been bugging me ever since.

## What happened, roughly in order

- **Phones.** The iPhone arrived in 2007, and suddenly a site had to work on a small screen with a thumb. Hover effects, tiny menus and wide layouts broke.
- **Flash lost.** In April 2010 Steve Jobs published *Thoughts on Flash*, explaining why the iPhone would never run it. Adobe officially ended Flash at the end of 2020, but for most of the web it died that day.
- **Responsive design.** A month later, Ethan Marcotte's article *Responsive Web Design* gave everyone a way to build one site for every screen. It was a genuinely great idea, and it rewarded simple, stackable layouts.
- **Frameworks and templates.** Twitter released Bootstrap in 2011. It made decent sites fast and cheap, and it made a lot of them look the same: big hero image, headline, three columns of icons, a testimonial, a footer.
- **Flat design.** Apple's iOS 7 in 2013 dropped the shadows and textures. The web followed, and "clean" became the highest compliment a site could get.
- **Optimization.** Once every button could be A/B tested, the safest, most familiar version usually won the test. Nobody ever lost a test for being predictable.

Each step made sense. Together, they turned the web into a very nice waiting room.

## Less is more, less is a bore

Architecture had this exact argument decades earlier. Mies van der Rohe gave modernism its motto, "less is more": strip away ornament, let structure speak. It produced some of the most beautiful buildings of the century, and then a lot of identical glass boxes.

In 1966 the architect Robert Venturi answered him in *Complexity and Contradiction in Architecture* with three words: "less is a bore." His point wasn't that decoration is good and simplicity is bad. It was that meaning often lives in the messy, layered, contradictory parts, and a style that removes them removes the meaning too.

That's where I think a lot of websites are now. Clean, correct, fast, and completely interchangeable. If you covered the logo, you couldn't tell a law firm from a coffee roaster from a software company. Boring isn't neutral. It's a message, and the message is "we're like everyone else."

## Apollo and Dionysus

Nietzsche's first book, *The Birth of Tragedy* (1872), argued that great art comes from two forces pulling against each other. The Apollonian is order, clarity, form, the calm sculpture. The Dionysian is energy, excess, the dance and the music. Greek tragedy worked, he said, because it held both at once. Too much Apollo and art goes dead. Too much Dionysus and it dissolves into noise.

The Flash era was mostly Dionysus. The template era is mostly Apollo. What I wanted for this site was both.

## Loud, with rules

The maximalist part is easy to see: procedural planets, a drifting starfield, a globe, draggable things with real physics, warp transitions between pages, a footer that pulls everything into a black hole. The part that makes it work is less visible, and it's where most of the effort went:

- **One accent color.** Everything is built from a small set of dark tokens and a single orange. When the motion is loud, the palette stays quiet.
- **A strict system underneath.** Square corners, three type roles (display, body, mono), a shared grid. Every color, size and space comes from a variable, not a one-off value.
- **Every animation has a reason.** Motion explains a sequence, shows a relationship or rewards a click. If the only reason is "it's cool", it's cut. (More on that in [Why before how](/observatory/why-before-how-philosophy-web-design).)
- **Reduced motion is respected everywhere.** Every animation checks the visitor's settings first. The site stays whole when the magic is off.
- **Heavy things load late.** 3D waits until it's needed, so the page is usable before the planets arrive.
- **Tap is not hover.** Everything was checked on a phone, because most of the reasons the web got boring were phone reasons. (The bug that taught me that one is in [Tap is not hover](/observatory/tap-is-not-hover-touch-bugs).)

That's the answer to the fair objection, "didn't the web get simple for good reasons?" It did. Performance, accessibility and phones were the reasons, and they're still the rules. The difference is that the tools now let you honor all of them and still build something with a pulse.

## Why I bet on it

This site is my attempt to get that Hometown feeling back, with twenty-odd years of craft behind it. The spinning logo is now a planet drawn in code. The space background actually drifts. It's the same impulse: make the page feel like the person who made it, and feel proud when the thing finally spins in the right spot.

A portfolio is a promise about what you can build. A quiet template would have promised "I can use a template." This site is the argument: that a website can feel like a place, and still load fast, read well, work on a phone and respect someone who gets motion sick.

Maximalism without taste is noise. Minimalism without a reason is a bore. The work is in the middle, where every loud thing has earned its place.

---

**Review notes**
- History is standard and paraphrased: iPhone 2007, *Thoughts on Flash* (April 2010), Adobe ending Flash (Dec 31, 2020), Marcotte's *Responsive Web Design* (A List Apart, May 2010), Bootstrap (2011), iOS 7 flat redesign (2013). The A/B-testing point is framed as a tendency, not a statistic.
- Quotes: "less is more" (Mies) and "less is a bore" (Venturi, 1966), both short and widely attributed. Nietzsche's Apollonian/Dionysian from *The Birth of Tragedy* (1872), paraphrased.
- Site facts from this build (`CLAUDE.md`, `tokens/tokens.json`): one accent #FF6A3D, square corners, display/body/mono roles, variables for every value, reduced-motion check in every animation, lazy 3D, tap-vs-hover QA.
- Links to note 08 (*Why before how*) by title; add the real link on import.
- AOL Hometown memory is Angelino's own (2026-09-28): GIFs, a spinning sports-team logo, a Dragon Ball Z sprite, pages that felt like the person, the sense of accomplishment. Kept to exactly what he described.
