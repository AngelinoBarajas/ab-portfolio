# Contact page (`/contact`) — plan

Decided with Angelino 2026-09-26 (page-pipeline stage 2).

## Direction

- **Purpose: the general door.** A short form for anything that isn't a scoped project (questions, help with an existing site, collaborations, hiring, hello), plus the **Book a call** path. Project scoping stays on the Home planner (`/#launch`) and the Process form (`/process#launch`); /contact points to them for projects.
- **Concept: "Open a channel"** (ground-station comms).
- **Form collects:** a reason (frequency station) + Name + Email + Message. Nothing else.
- **Links: split by intent.** → `/contact`: Nav "Contact", mobile menu "Contact", Footer Navigate › Contact. → `/contact#call`: Nav "Book a call", hub final call "Book a call". **Stay on `/#launch`**: every "Plan a mission" / "Start a project" / "Plot the course" CTA, 404 route 4. `/process#launch` CTAs stay.

## Divergence gate

| Declaration | This page |
|---|---|
| Sequence deviation | No hero → form → FAQ stack. The hero *is* the form (tuner + fields). No FAQ, no testimonial. |
| Structural break | Form off-center left over a full-bleed radio dish that bleeds off the right edge and aims at the cursor; an oscilloscope line runs the full width and the transmission sweeps horizontally across it. |
| Type moment | Headline uses the shared hero style (`dbh-title`, "Come *in*" with the outline word) at Angelino's ask 2026-09-26, for consistency with the other pages. The one-off moment is the tuner readout (big display-font MHz numerals). HAIL was tried first and dropped as ambiguous. |
| Rhythm variation | Tall dark hero-console → short light "other channels" strip → footer. |

## Stations (the reason field)

| Freq | Reason (`Reason` field value) | Message label |
|---|---|---|
| 101.4 | New project | What are you launching? (+ planner hint) |
| 103.8 | Book a call | When works for a call? (`#call` preselects) |
| 106.2 | Help with an existing site | What needs a hand? |
| 109.5 | Collaboration | What did you have in mind? |
| 112.7 | Hiring | Tell me about the role |
| 118.0 | Just saying hi | Your message |

## Webflow build notes (for stage 4)

- Static page `/contact`, duplicate an existing static page (About or Process) so Nav, Footer and the site-data block come along.
- Native Webflow Form + Embed fields (pattern: `webflow/build/process/form-fields.embed.html`): station buttons rendered by script, hidden `Reason`, Name, Email, Message. Same notification email as the other two forms (still unconfirmed in Site settings › Forms).
- Copy lives in real Webflow elements; the dish, scope and tuner are code (`ab-contact` bundle).

## Prototype

`prototypes/contact.html`, assembled by `python prototypes/_parts/assemble.py contact` from `_parts/contact.*`. Test hooks: `?shim`, `?at=<frame>`, `#call`.
