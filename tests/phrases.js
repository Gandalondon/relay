/* Relay understanding test set: what a player on a sofa actually says, mid-raid, with gunfire and half-heard words.
   Each case sets up where the player is, then says one thing. `want` is what Relay should do.
   want: quest + step (1-based) | advance (next step) | same (repeat the current step) | exit | died | newraid | extracted
         | place (they said where they are) | hatch | enemy | stop | fallback (genuinely meaningless) */
const HTR = { quest: "Home to Roost", step: 3 };   /* mid-quest: on step 3, just told to go to the locker room */
const NONE = {};
const AT_VILLAGE = { place: "Village" };
module.exports = [
  /* starting or switching a quest, said well and badly */
  { set: NONE, say: "I'm on Home to Roost, step 3", want: { quest: "Home to Roost", step: 3 } },
  { set: NONE, say: "home to boost step five", want: { quest: "Home to Roost", step: 5 } },
  { set: NONE, say: "I'm doing home to roast", want: { quest: "Home to Roost" } },
  { set: NONE, say: "the roost one, step two", want: { quest: "Home to Roost", step: 2 } },
  { set: NONE, say: "I'm on the frigate one", want: { quest: "Boarding the Frigate" } },
  { set: NONE, say: "nothing ventured", want: { quest: "Nothing Ventured" } },
  { set: NONE, say: "first nomads step 4", want: { quest: "The First Nomads", step: 4 } },
  { set: NONE, say: "reduced to rubble", want: { quest: "Reduced to Rubble" } },
  { set: NONE, say: "a path not yours", want: { quest: "A Path Not Yours" } },
  { set: NONE, say: "wires crossing", want: { quest: "Wires Crossed" } },
  { set: HTR, say: "step five", want: { quest: "Home to Roost", step: 5 } },
  { set: HTR, say: "I'm on five now", want: { quest: "Home to Roost", step: 5 } },
  { set: HTR, say: "the fifth one", want: { quest: "Home to Roost", step: 5 } },
  { set: HTR, say: "skip to step 7", want: { quest: "Home to Roost", step: 7 } },
  { set: HTR, say: "go back a step", want: { quest: "Home to Roost", step: 2 } },

  /* arriving and moving on */
  { set: HTR, say: "done", want: { advance: true } },
  { set: HTR, say: "okay done what's next", want: { advance: true } },
  { set: HTR, say: "I'm in the room, what do I do now?", want: { advance: true } },
  { set: HTR, say: "I'm here", want: { advance: true } },
  { set: HTR, say: "made it", want: { advance: true } },
  { set: HTR, say: "got there", want: { advance: true } },
  { set: HTR, say: "found it", want: { advance: true } },
  { set: HTR, say: "next", want: { advance: true } },
  { set: HTR, say: "next step", want: { advance: true } },
  { set: HTR, say: "now what", want: { advance: true } },
  { set: HTR, say: "right, I'm through the door", want: { advance: true } },
  { set: HTR, say: "ok I'm in", want: { advance: true } },
  { set: HTR, say: "that's done", want: { advance: true } },
  { set: HTR, say: "finished that", want: { advance: true } },

  /* lost, didn't hear */
  { set: HTR, say: "say that again", want: { same: true } },
  { set: HTR, say: "what was that", want: { same: true } },
  { set: HTR, say: "sorry what", want: { same: true } },
  { set: HTR, say: "repeat", want: { same: true } },
  { set: HTR, say: "where am I going", want: { same: true } },
  { set: HTR, say: "which way", want: { same: true } },
  { set: HTR, say: "where do I go", want: { same: true } },
  { set: HTR, say: "what do I do", want: { same: true } },
  { set: HTR, say: "what am I looking for", want: { same: true } },
  { set: HTR, say: "I'm lost", want: { same: true } },
  { set: HTR, say: "where is it", want: { same: true } },

  /* panic: get me out */
  { set: HTR, say: "get me out", want: { exit: true } },
  { set: HTR, say: "help I need to get out", want: { exit: true } },
  { set: HTR, say: "exit", want: { exit: true } },
  { set: HTR, say: "where's the exit", want: { exit: true } },
  { set: HTR, say: "nearest extract", want: { exit: true } },
  { set: HTR, say: "evac", want: { exit: true } },
  { set: HTR, say: "I need to leave now", want: { exit: true } },
  { set: HTR, say: "how do I get out of here", want: { exit: true } },
  { set: HTR, say: "extraction point", want: { exit: true } },
  { set: AT_VILLAGE, say: "nearest way out", want: { exit: true } },
  { set: AT_VILLAGE, say: "I've got two minutes, get me out", want: { exit: true } },
  { set: HTR, say: "help", want: { exit: true } },
  { set: HTR, say: "airshaft", want: { exit: true } },
  { set: HTR, say: "where's the nearest hatch", want: { hatch: true } },

  /* where I am */
  { set: HTR, say: "I'm at the village", want: { place: "Village" } },
  { set: NONE, say: "I'm by the comms tower", want: { place: "the Communication Tower" } },
  { set: NONE, say: "near the checkpoint", want: { place: "Checkpoint" } },
  { set: NONE, say: "I'm in the cellar", want: { place: "the Cellar" } },
  { set: NONE, say: "I'm at the olive grove", want: { place: "Olive Grove" } },
  { set: NONE, say: "next to the fort", want: { place: "Ancient Fort" } },

  /* where I am, the way people actually say it (29 Oct test: "I'm near the farm, south east") */
  { set: NONE, say: ["I need an evac point", "I'm near the farm, south east"], want: { exitName: "Overlook Airshaft", place: "Farmlands" } },
  { set: NONE, say: ["get me out", "south east"], want: { exitName: "Overlook Airshaft" } },
  { set: NONE, say: ["get me out", "somewhere in the southeast"], want: { exitName: "Overlook Airshaft" } },
  { set: NONE, say: ["evac", "no idea, top left I think"], want: { exitName: "Cliffside Airshaft" } },
  { set: NONE, say: ["way out", "by the big wrecks on the left"], want: { exitName: "Forest Airshaft" } },
  { set: NONE, say: ["where's the exit", "the homestead"], want: { exitName: "Overlook Airshaft" } },
  { set: NONE, say: ["evac", "I'm in the village"], want: { exitName: "Cliffside Airshaft" } },
  { set: NONE, say: ["where's the nearest extract", "warehouse"], want: { exitName: "Warehouse Airshaft" } },
  { set: NONE, say: ["get me out", "blah blah the thing"], want: { near: "which side of the map" } },
  { set: NONE, say: "evac from the south east", want: { exitName: "Overlook Airshaft" } },
  { set: NONE, say: "I'm at the farm, where's the nearest way out", want: { exitName: "Overlook Airshaft", place: "Farmlands" } },
  { set: NONE, say: "I'm at the olive grove, get me out", want: { exitName: "Forest Airshaft" } },
  { set: NONE, say: "I'm near the data vault", want: { place: "Data Vault" } },
  { set: NONE, say: "I'm at pilgrim's peak", want: { place: "Pilgrim's Peak" } },
  { set: NONE, say: "near the gate control room", want: { place: "Gate Control Room" } },
  { set: NONE, say: "I'm at trappers glade", want: { place: "Trapper's Glade" } },
  { set: NONE, say: "I'm in the forest", want: { place: "The Forest" } },
  { set: NONE, say: "I'm at the forest airshaft", want: { place: "Forest Airshaft" } },
  { set: NONE, say: "I'm at the warehouse", want: { place: "Warehouse Complex" } },
  { set: NONE, say: "I'm by the highway collapse", want: { place: "Highway Collapse" } },
  { set: NONE, say: ["I'm at the farm", "what's around me"], want: { near: "Ruined Homestead" } },

  /* "not that one": ruling an exit out (29 Oct test: kept saying north-east) */
  { set: NONE, say: ["I'm at the farm", "where's the nearest evac", "I can't go that way, there's too many enemies, I need a different evac point"], want: { near: "(Next best is|Try|Then go for) (Forest|Cliffside|Warehouse) Airshaft" } },
  { set: NONE, say: ["I'm at the farm", "evac", "another one", "not that one either"], want: { near: "(Next best is|Try|Then go for)" } },
  { set: NONE, say: ["I'm in the village", "get me out", "too many enemies, somewhere else"], want: { near: "(Next best is|Try|Then go for)" } },

  /* items (Soul's Offering) */
  { set: NONE, say: "where do I find fertilizer", want: { show: "Fertiliser: where are you" } },
  { set: NONE, say: ["I'm at the farm", "I need dead flowers"], want: { near: "Try (Ruined Homestead|Ancient Fort)" } },
  { set: AT_VILLAGE, say: "any fertiliser near me", want: { show: "Nearest fertiliser" } },
  { set: NONE, say: "where can I get rock salt", want: { near: "No spots recorded" } },

  /* directions and map edges (4 Nov) */
  { set: NONE, say: ["I'm south west", "anything south of me"], want: { near: "edge of the map" } },
  { set: NONE, say: ["I'm at the farm", "is there an exit to the west"], want: { near: "Forest Airshaft" } },
  { set: NONE, say: ["I'm at the farm", "anything north of me"], want: { near: "metres north" } },
  { set: NONE, say: ["I'm at the farm", "get me out", "I can't go north east"], want: { near: "(Forest|Cliffside) Airshaft" } },
  { set: NONE, say: ["I'm near the fort", "evac", "that one's closed"], want: { near: "(Next best is|Try|Then go for)" } },
  { set: NONE, say: ["I'm near the fort", "evac", "it's shut, another one", "there's an ARC blocking it, another"], want: { near: "(Next best is|Try|Then go for)" } },
  { set: NONE, say: "I'm south west", want: { near: "Got it" } },
  /* scenario A: non-fixed loot stays honest */
  { set: NONE, say: "where can I find an expired respirator", want: { near: "Medical bags and crates" } },
  { set: NONE, say: "rock salt", want: { near: "No spots recorded" } },
  /* items without fixed spots: a named place, no tag lists */
  { set: NONE, say: ["I'm at the farm", "where can I find dead flowers"], want: { near: "^Try (Ruined Homestead|Ancient Fort|Village)" } },
  { set: NONE, say: "where can I find dead flowers", want: { near: "Try Village, Ruined Homestead or Ancient Fort" } },

  /* raid events */
  { set: HTR, say: "I died", want: { died: true } },
  { set: HTR, say: "I'm dead", want: { died: true } },
  { set: HTR, say: "got killed", want: { died: true } },
  { set: HTR, say: "they got me", want: { died: true } },
  { set: HTR, say: "new raid", want: { newraid: true } },
  { set: HTR, say: "just dropped in", want: { newraid: true } },
  { set: HTR, say: "starting a new run", want: { newraid: true } },
  { set: HTR, say: "I made it out", want: { extracted: true } },
  { set: HTR, say: "extracted", want: { extracted: true } },
  { set: HTR, say: "got out", want: { extracted: true } },

  /* enemies */
  { set: AT_VILLAGE, say: "where's the nearest sentinel", want: { enemy: true } },
  { set: NONE, say: "rocketeer spawns", want: { enemy: true } },
  /* loot by name on any map (6 Nov) */
  { set: { map: "dam", place: "Control Tower" }, say: "where is the nearest moss", want: { show: "Nearest moss" } },
  { set: { map: "blue-gate", place: "Village" }, say: "any apricots near me", want: { show: "Nearest apricot tree" } },
  { set: { map: "stella-montis", place: "Atrium" }, say: "where can I find apricots", want: { show: "No apricots on Stella Montis" } },
  { set: { map: "spaceport", place: "Launch Towers" }, say: "nearest rocketeer husk", want: { show: "Nearest rocketeer husk" } },
  { set: { map: "spaceport", place: "Launch Towers" }, say: "nearest rocketeer", want: { enemy: true } },
  { set: { map: "pendola-pass", place: "Old Town" }, say: "I need a med crate", want: { near: "metres" } },
  /* ARC by name on any map (6 Nov) */
  { set: { map: "dam", place: "Control Tower" }, say: "where's the nearest rocket ear", want: { near: "metres" } },
  { set: { map: "stella-montis", place: "Atrium" }, say: "any rocketeers near me", want: { show: "No Rocketeers on Stella Montis" } },
  { set: AT_VILLAGE, say: "where are the wasps", want: { show: "not tracked" } },
  { set: AT_VILLAGE, say: "bombadiers near me", want: { enemy: true } },

  /* ending the conversation */
  { set: HTR, say: "thanks", want: { stop: true } },
  { set: HTR, say: "cheers mate", want: { stop: true } },
  { set: HTR, say: "that's all", want: { stop: true } },

  /* noise: speech recognition picked up the TV */
  { set: HTR, say: "the uh behind the", want: { same: true } },
  { set: NONE, say: "pass me the remote", want: { fallback: true } },

  /* a place on another map: say which map, not "Say again?" (4 Nov) */
  { set: NONE, say: "I'm at the Hydroponic Dome Complex", want: { map: "dam", place: "Hydroponic Dome Complex" } },  /* a Dam place switches to Dam (5 Nov) */
  { set: NONE, say: "nearest exit from Victory Ridge", want: { map: "dam", exitName: "Central Swamp Lift" } },
  { set: NONE, say: "I'm in Old Town", want: { show: "Which map" } },  /* Old Town is on Buried City and Pendola Pass */
  { set: NONE, say: "near the gate control room", want: { place: "Gate Control Room" } },

  /* which map, and Dam (5 Nov) */
  { set: NONE, say: "I'm on dam", want: { map: "dam", show: "Dam Battlegrounds" } },
  { set: NONE, say: "we're playing dam battlegrounds", want: { map: "dam", show: "Dam Battlegrounds" } },
  { set: NONE, say: "I'm on spaceport", want: { map: "spaceport", show: "Spaceport" } },
  { set: { map: "pendola-pass" }, say: "nearest hatch", want: { map: "pendola-pass", show: "No hatches" } },
  { set: { map: "pendola-pass", place: "Railyard" }, say: "nearest bully", want: { map: "pendola-pass", show: "Bully" } },
  { set: { map: "buried-city" }, say: "I'm at the hospital", want: { map: "buried-city", place: "Hospital" } },
  { set: { map: "riven-tides" }, say: "I'm at the hotel", want: { map: "riven-tides", place: "Hotel Panorama Azzurro" } },
  { set: { map: "stella-montis", place: "Cafeteria" }, say: "nearest exit", want: { map: "stella-montis", exitName: "Seed Vault Airshaft" } },
  { set: { map: "spaceport" }, say: "I'm at the launch towers", want: { map: "spaceport", place: "Launch Towers" } },
  { set: NONE, say: "wires crossed step 2", want: { quest: "Wires Crossed", step: 2 } },
  { set: { map: "dam" }, say: "rocketeers", want: { map: "dam", show: "Where are you" } },  /* 25 spawns: ask first */
  { set: NONE, say: "I'm doing building a library", want: { quest: "Building a Library", step: 1 } },
  { set: NONE, say: "when everything falls", want: { quest: "When Everything Falls", step: 1 } },
  { set: NONE, say: "someone else's shoes", want: { quest: "Someone Else's Shoes", step: 1 } },
  { set: NONE, say: "celeste's teenage rebellion", want: { quest: "Celeste's Teenage Rebellion", step: 1 } },
  { set: NONE, say: "on sizing things up", want: { quest: "Sizing Things Up", step: 1 } },
  { set: NONE, say: "starting when everything falls", want: { map: "spaceport" } },
  { set: NONE, say: "show me the dam map", want: { map: "dam", show: "Dam Battlegrounds" } },  /* show a map, then ask where (5 Nov) */
  { set: NONE, say: ["show me the dam map", "the control tower"], want: { map: "dam", place: "Control Tower" } },
  { set: NONE, say: "show me the blue gate map, I'm at the village", want: { map: "blue-gate", place: "Village" } },
  { set: { map: "dam" }, say: "open the map", want: { map: "dam", show: "Dam Battlegrounds" } },
  { set: NONE, say: ["pull up spaceport", "show me buried city"], want: { map: "buried-city", show: "Buried City" } },
  { set: NONE, say: "I'm at the village", want: { place: "Village", noExit: true } },  /* location only: "What do you need?", not an exit (Tony's test, 5 Nov) */
  { set: { map: "dam" }, say: "I'm at the control tower", want: { map: "dam", place: "Control Tower", noExit: true } },
  { set: NONE, say: ["show me the blue gate map", "the village"], want: { map: "blue-gate", place: "Village", noExit: true } },
  { set: NONE, say: ["show me the dam map", "the control tower"], want: { map: "dam", place: "Control Tower", noExit: true } },
  { set: { map: "riven-tides" }, say: "I'm at the hotel", want: { map: "riven-tides", place: "Hotel Panorama Azzurro", noExit: true } },
  { set: { map: "dam" }, say: "I'm going to Blue Gate, show me locations of sentinels", want: { map: "blue-gate", show: "Sentinel spawns, marked" } },
  { set: { map: "dam" }, say: ["I'm on dam", "I'm Blue Gate, south east, find me a sentinel"], want: { map: "blue-gate", show: "Nearest Sentinel" } },
  { set: { map: "dam" }, say: "I'm on blue gate", want: { map: "blue-gate", show: "Blue Gate" } },
  { set: { map: "dam" }, say: "I'm at the farmlands", want: { map: "blue-gate", place: "Farmlands" } },
  { set: { place: "Village" }, say: "damn, nearest exit", want: { map: "blue-gate", exitName: "Cliffside Airshaft" } },
  { set: { map: "dam" }, say: "I'm at the control tower", want: { map: "dam", place: "Control Tower" } },
  { set: { map: "dam" }, say: "I'm in the swamp", want: { map: "dam", place: "the Swamp" } },
  { set: { map: "dam" }, say: "I'm at the hydroponics", want: { map: "dam", place: "Hydroponic Dome Complex" } },
  { set: { map: "dam" }, say: "I'm by the pump house", want: { map: "dam", place: "Pump House Hatch" } },
  { set: { map: "dam", place: "Control Tower" }, say: "nearest exit", want: { map: "dam", exitName: "Water Treatment Elevator" } },
  { set: { map: "dam" }, say: "nearest exit from the scrap yard", want: { map: "dam", exitName: "Water Treatment Elevator" } },
  { set: { map: "dam", place: "the Swamp" }, say: "nearest hatch", want: { map: "dam", show: "Sunroof Hatch" } },
  { set: NONE, say: "I'm doing keeping the memory", want: { quest: "Keeping the Memory", step: 1 } },
  { set: NONE, say: "eyes in the sky step 2", want: { quest: "Eyes in the Sky", step: 2 } },
  { set: NONE, say: "on a balanced harvest", want: { quest: "A Balanced Harvest", step: 1 } },
  { set: { quest: "Straight Record", step: 2 }, say: "done", want: { advance: true } },
  { set: NONE, say: "starting straight record", want: { map: "dam", show: "Victory Ridge" } },
  { set: { map: "dam", place: "Control Tower" }, say: "I'm having trouble, nearest exit", want: { map: "dam", exitName: "Water Treatment Elevator" } },
  /* crafting items by name (7 Nov) */
  { set: { map: "blue-gate", place: "Village" }, say: "where do I find wires", want: { show: "Wires: Reinforced Reception" } },
  { set: { map: "dam" }, say: "I need rubber parts", want: { show: "Rubber parts: where are you?" } },
  { set: { map: "buried-city", place: "Library" }, say: "nearest antiseptic", want: { show: "Antiseptic: med crate" } },
  { set: { map: "spaceport", place: "Launch Towers" }, say: "where can I get exodus modules", want: { show: "Exodus modules: Rocket Assembly" } },
  { set: { map: "stella-montis", place: "Lobby" }, say: "any batteries near me", want: { show: "Battery: Lobby Metro" } },
  { set: { map: "dam", place: "Control Tower" }, say: "where do I get a wasp driver", want: { show: "Wasp driver: from Wasps" } },
  { set: { map: "dam", place: "Control Tower" }, say: "rocketeer driver", want: { enemy: true } },
  { set: { map: "riven-tides", place: "Wharf" }, say: "expired respirator", want: { show: "Expired respirator: med crate" } },
  { set: { map: "dam", place: "Control Tower" }, say: "turn the radio down", want: { fallback: true } }
];
