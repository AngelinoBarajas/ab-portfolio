---
status: approved
title: STAY: Interstellar, love and designing a message for someone you'll never meet
slug: interstellar-love-design-message-across-time
theme: Why before how
topics: [Philosophy at work, Handoff, Science of time]
services: [webflow-development, cms-integrations]
missions: [ab-identity]
meta_description: In Interstellar, a father reaches his daughter across time through a watch she already knows. Every website is a message like that. How to design for people you'll never meet.
---

**The short answer:** near the end of *Interstellar*, Cooper is stuck in a tesseract behind his daughter's bookshelf. He can't talk to Murph. All he can do is push on small things across time: a few books, then the second hand of the watch he gave her. It works because she knows that watch, and she knows him. A website is the same kind of message. You send it forward to people you'll never meet, and it only lands if it speaks a language they already know and was made with real care for a real person.

## A message through the bookshelf

Earlier in the film, Brand makes a speech that sounds out of place on a science mission. She says love might be the one thing we can sense that reaches across time and space, and maybe we should trust it even when we can't explain it. Cooper pushes back, and on the day, the data wins the argument.

Then the ending proves her half right. From inside the tesseract, Cooper can see every moment of Murph's bedroom at once. He knocks books off her shelf to spell STAY in Morse. Later, he taps the data that will save everyone into the second hand of her watch. Years later, grown-up Murph goes back to that room, sees the hand twitching and knows it's him.

The science in the film is Kip Thorne's. The part that makes the message work isn't physics. Cooper chose the one object Murph would never throw away, and a code she'd understand.

## Every website is sent forward in time

I've written about the film's time dilation before, in [One hour there, seven years here](/observatory/interstellar-time-dilation-perceived-performance). This scene is the one I think about when I build. Nobody reads a website while you're making it. They read it later, in a room you'll never see:

- A visitor next spring, on a phone, in bad light, in a hurry.
- A client's new hire who inherits the CMS a year from now and has to add a project without breaking anything.
- Someone using a screen reader, or someone who gets dizzy from motion.
- You, six months from now, opening the code and trying to remember why it works.

You can't be there to explain. The site has to carry the message on its own. Like the watch, it works when it's built from things the reader already knows (a nav where they expect it, words they'd use, a button that looks like a button), and when it was clearly made for someone in particular.

## Love, as a design spec

"Love" sounds like a strange word for web work, so here's what I mean in practice. It's the difference between designing for "users" and designing for one person you can picture. When I picture a real person, the decisions change:

- The site doesn't just meet a contrast ratio. It's readable for someone with tired eyes on a cracked phone screen.
- The motion has an off switch (the Engines button in the nav; more in [Reduced motion without losing the magic](/observatory/reduced-motion-without-losing-the-magic)), because someone I care about would want one.
- The CMS has field names and help text a real person can follow, because someone will be alone with it at 11 p.m. before a launch.
- The code is versioned and documented, because future me deserves better than a mystery.

None of that shows up in a screenshot. All of it shows up for the person on the other end.

## The watch on my shelf

There's a small version of this on my About page. The bookshelf card turns into a tesseract when you hover, and inside it is Murph's watch, keeping real time. Every eleven seconds the second hand twitches STAY in Morse. Most visitors will never notice. That's fine. It's a message for the people who look.

The page has a few of those, details that mean something to me and don't need to mean anything to anyone else for the site to work. Knowing they're there changes how I build the rest.

## "They" were us

The twist in *Interstellar* is that the mysterious "they" who opened the wormhole and built the tesseract weren't aliens. They were people from the future, reaching back to help.

Every good build has a moment like that. You open an old project in a panic and find a note you left yourself, a comment that explains the weird fix, a backup from the day before it broke. Past you reached forward and saved you. I try to leave those notes on purpose now: a handoff doc at the end of every session, a changelog, a backup before every change. It's the least romantic love letter there is, and it works every time.

## In practice

- **Picture one real person.** Not a persona, a person. Design the page they'll read.
- **Speak a language they already know.** Familiar patterns carry the message; clever ones can bury it.
- **Write for whoever inherits it.** Clear CMS labels, help text, a short guide. They'll be alone with it.
- **Leave notes for future you.** Comments, changelogs, backups. "They" is you.
- **Hide something for the people who look.** A small, personal detail rewards the visitors who pay attention and reminds you who you're building for.

Cooper couldn't be in the room with Murph. He could only make sure what he left behind was something she'd recognize. That's most of the job.

---

**Review notes**
- *Interstellar* (2014, Christopher Nolan; Kip Thorne scientific adviser and executive producer): Brand's love speech paraphrased, no quotes; STAY spelled with fallen books in Morse; the quantum data encoded into the watch's second hand in Morse; grown Murph returns to her room and recognizes it; "they" are future humans. Double-check the order of events on a rewatch if needed.
- Site facts: About bookshelf tesseract + Murph's watch (`about/00-about.js` › bookshelf: real time, STAY in Morse every ~11 s, side quest #19 "Read Murph's watch"), Engines on/off switch in the nav, hero moons in family colors. Handoff doc, changelog and backups are real parts of this build's process.
- The About hero moons are in family colors (wife green, son purple); the note only hints at "details that mean something to me" and doesn't name them, since family lines were kept off the site's boss-fight credits. Name them only if Angelino wants to.
- Links: note 09 (time dilation) and note 07 (reduced motion) in the body.
- Topics for insight_topics "20" on import: philosophy-at-work, handoff, science-of-time.
