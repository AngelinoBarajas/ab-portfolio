---
status: draft
title: 1984 on the web: Newspeak, the memory hole and the interface that lies politely
slug: orwell-1984-dark-patterns-plain-language
theme: Why before how
topics: [Philosophy at work, Micro-interaction, Search + AI answers]
services: [webflow-development, branding]
missions: [ab-identity]
meta_description: Orwell's 1984 is about power, but it's also about words that hide what they mean. Newspeak button labels, memory-hole price changes and "increases" that are cuts, and how plain language keeps an interface honest.
---

**The short answer:** *1984* is a novel about a government that controls people by controlling language and memory. Its tools have small, everyday cousins on the web: button labels that hide what they do ("Pause" when you wanted "Cancel"), terms and prices that change without a trace, and announcements that call a cut an improvement. Orwell's answer, in an essay he wrote a few years before the novel, was plain language: say the thing, in the shortest honest words. It's still the best defense an interface has.

## The book that falls off my shelf

You can knock books off the shelf on my About page. When *1984* falls, it says: "Why plain, honest language matters." That's not how most people sum up the book. Most people remember Big Brother and the cameras. But read it again as a designer and what jumps out is how much of the control is done with *words*.

Winston Smith, the main character, works at the Ministry of Truth. His job is to rewrite old newspaper articles so the past always agrees with the present. The originals go down a slot in the wall called the memory hole and are burned. The government's new language, Newspeak, is designed to get smaller every year, so that eventually there won't be words left to think certain thoughts.

## Three tools from Oceania, and their cousins online

I want to be careful here. A confusing checkout page isn't a totalitarian state. But the *techniques* rhyme, and naming them helps you spot them.

### Newspeak: labels that make the real option unsayable

Newspeak works by removing words. If there's no word for an idea, it's hard to ask for it.

Interfaces do a quiet version of this. The account page has "Manage membership" and "Pause," but not "Cancel." The privacy screen has "Personalize my experience," not "Track me across sites." The delete button says "Deactivate." Nothing on the screen is false. The option you came for just doesn't have a name.

### The memory hole: when the past quietly changes

At the Ministry of Truth, last month's record always matches this month's story, because last month's record was rewritten.

Online, the memory hole is the silent edit. Terms of service that change with no changelog. A "was $99" price that was never actually $99. A plan that loses a feature you're paying for, with no notice, so when you go looking for it, it seems like it was never there. Each one makes you doubt your own memory, which is exactly what made the Ministry so effective.

### The Ministry of Plenty: an "increase" that's a cut

My favorite scene for this is a small one. The news announces, with great celebration, that the chocolate ration has been *raised* to twenty grams a week. Winston remembers that it was thirty grams the day before. Everyone around him seems happy about the increase.

You've seen this email. "We're excited to announce changes to your plan." The changes are a higher price. "We've streamlined our features." A feature is gone. Good news in the subject line, bad news in the fine print.

## Orwell's fix: plain words

A few years before *1984*, Orwell wrote an essay called "Politics and the English Language." His argument was that vague, inflated language isn't just bad style. It's a way to avoid saying what's actually happening. His rules for writing are short, and most of them fit on a button:

- **Use the short word** when there is one.
- **Cut words you don't need.**
- **Prefer the active voice:** "We raised the price," not "Prices have been adjusted."
- **Don't use jargon** when an everyday word will do.

And then, the rule I like most: break any of these rules before you say anything outright barbarous. They're a tool for honesty, not a style law.

## How I try to apply it here

This site isn't a store, so the stakes are small. But it's a good place to practice:

- **Buttons say what they do.** "Copy" copies the email. "Esc · Wake up" leaves the Matrix scene. The motion switch says "Engines off," and if your device already asked for reduced motion, it says "Engines off (device)," so you know why.
- **What the site remembers about you stays with you.** The side quests you find and your Engines choice are saved in your own browser, not sent anywhere. Clear your browser data and they're gone. [Check before publishing: still true after launch analytics, if any are added.]
- **Field notes say what they are.** Each one opens with a short answer, so you don't have to read 1,500 words to find out whether it's useful to you.
- **When a choice matters, both options are spelled out first.** I wrote a whole note on that: [Red pill, blue pill](/observatory/red-pill-blue-pill-honest-interface-choices). It covers the classic tricks (pre-ticked boxes, guilt-trip "no thanks" links, sign-up in one click and cancel by phone). This note is about the quieter ones: the words.

## In practice

- **Name the option people came for.** If a user can cancel, the button says Cancel.
- **Keep a changelog for anything people pay for or agree to.** Terms, prices, plans. A visible history is the opposite of a memory hole.
- **Write bad news as bad news.** "We're raising the price from $10 to $12 on June 1" is clearer, and more respectful, than any amount of "exciting changes."
- **Read your interface copy with Orwell's rules.** Short words, active voice, no jargon. If a label needs a tooltip to explain it, the label is the problem.
- **Ask what each word hides.** "Streamlined," "adjusted," "personalized," "deactivated." If the honest version would make the user unhappy, the user deserves the honest version most.

Big Brother needed telescreens on every wall. Most bad interfaces only need one vague button. Fixing that is a lot easier than fixing Oceania.

---

**Review notes**
- *Nineteen Eighty-Four*, George Orwell, published June 1949: Winston Smith at the Ministry of Truth rewriting records; the memory hole; Newspeak shrinking each year to narrow thought; the chocolate ration "raised" to 20 grams when Winston remembers it was 30. All paraphrased; no quotes from the novel.
- "Politics and the English Language," Orwell, 1946: the six rules paraphrased (short word, cut words, active voice, no jargon/foreign phrase, and the sixth, break the rules rather than say anything outright barbarous: "outright barbarous" is 2 words of Orwell's phrasing).
- Site facts: bookshelf line "George Orwell · Why plain, honest language matters." (`about/00-about.js:851`); quests in `localStorage ab:quests` (`core/24-quests.js`), Engines in `localStorage ab:calm` (`core/20-ui.js`); "Engines off (device)" and "Esc · Wake up" as in note 25; email Copy button. Staging (2026-10-03) loads no analytics or ad scripts: **re-check at launch** before keeping the "stays with you" line.
- Example UI copy ("Manage membership", "Deactivate", "exciting changes") is invented to illustrate the genre, not quoted from a real company.
- Link: note 25. No em dashes, US spelling.
