---
status: approved
title: The first easter egg: Warren Robinett's secret room and why hidden things make people love a site
slug: warren-robinett-easter-eggs-hidden-details
theme: Why before how
topics: [Micro-interactions, Brand identity, Philosophy at work]
services: [branding, motion]
missions: [ab-identity]
meta_description: In 1979 an Atari designer hid his name in a secret room because nobody would credit him. The story of the first famous easter egg, and why hidden details still make people love a website.
---

**The short answer:** the first famous video game easter egg exists because a designer wasn't allowed to sign his work. In the late 1970s, Atari didn't credit its game designers, so Warren Robinett hid his name in a secret room in *Adventure*. When players found it, Atari decided to leave it in, and the name "easter egg" stuck. Hidden things still work for the same reason: they reward people who look closer, and they prove a real person made the thing. This site has 19 of them.

## A name in a secret room

*Adventure* came out on the Atari 2600 in 1980. You're a square, you carry a sword, you get chased by ducks that are supposed to be dragons. It was simple and it was huge.

Robinett made it more or less by himself. But Atari's policy at the time was that game boxes didn't list the people who made the games. So he did something about it. Deep in one of the castles, he hid a single gray pixel that almost nobody would ever notice. Carry that dot to the right wall, and you can walk through into a room that says "Created by Warren Robinett."

He didn't tell anyone. By the time a teenage player found the room and wrote to Atari about it, Robinett had already left the company. Fixing the game meant making new chips, which was expensive, so Atari left it in. The story goes that one of their managers compared it to finding eggs on an Easter morning hunt, and that's where the name comes from.

Robinett wasn't the only one frustrated. Around the same time, a group of Atari's best programmers left to start their own company, Activision, and one of the first things they did was put the designers' names on the box.

## Two things a hidden detail says

I think Robinett's room still works for two reasons.

**It rewards attention.** Most of a website is built for people skimming. A hidden detail is built for the ones who slow down: the visitor who hovers a little too long, drags the thing that doesn't look draggable, scrolls all the way to the bottom. Finding something there tells them the site noticed them back.

**It proves a person made it.** Templates don't have secrets. A secret room says someone sat with this thing long enough to care about a corner nobody was going to see. That's exactly what Robinett was saying. His name in the room wasn't really about ego. It was about being a person instead of a product.

## Why curiosity pulls so hard

Psychologists have a useful way to think about this. George Loewenstein's "information gap" theory says curiosity is the itch we feel when we notice a gap between what we know and what we want to know. A hint is the perfect trigger: it's specific enough to open the gap and not enough to close it.

Game designers have always known this. The Konami code (up, up, down, down, left, right, left, right, B, A) started as a testing shortcut in *Gradius* in the 1980s, got left in, and spread across dozens of games. Kids passed it around on playgrounds. Nobody needed a tutorial. The rumor that something was there was the whole marketing plan.

## My secret rooms

This site grew its own set. There's a side-quest log with 19 quests, each with a hint and nothing more:

- *"One of the planets on the homepage isn't a planet. Someone put it there."* (It's a wormhole that drops you on a random page.)
- *"Scroll all the way down. It's hungry."* (The black hole in the footer eats planets, and if you feed it enough, it goes supernova.)
- *"Something on the bookshelf keeps time. And sends messages."* (Murph's watch, spelling STAY in Morse.)
- *"Some codes never die. Up, up…"* (Yes, the Konami code works here. On a phone you swipe it.)

The biggest one is Robinett's room, almost exactly. Level up the Player one card on the About page to 20, or enter the cheat code, and a full boss fight opens. When you win, the credits roll, and the very end of them is the only place in the whole fight where my name appears: two halves of it streaking in from opposite sides of the screen and meeting in the middle. I didn't plan the parallel at first. Once I noticed it, I couldn't unsee it. (How the fight is built is in [How I hid a boss fight in a website](/observatory/hidden-boss-fight-webflow-build).)

## The rules I follow

Easter eggs can go wrong. A secret that blocks the main path, or a joke that makes the site harder to use, isn't a gift. So a few rules:

- **Never hide the important stuff.** Navigation, contact, the work: all in plain sight. Secrets live in the margins.
- **Every secret is optional.** You can use the whole site without finding a single quest.
- **Hint, don't hide.** Each quest has a clue. The fun is in the search, not in giving up.
- **Respect the off switch.** With Engines off (the motion switch in the nav), the boss fight skips straight to the result and the credits, and the quest still counts.
- **Make it about the visitor.** The fight's credits start with "Starring: You, Player One." The name comes last.

## In practice

- **Hide one thing.** Even one detail that rewards a closer look changes how a site feels.
- **Put it where curious people already go.** The footer, a hover, a drag, the end of a scroll.
- **Leave a trail.** A hint opens the curiosity gap. A log lets people count what they've found.
- **Sign your work somewhere.** Not everywhere. Just somewhere a person who cares can find it.

Robinett had to sneak his name into a room behind a gray pixel. We get to put ours anywhere we want. The secret room is still a better place for it.

---

**Review notes**
- Robinett / *Adventure* (Atari 2600, 1980; developed 1979): Atari's no-credit policy, the hidden gray dot opening a room that reads "Created by Warren Robinett", found by a teenage player who wrote to Atari after Robinett had left, Atari keeping it rather than remaking the ROM, a manager's Easter-hunt comparison naming it; Activision founded 1979 by departing Atari programmers and crediting designers. Paraphrased from widely documented history, no quotes beyond the room's text.
- Loewenstein's information-gap theory (1994) paraphrased. Konami code: *Gradius* (1985 NES port) testing shortcut left in, commonly told.
- Site facts from `core/24-quests.js` (19 quests, hints quoted from the site's own copy), `about/00-about.js` (Player one LV 20, Konami +30 levels, swipe on phones), `about/10-boss.js` (credits "Starring · You, Player One"; ROLES + name finale the only place the name appears; reduced motion/Engines off = still result + credits, quest logged).
- Published straight to live at Angelino's ask (2026-09-30).
