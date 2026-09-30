---
status: approved
title: How I hid a boss fight in a website (Webflow, GSAP and a little Web Audio)
slug: hidden-boss-fight-webflow-build
theme: Build notes
topics: [Custom code, Motion + scroll, Reduced motion, Scope creep]
services: [motion, webflow-development]
missions: [ab-identity]
meta_description: A playable pixel-art boss fight hidden on a Webflow About page: how it's triggered, drawn, looped, voiced and tested, and how it stays accessible and skippable.
---

**The short answer:** the boss fight on my About page is one script. It builds a full-screen dialog, draws pixel sprites from text as SVG, runs a small real-time game on GSAP's ticker over a canvas starfield, and synthesizes its own soundtrack with Web Audio. Webflow only holds the card that opens it. The parts that took the most care weren't the game. They were the exits: Skip, Esc, retry, sound off by default, and a still version for anyone with motion turned off.

## How you find it

On the About page there's a card called Player one: a little game screen with a level and an XP bar. Click it and you earn XP. It starts at level 7, and when it hits 20, a toast says something huge is on the radar and the fight opens. Or you can skip the grind with the Konami code, which adds 30 levels (on a phone, you swipe the arrows on the card and tap twice for B and A).

The boss is called The Scope Creep, a nod to the most dangerous monster in web projects (I wrote about it in [The camel, the lion and the child](/observatory/nietzsche-three-metamorphoses-scope-creep)). The fight itself is the reward for a side quest, so it's completely optional. Why I hide things like this is in [The first easter egg](/observatory/warren-robinett-easter-eggs-hidden-details).

## Webflow's part, and the script's part

Webflow owns the Player one card: its layout, its classes and its text, all editable in the Designer. Everything else is created by the About page's script when the fight starts and removed when it ends. That keeps the Designer clean and means the fight costs nothing until someone earns it.

The script ships like the rest of the site's custom code: built from source, versioned on GitHub, served from jsDelivr with an integrity hash, and registered in Webflow ([how that works](/observatory/webflow-custom-code-github-jsdelivr)).

## Pixel art from text

There are no image files. Each sprite is an array of strings, one character per pixel, and a small function turns them into SVG rectangles:

```js
var SHIP = [
  '.....o.....',
  '....oxo....',
  '....xwx....',
  '...xxxxx...'
  // ...
];
function sprite(rows, col){
  var r = '';
  rows.forEach(function(row, y){
    for (var x = 0; x < row.length; x++){
      var c = row.charAt(x);
      if (col[c]) r += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + col[c] + '"/>';
    }
  });
  return '<svg viewBox="0 0 ' + rows[0].length + ' ' + rows.length + '" shape-rendering="crispEdges">' + r + '</svg>';
}
```

`shape-rendering="crispEdges"` keeps the pixels sharp at any size, and the 1.02 width hides hairline gaps between rectangles. Because the colors live in a lookup table, the boss can change its palette when it gets angry just by swapping fills.

## One clock for everything

The fight is a small real-time game: move, shoot, collide, repeat. It runs on `gsap.ticker`, the same clock the rest of the site already uses for animation and smooth scrolling, instead of starting a second `requestAnimationFrame` loop ([why one clock matters](/observatory/lenis-gsap-webflow-smooth-scroll)). Each tick gets the time since the last frame, so the ship moves at the same speed on a 60 Hz laptop and a 120 Hz phone.

Behind it, a canvas starfield flies at hyperspeed. One `speed()` function eases it between full warp when you arrive, cruise during the fight, a near stop while the ship charges its final shot and a burst when it fires. Changing one number sets the mood of the whole scene.

## The fight

- **You:** arrows or WASD to fly, Space to fire. On a phone, drag to fly (the ship sits above your finger so you can see it) and hold to fire.
- **The boss:** 100 HP, drifts side to side, fires aimed shots, and every few seconds charges a beam. The beam flickers for almost a second first, so you always get a fair warning. At half health it enrages: faster, redder and firing spreads.
- **Shields:** three, with a short invulnerable window after each hit. Lose them all and it's "Mission failed," with one tap to retry.

Tuning took longer than building. At 3 damage per hit, a good run lasted about five seconds, which felt like nothing. At 2, it's a real fight without being a chore.

The finish is the part I'm proudest of: the stars slow almost to a stop, the ship charges, a mega beam fires, a few impact frames flash, and then "You won." I also built an anime-style cut-in for that moment, and later cut it. Not every good idea survives the edit.

## Sound you have to ask for

Everything you hear is synthesized live with Web Audio: an original chiptune loop, lasers, hits, a roar, the beam and a fanfare. There are no audio files to download. Sound is off by default (nobody expects a portfolio to start making noise), there's a toggle in the corner, and the choice is remembered for next time.

## The exits matter most

A full-screen game on a website can easily become a trap. So:

- **It's a real dialog.** `role="dialog"`, `aria-modal`, focus moves in when it opens and back to where you were when it closes.
- **Space fires, it doesn't skip.** Focus goes to the dialog itself, not the Skip button, so pressing Space doesn't accidentally close it. Arrow keys and Space are kept from scrolling the page underneath.
- **Always a way out.** A Skip button, Esc, and a tap anywhere once you've won.
- **Motion off means no fight.** With reduced motion (or Engines off, the site's own switch), it skips straight to the result and shows the credits as a still list. The quest still counts. Nobody gets locked out of the ending.

## Credits, and one name

When you win, a short credits crawl rolls: "Starring: You, Player One," the boss, a soundtrack "synthesized live in your browser," the tools, and one last line: "No scope was harmed in the making of this website." Then the roles fade in (game idea, story, pixel art, code, sound), and my name streaks in from both sides of the screen. It's the only place in the fight where it appears.

## How I test a boss fight

You can't click through a boss fight fifty times by hand. For testing, I serve an unminified copy of the script with the damage turned up, plus a tiny autopilot that sends key presses every frame, and run it in a headless browser. That way every part of the fight (entrance, enrage, finisher, credits) can be checked on each release without playing it.

## In practice

- **Let the platform own the trigger.** Webflow holds the card; the script builds the rest only when it's needed.
- **Draw pixel art as data.** Strings to SVG means no image files, and palette swaps are free.
- **Use the clock you already have.** One ticker for the page and the game.
- **Warn before you hit.** A telegraphed attack feels fair; an instant one feels broken.
- **Sound off by default.** Always.
- **Build the exits first.** Skip, Esc, retry, and a version for motion off.

It's the most unnecessary thing on the site. It's also my favorite thing on it.

---

**Review notes**
- All facts from `code/src/about/10-boss.js`, `about/00-about.js` (Player one: LV starts 7, BOSS 20, Konami +30, swipe on phones), `docs/webflow-build-notes.md` (v0.24.0/0.24.1: 3 dmg made a perfect run ~5 s, now 2; 0.95 s beam telegraph; 1.5 s invulnerability; ship 80px above the finger), handoff v0.33.7 (canvas warp field, cut-in removed, name finale). Headless test hook as recorded in the build notes.
- Published straight to live at Angelino's ask (2026-09-30).
