# Crafting items by name (7 Nov 2026)

"Where do I find wires?" points to the nearest named place of the right loot kind on the map in use.

- `source/items.txt`: MetaForge's item data (metaforge.app/api/arc-raiders/items, read in Chrome): each item's loot categories. Legend at the top.
- `source/place-loot.json`: loot categories per named place from allthings.how (named places page, as the in-game map marks them), with leprestore.com alongside. allthings.how wins where they differ; leprestore only fills places allthings.how leaves blank.
- `node genitems.js` builds `www/data-items.js` and prints where the two guides differ.
- In the app (`craftAnswer` in `www/index.html`): raider items also point to raider caches, medical items to med crates (MetaForge containers). ARC parts named after a big ARC go to the ARC finder ("Rocketeer Driver"); small ARC parts say which ARC to salvage. Plants and fertiliser stay with the loot finder (exact spots).
- Refresh: read the items API in Chrome into `source/items.txt` (same format), check the places page, run the script, then `node ../../tests/run.js`.
