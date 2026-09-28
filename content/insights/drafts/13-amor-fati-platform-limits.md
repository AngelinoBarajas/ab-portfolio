---
status: approved
title: Amor fati: Nietzsche and learning to love Webflow's limits
slug: amor-fati-webflow-limits
theme: Why before how
topics: [Philosophy, Webflow CMS, Knowledge System]
services: [cms-integrations, webflow-development]
missions: [knowledge-system]
meta_description: Nietzsche's amor fati means loving what is necessary, not just tolerating it. Every hard limit I hit building this site on Webflow ended up making the structure better.
---

**The short answer:** Nietzsche called it *amor fati*, "love of fate": wanting nothing to be different, and not merely putting up with what is necessary but loving it. Every platform has necessities you can't argue with. On this site, Webflow's hard limits (a 60-field cap, nested lists that stop at five items, components that can't hold CMS lists) each forced a structure that turned out cleaner than what I'd planned. The limits weren't in the way of the design. They were part of it.

## What Nietzsche meant

The phrase appears in *The Gay Science*, where Nietzsche writes that he wants to learn to see what is necessary in things as beautiful, and that *amor fati* should be his love from then on. Years later, in *Ecce Homo*, he calls it his formula for greatness: wanting nothing to be other than it is, not forward, not backward, not in all eternity. Bearing the necessary isn't enough, he says, and hiding it is worse. The point is to love it.

It's a demanding idea. Nietzsche wrote it while living with constant illness, and he didn't mean it as a cheerful slogan. He meant: stop spending your strength wishing the world were different, and put it into what you can make of the world as it is.

(If you've read my note on [the camel, the lion and the child](/observatory/nietzsche-three-metamorphoses-scope-creep), this is the child's attitude again: saying yes to what's there, and building.)

## Every platform has a fate

Designers and developers are very good at resenting their tools. The CMS is too limited, the builder won't let you do X, the framework made a weird choice. Some of that resentment is fair. But a platform's limits are its necessities: you can fight them with workarounds, or you can let them shape the design.

Here's how that went on this site.

## Limit one: 60 fields

Webflow collections have a cap on how many fields they can hold. My Services collection hit it: every service has a planet, colors, stages, a code sample, FAQs and more, and there was no room left for two new things I wanted, a launch code and a short note on why two services pair well together.

My first reaction was to cram. Combine fields, encode several values in one text box, squeeze. Instead, I made a small side collection that points at each service and holds just those extra fields. It's cleaner than what I'd have built without the limit: the extra data has its own home, its own editing screen, and it doesn't bloat the main collection that the client (in this case, me) edits most often.

## Limit two: five items in a nested list

When a CMS list sits inside another CMS list, Webflow shows at most five items in the inner one. When I tagged projects with the topics they prove, one project had twelve topics. The topic page for that project would only ever see five.

The workaround that respects the limit: tag from both sides. Each topic also stores which projects prove it, so a topic page never needs the long nested list at all. It's a little more editing, and it made the whole Knowledge System more honest, because every relationship is now stated from the side that uses it.

## Limit three: no lists inside components

Webflow components can't contain Collection Lists, and a Collection List can't live inside a link. So the observation cards you see in the Observatory can't have their topic tags built inside the card itself. The tags sit beside the card in the structure, and a few lines of script move them into place for people.

That limit pushed me toward a rule I now use everywhere: CMS data lives at the page level, where it's visible and bindable, and components stay about layout. Pages are easier to debug when you know where the data comes from.

## The difference between a workaround and a fight

Not every limit deserves love. Some are bugs, and those get reported and worked around. The test I use is simple: is this limit protecting something? Field caps protect performance. Nested-list caps protect page weight. Components without CMS protect reusability. When a limit has a reason, fighting it usually means fighting that reason too, and losing slowly.

*Amor fati* doesn't mean you stop wanting better tools. It means you stop spending the project wishing, and start designing with the material you have.

## In practice

- List the platform's hard limits before you design the data model, not after.
- For each one, ask what it protects. Design with that, not against it.
- When a collection gets crowded, give the extra data its own home.
- Store relationships on the side that displays them.
- Keep CMS data at the page level and components about layout.

The site you're reading is shaped by its limits, and I wouldn't want them different. That's the whole idea.

---

**Review notes**
- Build facts from this site: Services hit Webflow's 60-field cap (launch code + pair notes moved to the Hub manifest collection); nested Collection Lists show 5 items max (510 Visuals had 12 topics; Topic › Missions mirror field is the source of truth); Collection Lists can't sit inside Link Blocks or Components (card tags beside the card, moved in by script).
- Nietzsche: *The Gay Science* §276 and *Ecce Homo* ("Why I Am So Clever" §10), paraphrased, no direct quotes beyond the phrase itself.
- The 510 Visuals mission is described generically ("one project had twelve topics").
