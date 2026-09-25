# Build progress

- [x] 1. Webflow site "AB Portfolio" found and site ID confirmed — `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io), 2026-09-25
- [~] 2. Variables: Color (Dark/Light modes), Typography, Size, Spacing — 37 created (IDs in `docs/webflow-ids.md`). ⚠️ 9 fluid sizes hold their desktop fallback: the MCP rejects every `custom_value` (clamp/calc) with an internal error, bridge connected or not → Angelino pastes the clamp() values in the Variables panel. Color base mode renamed to "Dark" in the Designer (verified).
- [x] 2b. Fonts loaded as custom variable fonts (Archivo wght+wdth, Geist, JetBrains Mono, Caveat), not the Google Fonts setting, so Archivo keeps its width axis
- [ ] 3. Global styles + Client-First utilities
- [ ] 4. CMS collections created (13)
- [ ] 4b. Seed content imported, references resolved
- [ ] 5. Components: nav, footer, frame label, planet, buttons, bento card, mission card, next card, FAQ, code block, crew dock
- [ ] 6a. Home
- [ ] 6b. Work (Mission archive)
- [ ] 6c. Mission template
- [ ] 6d. Services template
- [ ] 6e. About
- [ ] 6f. 404
- [ ] 7. Custom code modules built, tagged and loaded
- [ ] 8. QA at 1440 / 1024 / 390, reduced motion, Lighthouse
- [ ] 9. Angelino approves → publish
