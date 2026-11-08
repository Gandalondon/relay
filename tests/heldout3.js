/* Third held-out set, written 8 Nov BEFORE any fixes, from Tony's raid feedback: places said on their own or clipped
   ("hospital", "Buried City hospital", "hospital, Buried City"), the map and place in either order, filler words,
   a place on another map, and a place plus an ask in one breath. Run: SET=heldout3 node tests/run.js.
   Scored cold first (see NEXT.md), then never tuned against: it measures whether the fixes generalise. */
const BC = { map: "buried-city" }, SP = { map: "spaceport" }, DAM = { map: "dam" }, RT = { map: "riven-tides" }, PP = { map: "pendola-pass" }, BG = { map: "blue-gate" }, NONE = {};
module.exports = [
  /* a place on its own, on the right map */
  { set: BC, say: "hospital", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: BC, say: "the galleria", want: { map: "buried-city", place: "Galleria", noExit: true } },
  { set: BC, say: "at the library now", want: { map: "buried-city", place: "Library", noExit: true } },
  { set: SP, say: "launch towers", want: { map: "spaceport", place: "Launch Towers", noExit: true } },
  { set: SP, say: "east hangar", want: { map: "spaceport", place: "East Hangar", noExit: true } },
  { set: RT, say: "stacking yard", want: { map: "riven-tides", place: "Stacking Yard", noExit: true } },
  { set: PP, say: "railyard", want: { map: "pendola-pass", place: "Railyard", noExit: true } },
  { set: DAM, say: "just outside the pale apartments", want: { map: "dam", place: "Pale Apartments", noExit: true } },
  /* map and place together, either order, clipped */
  { set: NONE, say: "Buried City hospital", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: NONE, say: "hospital, Buried City", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: NONE, say: "spaceport, by the launch towers", want: { map: "spaceport", place: "Launch Towers", noExit: true } },
  { set: NONE, say: "on dam, scrap yard", want: { map: "dam", place: "Scrap Yard", noExit: true } },
  { set: NONE, say: "dam battlegrounds, near the control tower", want: { map: "dam", place: "Control Tower", noExit: true } },
  { set: NONE, say: "pendola pass old town", want: { map: "pendola-pass", place: "Old Town", noExit: true } },
  { set: NONE, say: "stella montis, cafeteria", want: { map: "stella-montis", place: "Cafeteria", noExit: true } },
  { set: NONE, say: "Spaceport. Departure building.", want: { map: "spaceport", place: "Departure Building", noExit: true } },
  { set: NONE, say: "dam map, I'm at the floodgates", want: { map: "dam", place: "Floodgates", noExit: true } },
  { set: NONE, say: "uh, buried city, um, hospital", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: NONE, say: "right, I'm by the red tower in buried city", want: { map: "buried-city", place: "Red Tower", noExit: true } },
  { set: NONE, say: "blue gate, village", want: { map: "blue-gate", place: "Village", noExit: true } },
  /* a place that is on another map than the one you're on */
  { set: BG, say: "hospital", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: BG, say: "buried city hospital", want: { map: "buried-city", place: "Hospital", noExit: true } },
  { set: BC, say: "blue gate village", want: { map: "blue-gate", place: "Village", noExit: true } },
  /* a place and an ask in one breath */
  { set: NONE, say: "buried city hospital, nearest bastion", want: { map: "buried-city", place: "Hospital" } },
  { set: NONE, say: "hospital buried city where's the nearest exit", want: { map: "buried-city", place: "Hospital" } },
  { set: RT, say: "beach bar, nearest exit", want: { map: "riven-tides", place: "Beach Bar" } },
];
