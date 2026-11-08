/* Follow-ups to the last answer (8 Nov): repeats, "next one", "anything closer", "what's that near", "I'm here",
   and a new ask after a follow-up. Run: SET=followups node tests/run.js */
const V = { map: "blue-gate", place: "Village" }, LIB = { map: "buried-city", place: "Library" }, HOS = { map: "buried-city", place: "Hospital" };
module.exports = [
  { set: V, say: ["nearest rocketeer", "how far is it"], want: { near: "rocketeer: west" } },
  { set: V, say: ["nearest rocketeer", "which way"], want: { near: "rocketeer: west" } },
  { set: V, say: ["nearest rocketeer", "where is it again"], want: { near: "rocketeer: west" } },
  { set: V, say: ["nearest rocketeer", "I can't see it"], want: { near: "rocketeer: west" } },
  { set: V, say: ["nearest rocketeer", "what about a bastion"], want: { near: "bastion" } },
  { set: V, say: ["nearest rocketeer", "next one"], want: { near: "next nearest rocketeer" } },
  { set: V, say: ["nearest rocketeer", "next one", "anything closer"], want: { near: "back to the closest.*west" } },
  { set: V, say: ["nearest rocketeer", "anything closer"], want: { near: "closest one I know" } },
  { set: V, say: ["nearest rocketeer", "what's that near"], want: { near: "it's by " } },
  { set: V, say: ["nearest rocketeer", "I'm here"], want: { near: "you're there" } },
  { set: V, say: ["nearest rocketeer", "next one", "nearest bastion"], want: { near: "^nearest bastion" } },
  { set: LIB, say: ["find me some moss", "next one"], want: { near: "next nearest moss" } },
  { set: HOS, say: ["nearest exit", "next one"], want: { near: "next best|then go for|try " } },
  { set: HOS, say: ["nearest exit", "another one"], want: { near: "next best|then go for|try " } },
];
