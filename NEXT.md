# Relay: where we are (Saturday 7 November 2026)

Start a new conversation by reading this file, then the style guide.

## The project in one paragraph
Relay (formerly ArcRelay) is Tony Goff-Yu's free, unofficial, voice-first Android companion for ARC Raiders (Pixel 9). Ask out loud ("Hey Relay" or tap), it answers out loud and shows a map: nearest exit, quest steps, items, "not that one" rerouting. Everything runs on the phone. All seven maps have markers, places and quests; distances on every map (6 Nov); materials, plants and containers on all seven maps (6 Nov); only the Soul's Offering event items are Blue Gate only, and the event ends 16 Nov. Rules: £0 to run (no paid services or keys), UK English, no em dashes, no widows, palette charcoal #1C1E22 / panel #26282D / ink #15171C / cream #EEE8DC / amber #F2B33D, Inter Tight, Material Symbols Rounded only. Site grid: never break it. Every /beta section title sits in the left half and its content starts at the middle line, level with the other sections; fix spacing inside that grid, never move content off it. Push to main only when Tony says push; Claude pushes itself. Run `node tests/run.js` before every commit. The style guide is the rulebook: edit `tools/style-guide/template.html`, then `python3 tools/style-guide/make.py` builds `src/docs/style-guide.html` (never edit the built file).
- Name (5 Nov): the brand is Relay. Domain getarcrelay.app unchanged; repo renamed to relay (5 Nov). Package renamed to app.getarcrelay (5 Nov, matches Play Console; Sniff is app.getsniff); Java in `android/app/src/main/java/app/getarcrelay/`. Builds from 1.0.86 install as a new app: re-add it in Obtainium (APK is now relay.apk), re-download voices and the offline speech pack, then uninstall the old one. Play title "Relay: Arc Raiders Voice Guide" (7 Nov, was "Relay: Raid Voice Guide"); "for ARC Raiders" lives in the short and full descriptions. Tony updates Play Console himself.

## Site, 5 Nov
- Typeface is Inter Tight everywhere (app, site, style guide): -1% tracking on big words, 0 on section headings, +1% on body text. Barlow is gone.
- getarcrelay.app/beta is the new homepage: stacked "Hey / Relay", one 3D phone that travels down, parks on the right and cross-fades screens while the four features scroll past (order: Need a quick evac?, Just ask., Find what you need., Show it where you are.), then "Ask. Find. / Get out." with the phone turned the other way showing the time-of-day greeting. Phones: stacked rows, words only in the finale. Built by `tools/hero/make_v5.py` (run from site/beta); the old homepage is kept in `tools/hero/old-homepage-4nov.html`. /beta/v2 and /beta/v5 forward to /beta; v3 and v4 are the earlier landing tests.
- Every /beta page: solid sticky bar (88 px, 72 on phones), mark only, gutters to the page edge.
- Mac copy is ~/Relay. Package app.getarcrelay from 1.0.86 (see Name above).

## 7 Nov: real screens everywhere
- `tools/captures/`: `capture.js` renders every app screen from `www/index.html` with real MetaForge tiles (kept in `tools/captures/tiles/`, any missing ones listed in `missing.txt`); scenes and their words in `scenes.js`. `publish.py` then fills the /beta homepage phones, the two onboarding pictures, the portfolio screens and `relay_app.png`. Play art: `android-release/play-listing/source` (render.js, finish.py) uses the same captures; screenshot 4 is now Get help on quests.
- /beta: Get the app is a non-tappable Coming soon label until open testing.

## Site, 6 Nov (pushed)
- /beta homepage replaced by the new version (draft.html gone): features Nearest anything, Under fire?, Just ask., Quest steps. In testing. Placeholder screens on the page colour until real captures; no "Free. No account. No ads." line. Edited by hand now; `tools/hero/make_v5.py` is retired.
- How it works: app's current icons (locate, route, expand), new sections Find the nearest anything, Quest steps in testing, See the whole map; every phrase in Things to say checked against the app. Credits: distances on all maps from allthings.how.
- App misses found while checking: "Say that again" / "Repeat that" after an exit answer, and "I can't go south-east" said on its own (works only as a follow-up). Not fixed yet (heldout3 first).
- Copy doc synced 6 Nov (site plus App onboarding section). Onboarding copy now mirrors the homepage: Say Hey Relay, Find anything., Need to get out quick?, Pick Relay’s voice. No quests in onboarding while in testing.

