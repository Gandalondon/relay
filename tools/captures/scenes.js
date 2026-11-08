// The scenes, shared by every output. Edit the words here, then re-run capture.js.
// 8 Nov: a different map per screen, so the site, Play and portfolio aren't all the same Blue Gate crop,
// and no more than one yellow loot-zone outline in any answer screen (the whole-map view shows them all, on purpose).
module.exports = [
  { id: 'home' },
  { id: 'listening', listen: true },
  { id: 'find', map: 'dam', place: 'Scrap Yard', ask: 'nearest Bastion' },
  { id: 'exit', map: 'buried-city', place: 'Church Ruins', ask: "I'm under fire, where's the nearest exit" },
  { id: 'loot', map: 'riven-tides', place: 'Wharf', ask: 'any apricots near me' },
  { id: 'whole', map: 'riven-tides', place: 'Wharf', ask: 'any apricots near me', click: '#full' },  // portfolio: the whole map
];
module.exports.push({ id: 'quest', map: 'stella-montis', place: 'Lobby', ask: "I'm on Snap and Salvage, step 2" });  // homepage: Get help on quests
module.exports.push({ id: 'moss', map: 'pendola-pass', place: 'Old Town', ask: 'find me some moss' });  // portfolio pair: ask for anything
module.exports.push({ id: 'cache', map: 'spaceport', place: 'Car Park', ask: "where's the nearest raider cache" });
module.exports.push({ id: 'clip', map: 'blue-gate', place: 'Village', ask: "where's the nearest Rocketeer" });  // trailer: the answer screen
