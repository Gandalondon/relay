/* Phrases that look like one intent but are another (6 Nov): new wording must not swallow these. SET=adversarial node tests/run.js */
const HTR = { quest: "Home to Roost", step: 3 }, NONE = {};
module.exports = [
  { set: NONE, say: "let's go home to roost", want: { quest: "Home to Roost" } },
  { set: NONE, say: "start home to roost", want: { quest: "Home to Roost" } },
  { set: HTR, say: "I'm out of ammo", want: { show: "Ammo crate" } },
  { set: HTR, say: "ta", want: { stop: true } },
  { set: HTR, say: "lost all my shield, where's the exit", want: { exit: true } },
  { set: HTR, say: "I'm upstairs now", want: { advance: true } },
  { set: HTR, say: "I read the instructions wrong, what's this step", want: { same: true } },
  { set: HTR, say: "tick that off", want: { advance: true } },
  { set: HTR, say: "where do I find a pop trigger", want: { show: "Pop trigger: from Pops" } }  /* an ARC part, not the ARC: now a crafting item (7 Nov) */
];
