/* node genitems.js : www/data-items.js, crafting items by name (7 Nov 2026).
   source/items.txt: MetaForge's item data, each item's loot categories (Electrical, Mechanical...).
   source/place-loot.json: which named places carry which loot categories, from allthings.how (as the in-game map marks them),
   checked against leprestore.com. allthings.how wins where they differ; leprestore only fills places allthings.how leaves blank.
   Relay then answers "where do I find wires?" with the nearest place of the right kind on the map in use. */
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, 'source'), W = path.join(__dirname, '../../www');
const CAT = { a: "ARC", b: "Electrical", c: "Mechanical", d: "Nature", e: "Residential", f: "Medical", g: "Commercial", h: "Old World", i: "Technological", j: "Security", k: "Exodus", l: "Industrial", m: "Raider" };
const LETTER = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [v, k]));
const MAP_ID = { "Blue Gate": "blue-gate", "Dam": "dam", "Buried City": "buried-city", "Spaceport": "spaceport", "Stella Montis": "stella-montis", "Riven Tides": "riven-tides", "Pendola Pass": "pendola-pass" };
/* plants and fertiliser have exact MetaForge spots already (loot finder), so they stay there */
const HAS_SPOTS = new Set(["Agave", "Apricot", "Candleberries", "Fertilizer", "Great Mullein", "Lemon", "Moss", "Mushroom", "Olives", "Prickly Pear", "Roots"]);

/* place names the app knows, per map, so every tagged place resolves to a real spot */
global.window = {};
for (const f of fs.readdirSync(W).filter(f => /-places\.js$/.test(f))) require(path.join(W, f));
const known = { "blue-gate": new Set((window.BLUE_GATE_AREAS || []).map(a => a.n)) };
for (const [id, d] of Object.entries(window.MAP_PLACES || {})) known[id] = new Set([...(d.areas || []), ...(d.regions || [])].map(a => a.n));

const PL = JSON.parse(fs.readFileSync(path.join(SRC, 'place-loot.json'), 'utf8')).places, places = {}, notes = [];
let agree = 0, both = 0;
for (const p of PL) {
  const id = MAP_ID[p.map], cats = p.allthings || p.leprestore;
  if (!known[id] || !known[id].has(p.place)) { notes.push("not a place on " + p.map + ": " + p.place); continue; }
  if (p.allthings && p.leprestore) { both++; if (p.leprestore.every(c => p.allthings.includes(c))) agree++; else notes.push("differs, " + p.map + " " + p.place + ": allthings " + p.allthings + " / leprestore " + p.leprestore); }
  if (!p.allthings) notes.push("leprestore only: " + p.map + " " + p.place);
  (places[id] = places[id] || []).push([p.place, cats.map(c => LETTER[c]).join("")]);
}

/* the names people say: full name, singular and plural, without edition notes or "MK." dots */
const plural = w => /(s|x|ch|sh)$/.test(w) ? w : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ies" : w + "s";
const singular = w => /ies$/.test(w) ? w.slice(0, -3) + "y" : /[^s]s$/.test(w) ? w.slice(0, -1) : w;
const say = n => n.toLowerCase().replace(/\(.*?\)/g, " ").replace(/\bmk\. ?/g, "mark ").replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const raw = fs.readFileSync(path.join(SRC, 'items.txt'), 'utf8').split('\n').filter(l => l && !l.startsWith('#')).join('').split(';');
const items = [], taken = new Map();
/* what players actually say (7 Nov, Tony's test: "scrap metal" isn't an item). Kept short: only words that clearly mean one item */
const SLANG = {
  "Metal Parts": ["scrap", "scrap metal", "metal scrap", "metal", "bits of metal", "metal bits"],
  "Rubber Parts": ["rubber"],
  "Plastic Parts": ["plastic", "plastic bits"],
  "Electrical Components": ["electronics", "electrical bits", "electricals"],
  "Mechanical Components": ["mechanical bits", "mechanicals"],
  "Simple Gun Parts": ["gun parts", "gun bits"],
  "Chemicals": ["chems"],
  "Fabric": ["cloth"],
  "Wires": ["cables"]
};
for (const r of raw) {
  const [n, code] = r.split('~'); if (HAS_SPOTS.has(n)) continue;
  const base = say(n), words = base.split(' '), last = words.at(-1);
  const al = [...new Set([base, [...words.slice(0, -1), plural(last)].join(' '), [...words.slice(0, -1), singular(last)].join(' ')])];
  al.push(...(SLANG[n] || []));
  const mine = al.filter(a => !taken.has(a)); mine.forEach(a => taken.set(a, n));
  items.push([n, code.slice(1), mine]);
}
const out = { items, places };
fs.writeFileSync(path.join(W, 'data-items.js'), '/* Crafting items by name (7 Nov 2026), built by tools/items/genitems.js. items: [name, loot categories, spoken names];\n   places: per map, [place, loot categories]. Categories: ' + Object.entries(CAT).map(([k, v]) => k + " " + v).join(", ") + '.\n   From MetaForge (items) and allthings.how, checked against leprestore.com (places). */\nwindow.CRAFT = ' + JSON.stringify(out) + ';\n');
console.log(items.length + " items, " + Object.values(places).flat().length + " tagged places; guides agree on " + agree + " of " + both + " places both cover");
if (notes.length) console.log(notes.join("\n"));