## Done late 5 Nov (all pushed)
- "Show me the X map", map picker on home in the voice-row pattern (single row on short phones), greeting fits four lines on every size, headline top-aligned.
- Saying only where you are: "Got it, X. What do you need?" (no longer assumes the nearest exit). Small context and "Heard" text gone; a miss just asks you to repeat.
- Map buttons always amber, icons never change: map (whole map, tap again for back to the answer), filled locate dot (set location), route.
- Settings: cream headings 600 18/24, rows 500 18/24, 48 px between sections. About is one line, four rows that open the site (feedback, how it works, privacy, credits and legal) with an arrow_outward icon, one line of credits, then the version.

## 7 Nov evening: Tony's raid test fixes (committed, not pushed)
- A new pin or spoken location re-answers what you were after (S.want) from there, even when the ask named a place. Was inconsistent: dropped the target when the ask included a place.
- Everyday item names (scrap, scrap metal, rubber, plastic, electronics, gun parts, chems, cloth, cables) in `tools/items/genitems.js` SLANG; place names never read as items (Dam's Scrap Yard).
- Clear route: fourth map button (route icon, slash up to the right), only while a route shows. Same as saying never mind: drops the target, keeps your location. X unchanged: home, fresh start.
- Known miss: "how do I get to the Scrap Yard" with no location set falls back.
- Next session, captures (Tony, 7 Nov late; visuals not updated yet): swap maps across the screens (site homepage phones, Play screenshots, portfolio) so they aren't all the same Blue Gate Village crop, and avoid two yellow loot-zone outlines in one screen. Scenes live in `tools/captures/scenes.js`. Recaptures will also show the new clear route button wherever a route is drawn.

## Next (pick one)
1. Tony on the Pixel: map buttons, location-only reply, About links open the browser, "show me the Dam map", Hey Relay with game audio.
2. Done 6 Nov: distances on all seven maps. Scales fitted from allthings.how place pages (`tools/places/dist/*.json`, `node tools/places/scale.js`), typical error 1 to 10%; `tests/maps.js` checks them. Dam's central complex is the roughest (multi-level, published figures disagree). Fixed MetaForge's "Hiltop hatch" to Hilltop Hatch.
3. Items: done. Materials, plants and containers work on all seven maps (Loot finder, 6 Nov). Only the Soul's Offering event items are Blue Gate only; not needed, the event ends 16 Nov before release.
4. Understanding (6 Nov): held-out set 14/25 to 25/25; a second set written before the fixes scored 21/25 cold, 25/25 after. Both are now tuned against, so write a fresh `tests/heldout3.js` before the next round. Fixed by pattern: casual done/arrived wording, way home/bail, wiped/lobby deaths, jumping back in, home safe, quest plus step described by what you're doing, "ta, that's me". `SET=adversarial` guards look-alikes ("go home to roost", "lost all my shield", "I'm out of ammo").
ARC finder (6 Nov): works on all seven maps, now with distances; misheard and plural names ("rocket ears", "bombardiers"); an ARC that isn't on this map says which maps have it; small ARC (wasps, ticks...) say they aren't tracked.
5. Done 6 Nov: all 13 flagged quests settled against MetaForge's quest pages (game objectives). Fixed: The Clean Dream (2 containers, blueprint then deliver, not a photo), Ruins and Reverberations (getting the relay is not a step), Sizing Things Up (any 2 of 3 first steps), A Rising Tide (two objectives at the Dam), Celeste's Journals (Raider Outpost East), Taking Stock (Nomadic Envoy), The League (searches optional). Order still worth a check in game for The League and Broken Monument.
Loot finder (6 Nov): 21,214 spots of 33 types on all seven maps from MetaForge's map markers (nature: moss, candleberries, mullein, mushrooms, agave, apricots, lemons, olives, roots, fertiliser, prickly pears; containers: raider caches, probes, couriers, ammo, weapon, med, utility and field crates, lockers, cars, husks and more). "Nearest X" gives one dot, direction and distance; prefers spots not behind a locked door; says which maps have it if this one doesn't. Loot words are kept out of place matching (Blue Gate's "Olive Grove", "Security Wing"). Refresh: read the map pages in Chrome into tools/maps/source/loot.json, then node tools/maps/genloot.js.
Crafting items by name (7 Nov, not pushed): "where do I find wires?", "I need rubber parts". 223 items from MetaForge's item data, each with its loot kinds (electrical, medical...), matched to 78 named places tagged by allthings.how (in-game map categories), checked against leprestore.com (agree on 22 of 24 both cover). Nearest place of that kind, plus raider caches for raider items and med crates for medical ones; "Rocketeer Driver" goes to the ARC finder; small ARC parts say which ARC. Guides differ on Dam's Research & Administration and Riven Tides' Azzurro Beach (allthings.how used). Stella Montis's Medical Research and Cultural Archives come from leprestore only. Worth a check in game. See `tools/items/README.md`. How it works updated (Find the nearest anything, plus "Where do I find wires?" and "I need rubber parts" in Things to say; "Find me some moss" dropped). Homepage and copy doc not changed yet.
Open testing plan (6 Nov, for when Tony says we're ready; not yet):
   - Play Console: promote the closed test to an open testing track (anyone can join from the Play listing, no invite list).
   - Site: "Get the app" becomes "Test the app" (header and every CTA) and links to the Play open-testing listing.
   - Site: a short, plain disclaimer by the button and on How it works: Relay is in testing, things may be wrong or change, feedback welcome (link to /feedback). Copy through the Google Doc first.
   - App: About says "Test build" with the version; feedback link in Settings stays.
   - Feedback loop: feedback@ mail goes to Tony; misheard phrases go into the next held-out test set.
   - Before switching: release checklist below done, homepage copy and screens refreshed (see the USP plan), materials and plants in.
6. Release checklist (6 Nov):
   - [ ] TEST BUILD (6 Nov, back in for Tony): onboarding shows on every open and on return from the background (`OB_EVERY_OPEN` in `www/index.html`), with the invisible skip top right (`#obskip`). Before release: remove both, and swap the two `.obph` placeholders for real onboarding images.
   - [x] Hidden diagnostics (press and hold the version line) kept on purpose, for bug reports.
   - [x] Version numbers come from the build (BUILD_NUMBER), nothing to bump by hand.
   - [ ] Tony decides: MetaForge credit on the holding page too (it shows no maps; every /beta page already credits them). Copy goes through the Google Doc first.
   - [x] Swap prepared 7 Nov, not live: commit c399dd5 does the move (full site to the root, holding page to `tools/hero/`, /beta/* redirects so app and Play links keep working, noindex gone, robots allow, sitemap). It went live by mistake and was undone the same day; to go live, revert the undo commit. Already in /beta: final canonical and og tags, feedback as an email link, privacy fixes. v3/v4 tests deleted.
   - [ ] Before it goes live: the four homepage phone screens are still placeholders (Listening, nearest Bastion, nearest exit, quest step); "Get the app" is an unlinked label until open testing (then "Test the app").
   - [ ] Play Console: store listing (Tony), privacy policy URL getarcrelay.app/privacy after go-live (/beta/privacy redirects there), data safety form (no data collected, no account), content rating, closed test track first.
   - [ ] Fresh held-out set (tests/heldout3.js) from Tony's raid notes, scored cold before any fixes.

## Where things are
- Site copy (5 Nov): Google Doc "Relay" in Drive Claude/Relay, every page of getarcrelay.app: https://docs.google.com/document/d/1hS12w_3GLEDgG62_lDrAJV3aB_Nl2Je9P-BKeoo7MrU/edit . Tony edits there; copy changes go from the doc to the site, and any wording changed on the site goes back into the doc. Site only, not the app.
- Repo: github.com/Gandalondon/relay (was spottr, then arcrelay; GitHub forwards the old addresses), branch main. Mac copy: `~/Relay` (git clone; pull after each push).
- App: `www/index.html` (whole app), native plugins in `android/app/src/main/java/app/getarcrelay/`. Tests: `node tests/run.js` (understanding, 175/175; `SET=heldout`, `SET=heldout2`, `SET=adversarial` for the extra sets) and `node tests/maps.js` (every map's markers well formed and inside its bounds).
- Builds: GitHub Actions makes APK releases `v1.0.N` on each push that touches the app; Tony installs via Obtainium. Pushes touching only `site/`, `android-release/`, `marketing/`, `src/docs/`, `tools/style-guide/` or `*.md` skip the build.
- Site: `site/` on Vercel project "arcrelay" (Ganda team, Hobby), root directory `site`. getarcrelay.app = holding page; getarcrelay.app/beta = full site (noindex); go-live prepared (see release checklist). Feedback is a mailto to feedback@getarcrelay.app (the form never sent: ImprovMX refuses Brevo mail).
- Play listing: `android-release/` (icon, 2 screenshots, feature graphic, listing text, alt text, README). App name on Play: "Relay: Arc Raiders Voice Guide" (7 Nov).
- Email: *@getarcrelay.app forwards to tony@gandalondon.com via ImprovMX (second account, Tony's personal Gmail login). DNS records in Vercel.
- Map data: MetaForge (metaforge.app). Map images allowed with credit "at the bottom of every page" (Discord ticket #2061, 1 Nov 2026). `www/data-bluegate.js` (markers), `www/data-bluegate-places.js` (28 named areas, fitted with `tools/places/`).

## Latest app state (1.0.66)
Voice: Supertonic offline voices (F Sophie, Amy, Ava, Maya, Ivy; M Adam, Ben, Owen, Leo, Mark), on-device speech recognition with a one-tap offline pack download, "Hey Relay" wake phrase (sherpa-onnx keyword spotter), one 8-second follow-up listen then standby. Map: inset tile, amber buttons top right (Full map, Set location, Show route when there's a route), two-step pin (Set location, tap, "I'm here"; hollow ring until confirmed; a confirmed pin replaces a spoken location). Start animation: Android reports where it drew the icon, the lines drop out of the circle, then the screen appears.

Since 1.0.66 (4 Nov, 1.0.67): answer headline with a map is fixed 48 px, three lines max, in a fixed box, and the context line always holds its line, so the map never moves. Place names no longer vanish after a small pinch.

## Needs Tony (on the Pixel)
- Start animation: 1.0.65 launcher-icon match undone 4 Nov (logo shrank and jumped after Android's splash); back to the splash-matched 1.0.64 version. Check it on the Pixel.
- Test the pin flow in a raid (1.0.66).
- "Hey Relay" with game audio playing: false triggers or misses?
- Reply from MetaForge on the marker data (below).

## Next: all the other maps (one map per day, fresh chat each)
Maps (7): Dam Battlegrounds, Buried City, Spaceport, Blue Gate (done), Stella Montis, Riven Tides (Apr 2026), Pendola Pass (8 Oct 2026, largest). MetaForge has all seven (metaforge.app/arc-raiders/map/<id>: dam, buried-city, spaceport, blue-gate, stella-montis, riven-tides, pendola-pass).
MetaForge OK'd using their data (Tony, 4 Nov evening), with credit. DONE 4 Nov: loot zone outlines and region / loot-zone / landmark names for all seven maps in `www/data-zones.js` (from their map config chunk, read through Chrome; the workspace can't reach metaforge.app, so files come via Tony's Downloads). Zones are drawn on the map. Still to pull: the markers for five maps (Dam done 5 Nov).
Step 1 (tiles and transform) is DONE for all six (4 Nov): `www/data-<map>.js`, read from MetaForge's live map config. Tile size, max zoom, tile bounds and pan limits are now per map (Dam and Stella Montis use 256 px tiles; Pendola Pass tops out at zoom 4; Stella Montis tiles are {z}/{x}_{y} and only its "default" floor layer is in). bounds/maxBounds are the whole image until markers arrive (Dam's tightened 5 Nov).
Per map (Blue Gate is the template; roughly a day each):
1. Tiles and coordinate transform (quick).
2. Markers: exits, hatches, quest spots, ARC. How (Dam, 5 Nov): in Chrome on metaforge.app/arc-raiders/map/<id>, `fetch('/api/game-map-data?tableID=arc_map_data&mapID=<id>')` returns `allData`. Blue Gate's filter: locations extraction / hatch / locked_room / breach_room / antenna / raider_camp; ARC comet / sentinel / vaporizer / rocketeer / turbine / bison / bastion / bombardier / shredder / leaper / queen / matriarch; quests only rows with an instanceName. Row: [l/a/q, subcategory, name, round(lat), round(lng)]. Read the rows out in chunks of ~20 (tool output truncates near 1,000 characters) and check a checksum against the page. bounds = markers, zones and labels plus 150.
   DONE 5 Nov, all seven: Blue Gate 194, Dam 178, Buried City 153, Spaceport 243, Stella Montis 139, Riven Tides 109, Pendola Pass 119 markers (every map checksummed against MetaForge). Big ARC set now includes Hydra, Bully and Skulker (Pendola). Pendola has no hatches; Riven Tides has two exits; Stella Montis markers from every floor sit on its default-floor tiles.
3. Places (5 Nov): `www/data-<map>-places.js` for every map but Blue Gate, all writing `window.MAP_PLACES[id]`: MetaForge labels plus spoken short forms (a short form two places on one map share is dropped). A name on several ready maps ("Old Town", "Railyard") asks "Which map?" unless you're already on one. Exit badges: airshaft (fan), lift or elevator (lift), metro station (train), transceiver (radio mast).
4. Quests (Dam, 5 Nov): `www/data-dam-quests.js`, 23 quests and 77 steps, each checked against two or more guides (named in each quest's note); 38 steps pinned to MetaForge markers by quest id and step name; steps on other maps say so. A quest's home map comes from its pins. Not fully settled (in their notes): Celeste's Journals (pin inferred), Straight Record (giver), Greasing Her Palms and The League (order), Broken Monument (search and deliver order), A Rising Tide (logbook wording), Taking Stock and To the Skies (wording paraphrased). A Bad Feeling: MetaForge's light bulb pin matches no step, so unused. Paving the Way: which notice board belongs to which building is unconfirmed, so step 2 has no pin.
   All maps (5 Nov): `www/data-<map>-quests.js` for Dam (23), Buried City (13), Spaceport (14), Stella Montis (11), Riven Tides (5), Pendola Pass (6), 72 quests in all plus Blue Gate's in index.html, each checked against two or more guides. Steps on another map carry `pm` (pin map), so Medical Merchandise, Eyes in the Sky, Taking Stock and others pin every step. Not fully settled (see each quest's note): Building a Library (which book is which pin), Industrial Espionage (rival cache unpinned), Cold Storage, The Clean Dream (old and new step lists differ), Sizing Things Up and Ruins and Reverberations (optional steps), and a few givers named by one guide only. maps.js fails if two quests share a spoken name.
   Regenerating: `tools/maps/` has the generators and every source file (raw MetaForge pulls, rows, quest research); see its README.
3. Named places for "where are you?": MetaForge's labels are now in `www/data-zones.js` (regions, loot zones, landmarks), so this step is mostly data wiring, not fitting.
4. Quest steps and items for that map, checked against two guides.
5. Tests, like Blue Gate's.
Map switching: DONE 5 Nov. `useMap(id)` rebuilds exits, hatches, ARC, places and wording for the map in use (`S.map`, kept for the raid). A map name or a place only one ready map has switches; several: "Which map?"; no markers yet: "X: not yet." A quest step pinned on another map switches to it. Per map: places in `www/data-<map>-places.js` (Dam: MetaForge labels plus spoken aliases), `METRES` (Blue Gate 5.5; the rest from `UNITS_PER_METRE`, fitted 6 Nov); loot on all seven maps, Soul's Offering event items Blue Gate only. Order: the map Tony plays most after Blue Gate first, Pendola Pass last.

## Onboarding (built 5 Nov)
- **Before release: remove both test switches** in `www/index.html`: `OB_EVERY_OPEN` (onboarding on every open and on return from the background) and the invisible skip `#obskip` (top right, marked TEST BUILD ONLY). With them gone, onboarding shows once per install (`relay-onb` in storage).
- Screens 2 and 3 (`www/onboard-find.webp`, `www/onboard-exit.webp`) and the site screens are regenerated from the live app with the real Blue Gate tiles (5 Nov): tiles are saved in `android-release/play-listing/source/tiles`, run `recapture.js` then `composite.py`. No Pixel screenshots needed.
- Play Store visuals: on hold; the relay-play-listing-art skill is there for when Tony asks.

## Onboarding (agreed 4 Nov)
Mockup: https://claude.ai/artifact/LaZfxhucnGwofdQdHAVK9d . Four screens, no Skip, each heading / body / visual, headlines two lines, dots centred with a full-width button under them:
1. "Say “Hey Relay”." Listening mic (static, with halo).
2. "Find what you need." Nearest Rocketeer map (items, enemies, spawns; not quests for now).
3. "Find the nearest exit." Evac on open ground, no zones, line in a different direction to screen 2.
4. "Pick Relay’s voice." Voice rows (name + Female/Male, no "Supertonic"), Skip (outline, 1/3) + Download (amber, 2/3) like Sniff's Back/Next.
Also: Settings voice row says "Offline. Tap to change." (drop "Supertonic"; credit stays in About).

## Other to-dos (smaller)
- Play packaging: a signed AAB with an upload key (like Sniff). App label on the phone is now "Relay" (1.0.68), matching Play and the site. Wake phrase stays "Hey Relay".
- Site feedback: done 7 Nov, an amber text link to feedback@getarcrelay.app (no button, no underline) instead of the form.
- Style guide Gaps: done 4 Nov (48 px map buttons, "Maps by MetaForge" everywhere, dead `.gkey input` styles gone, names under the map buttons hidden). 75% cream secondary text kept as the one exception.
- Block taps outside the playable area if MetaForge publishes a boundary.
- Estimates only: screen-off listening, live exit status. Loot tiers: parked (Tony, 4 Nov). MetaForge only has 8 loot zone points on Blue Gate anyway.
- Map on screen (5 Nov, built): the ready screen shows a "Which map?" picker (a tap = "Show me the X map"); a name on several maps shows just those; an answer without its own map keeps the last map for the raid. "Show me the Dam map" and friends show the whole map and ask where you are. No new icon next to the mic.
