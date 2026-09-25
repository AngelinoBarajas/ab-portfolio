# Build progress

- [x] 1. Webflow site "AB Portfolio" found and site ID confirmed — `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io), 2026-09-25
- [x] 2. Variables: Color (Dark/Light modes), Typography, Size, Spacing — 37 created (IDs in `docs/webflow-ids.md`); 9 clamp() values pasted by Angelino in the Designer (MCP can't write custom values), read back and verified. Color base mode named "Dark".
- [x] 2b. Fonts loaded as custom variable fonts (Archivo wght+wdth, Geist, JetBrains Mono, Caveat), not the Google Fonts setting, so Archivo keeps its width axis
- [x] 3. Global styles + Client-First utilities (29 classes, variable-linked; see `docs/webflow-build-notes.md`). ⚠️ Body / H1–H6 / paragraph tag styles need the Designer (MCP can't reach tag styles)
- [x] 4. CMS collections created (13): 173 fields, slugs match `cms/schema.json`; display names renamed after creation (the API derives slugs from display names). Missions collection slug `work`.
- [x] 4b. Seed content imported (149 items), references resolved (types, stack, services, next-mission, pairs-with, FAQ, mission links). Items are staged (not draft), not published. 8 images copied to the Webflow CDN. UK spellings in seed copy converted to US.
- [~] 5. Components: ✅ Nav, ✅ Footer (+ page-level site-data block). Still to build with their first page:  frame label, planet, buttons, bento card, mission card, next card, FAQ, code block, crew dock
- [ ] 6a. Home
- [ ] 6b. Work (Mission archive)
- [ ] 6c. Mission template
- [ ] 6d. Services template
- [ ] 6e. About
- [ ] 6f. 404
- [ ] 7. Custom code modules built, tagged and loaded
- [ ] 8. QA at 1440 / 1024 / 390, reduced motion, Lighthouse
- [ ] 9. Angelino approves → publish
