---
status: approved
title: Ten thousand hours, give or take: Outliers and what practice looks like when nobody's teaching you
slug: outliers-10000-hours-self-taught-design
theme: Why before how
topics: [Philosophy at work, Asking better questions, Brand identity]
services: [webflow-development, branding]
missions: [ab-identity]
meta_description: Malcolm Gladwell made the 10,000-hour rule famous. The researcher behind it said hours alone aren't the point. What deliberate practice looks like for a self-taught designer, and why I put "10,000+" on my crew badge anyway.
---

**The short answer:** the "10,000-hour rule" from Malcolm Gladwell's *Outliers* says it takes about ten thousand hours of practice to master something. The researcher whose study it came from, Anders Ericsson, spent years correcting it: ten thousand was an average, not a finish line, and the hours only count if they're the right kind. He called that kind *deliberate practice*: working just past what you can already do, with fast feedback, on purpose. For a self-taught designer there's no teacher to build that for you. You have to build it yourself, out of real projects, honest feedback and the habit of checking your own work.

## The book on my shelf

There's a bookshelf on my About page, and you can knock the books off it. One of them is *Outliers*. The line it shows when it falls is "Ten thousand hours, give or take." The "give or take" is doing a lot of work there, and this note is about why.

*Outliers* came out in 2008. Its big idea is that the people we call geniuses usually had something else going for them: lucky timing, unusual access and a huge amount of practice. Gladwell's two favorite examples are the Beatles, who played hundreds of marathon nights in Hamburg clubs before anyone had heard of them, and Bill Gates, who as a teenager had rare access to a school computer terminal and used it for thousands of hours.

From those stories and a study of violinists, Gladwell drew a number. Ten thousand hours. It was simple, it was hopeful, and it stuck.

## What the researcher actually found

The violin study was by Anders Ericsson and two colleagues, published in 1993. They looked at students at a music academy in Berlin and found that the best ones had, on average, practiced alone a lot more by age twenty than the merely good ones. The top group averaged around ten thousand hours.

Ericsson spent the rest of his career pointing out what got lost on the way to the rule:

- **It was an average.** Some of the best had far fewer hours. Some had more.
- **There's nothing magic at ten thousand.** You don't cross a line and become an expert.
- **The kind of practice matters more than the count.** Hours of doing what you already know how to do don't add up the same way.

Later research made the point even sharper. A large review in 2014 found that practice explained a real but modest share of the difference between people, more in games and music, less in professional work. Practice matters. It's just not the whole story, and the count is the least interesting part of it.

## Deliberate practice, without a teacher

Ericsson's description of the useful kind of practice comes down to a few things:

- **A specific goal,** not "get better."
- **Just past your current ability,** where it's uncomfortable.
- **Fast, honest feedback,** so you know right away when you got it wrong.
- **Repetition with adjustment,** not repetition alone.

The violinists had a teacher who designed all of that for them. A self-taught designer doesn't. Nobody assigns you the exercise that's just hard enough, and nobody tells you that your kerning is off. So the job becomes building your own version.

My hours came from taking other people's websites apart. I'd find a site that did something I couldn't do yet, open it up, dissect how it worked, and then try to build it myself. Most of the time my version was worse. That was the useful part: the gap between theirs and mine was the lesson, and closing it was the practice.

The hard lesson came later. I finished a couple of redesigns of my own portfolio and felt, every time, that the new one was somehow worse than the last. Or not new enough. Or just not *me*. That's what a plateau feels like from the inside. I was putting in hours, but I was practicing what I already knew how to do, and the work showed it. (What finally broke the pattern is in [The Alchemist and the treasure under the sycamore](/observatory/alchemist-design-trends-going-home).)

Here's what that looks like for me now, in the work itself.

**Real projects are the exercises.** Every build has one part I don't know how to do yet. On this site it was a draggable 3D planet, then a boss fight, then a Matrix rain. Each one sat just past what I could do when I started it.

**The browser is the teacher.** Code gives instant, honest feedback: it works or it doesn't. Design is harder to grade, so I measure what I can. Layout shift, load time, what a crawler actually sees, whether it holds up on a real phone and not just an emulator. (One afternoon of that is in [How I cut my layout shift from 0.40 to 0.001](/observatory/webflow-layout-shift-cls-fix).)

**Publish, then check.** I treat every release as a guess until I've looked at the live page. That habit is its own note: [Descartes' method of doubt](/observatory/descartes-method-of-doubt-publish-then-check).

**Write down what went wrong.** Every bug I fix on a project gets a short entry: what happened, why, and how to spot it next time. That's my version of a teacher's notes in the margin. I reread them before starting the next build.

## Why "10,000+" on the badge anyway

My About page has a crew badge, like an astronaut's ID. One of its fields used to say "Training: Self-taught." Now it says "Flight hours: 10,000+."

I know what Ericsson would say. The number isn't the point. But I didn't put it there as a claim of mastery. Honestly, it's a wink. I haven't kept a logbook, and I'm not claiming I crossed some line. But pilots log flight hours because hours in the air are the honest record of experience: not a talent score, just the time you've actually spent flying. "Self-taught" says where I learned. "Flight hours, 10,000+" says I've been in the air a long time, and that I've read the book closely enough to put a "+" on it with a straight face.

## In practice

- **Ignore the number, keep the idea.** The point of *Outliers* that holds up is that skill comes from lots of the right kind of practice, plus some luck in access. Neither part is magic.
- **Pick work that's just past you.** Each project should have one part you don't know how to do yet.
- **Find feedback that's fast and honest.** Measurements, real devices, real users, a peer who won't just be nice.
- **Keep a log of mistakes.** Your own notes are the closest thing to a teacher you'll get.
- **Count hours like a pilot, not like a score.** Experience, not a finish line.

Ten thousand hours, give or take. The "give or take" is where all the learning is.

---

**Review notes**
- *Outliers: The Story of Success*, Malcolm Gladwell, 2008: 10,000-hour rule; Beatles in Hamburg (Gladwell: ~1,200 performances 1960–64, kept general here as "hundreds of marathon nights"); Bill Gates and the Lakeside school terminal.
- K. Anders Ericsson, Ralf Krampe, Clemens Tesch-Römer, "The Role of Deliberate Practice in the Acquisition of Expert Performance," *Psychological Review*, 1993 (Berlin music academy violinists; best group ≈10,000 hours of solitary practice by age 20 on average). Ericsson's corrections: e.g. *Peak* (with Robert Pool, 2016). 2014 meta-analysis: Macnamara, Hambrick & Oswald, *Psychological Science* (deliberate practice explained ~26% of variance in games, 21% music, 18% sports, 4% education, <1% professions); kept as "more in games and music, less in professional work."
- Site facts: bookshelf line "Malcolm Gladwell · Ten thousand hours, give or take." (`about/00-about.js:852`); crew badge Training/Self-taught → Flight hours/10,000+ (Designer M2 done 2026-10-03). Bug log habit = `docs/webflow-build-notes.md` + lessons; describe without naming tools.
- Personal (Angelino, 2026-10-03): learned by dissecting other websites and rebuilding what he saw; a couple of finished portfolio redesigns felt worse, not new enough or not him; 10,000+ is a wink. Links: note 28 (publish together or after), notes 14, 19. No em dashes, US spelling.
