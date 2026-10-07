# To-do

Ideas Angelino has OK'd but not scheduled. Add the date and source chat. When you start an item, put your chat name next to it so parallel chats don't collide. When it ships, move it to `docs/handoff.md` with the tag.

## Home page hierarchy pass (added 2026-10-06, Portfolio feedback responses chat) — DONE, live in v0.33.63

Why: two designers said the home page has "a message everywhere." Keep the style, the motion and the concept, and cut how many things talk at once. The audience is clients, not minimalist designers. Revised after looking at the live page at 1440 + 390 (the first list came from the page text and overstated some items).

1. [x] **Hero meta line.** Drop "· 1440 × 900" (`#vpSize` in `.ab_hero_meta`, filled by `core/10-space.js`) so "↗ Go ahead, throw it." stands alone. Designer: delete the dot text + the `#vpSize` span. The JS already null-checks `vpEl`.
2. [x] **Work board copy.** On the board, Topicweave and Knowledge System show ~60 words of tiny text (`data-summary` → `.ab_board_fsub`, `home/10-work.js:179`) while 510 shows one sentence. New one-liners need Angelino's OK, plus a decision: edit the CMS `summary` (check where else it renders) or add a short board field. **The kip card belongs to the KIP mission debrief chat.**
3. [x] **Floating HUD over content.** At 1440 the fixed X/Y box (`.ab_hud`, bottom-left) sits over section content (it covered the services "SITES YOUR TEAM" heading and the work board), and the Gargantua altimeter label (`.ab_alt-lab`, right) rides over the right edge. Option: show them at full strength in the hero/footer and fade them while they cross content. ab-core CSS/JS, needs a tag.
4. [x] **Home page length (ask first).** Order: work → stats → services → process → transmission quote → stack orbit → FAQ → featured reads → contact. Consider moving the transmission quote and/or the tools orbit to About. Designer only.

**Status 2026-10-06 (v0.33.63 tagged, pushed, CDN hashes verified, APPLIED 22:38 UTC with Angelino's OK, NOT published):**
- Staged in Webflow (live on the next publish): Home hero lost "· 1440 × 900"; Missions field **Board line** (`board-line`, `a1563ef8f47d158f1405fd7a37b5b5f7`) created and filled for Topicweave + Knowledge System (CMS items need `publish_collection_items` or a site publish); the Home board frame got `data-board-line` bound to it. Backups: `backups/2026-10-06-*`.
- Registered (not applied): ABCore 0.33.63 `sha384-Dk6TDpTlpL2Kc38JLuAF/+/nyWPVQXBR0/LnM7BshqmRo2PqzyVS//hni+OtYNrG`, ABHome 0.33.63 `sha384-Osjay8M4LmNwlYtLtgAxOUDJDCF6CX+O116nAMLYfmuoRmwv7MUwq7w36uQrWm9m`. CSS `ab-core.prod.css@v0.33.63` `sha384-JO2g+wSWQA/CuJyE7ifXjvDx7yKCdJktqjYLXo4Skr59QYC+WVtkEWESWnoDiYUd`.
- Applied 22:38 UTC (verified by API): site script abcore → 0.33.63; Home `set_page_scripts` [abhome 0.33.63, abknowledge 0.33.39]; site head ab-core.css link → v0.33.63 (backup `backups/2026-10-06-v0.33.63-before.txt`).
- Designer step (Angelino): Home › select `section_transmission` → Ctrl+C → About › paste it after `section_about-off` ("Between launches"), before Featured reads. Home › `section_stack` ("Tools in orbit") → Ctrl+C → About › paste after `section_about-log` ("Flight log"). Then delete both from Home. The code in core/45-transmission.js finds them by `#iq` / `#orbit` on any page.
- Order matters: publish only after the scripts are applied, or About gets the sections without their code (ab-core 0.33.59 has no transmission/orbit init outside ab-home).

Dropped after the live check: featured-read excerpts (already clamped to 4 lines on Home) and the services grid demos (a structured bento that reads calmly; it's the sell).
