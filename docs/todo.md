# To-do

Ideas Angelino has OK'd but not scheduled. Add the date and source chat. When you start an item, put your chat name next to it so parallel chats don't collide. When it ships, move it to `docs/handoff.md` with the tag.

## Home page hierarchy pass (added 2026-10-06, Portfolio feedback responses chat — IN PROGRESS there)

Why: two designers said the home page has "a message everywhere." Keep the style, the motion and the concept, and cut how many things talk at once. The audience is clients, not minimalist designers. Revised after looking at the live page at 1440 + 390 (the first list came from the page text and overstated some items).

1. [ ] **Hero meta line.** Drop "· 1440 × 900" (`#vpSize` in `.ab_hero_meta`, filled by `core/10-space.js`) so "↗ Go ahead, throw it." stands alone. Designer: delete the dot text + the `#vpSize` span. The JS already null-checks `vpEl`.
2. [ ] **Work board copy.** On the board, Topicweave and Knowledge System show ~60 words of tiny text (`data-summary` → `.ab_board_fsub`, `home/10-work.js:179`) while 510 shows one sentence. New one-liners need Angelino's OK, plus a decision: edit the CMS `summary` (check where else it renders) or add a short board field. **The kip card belongs to the KIP mission debrief chat.**
3. [ ] **Floating HUD over content.** At 1440 the fixed X/Y box (`.ab_hud`, bottom-left) sits over section content (it covered the services "SITES YOUR TEAM" heading and the work board), and the Gargantua altimeter label (`.ab_alt-lab`, right) rides over the right edge. Option: show them at full strength in the hero/footer and fade them while they cross content. ab-core CSS/JS, needs a tag.
4. [ ] **Home page length (ask first).** Order: work → stats → services → process → transmission quote → stack orbit → FAQ → featured reads → contact. Consider moving the transmission quote and/or the tools orbit to About. Designer only.

Dropped after the live check: featured-read excerpts (already clamped to 4 lines on Home) and the services grid demos (a structured bento that reads calmly; it's the sell).
