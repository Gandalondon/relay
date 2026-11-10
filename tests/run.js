/* Runs the understanding test set against the app's own logic in a headless browser.
   node tests/run.js [path to www/index.html]   (needs Playwright) */
const path = require("path");
const { chromium } = require("playwright");
const CASES = require(process.env.SET ? "./" + process.env.SET + ".js" : "./phrases.js");
const page_ = process.argv[2] || path.join(__dirname, "../www/index.html");

(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {}); const p = await b.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto("file://" + page_); await p.waitForTimeout(300);
  let pass = 0; const fails = [];
  for (const c of CASES) {
    const r = await p.evaluate(({ c }) => {
      S = Object.assign({}, EMPTY); S.voiceV = 2;
      if (c.set.map) S.map = c.set.map; syncMap();
      if (c.set.quest) { S.quest = c.set.quest; S.step = (c.set.step || 1) - 1; const q = QUESTS.find(q => q.n === S.quest); S.lastStep = { quest: q.n, i: S.step }; }
      if (c.set.place) { const pl = PLACES.find(p => p.n === c.set.place); S.place = { n: pl.n, y: pl.y, x: pl.x }; S.placeAt = Date.now(); S.raidAt = Date.now(); }
      const before = { quest: S.quest, step: S.step };
      const turns = Array.isArray(c.say) ? c.say : [c.say]; let a;
      for (const say of turns) { a = S.pending ? resolvePending(say) : null; if (!a) a = answer(say); remember(say, a); }  /* as the app does, so follow-ups see the last answer (8 Nov) */
      return { before, after: { quest: S.quest, step: S.step, place: S.place && S.place.n, map: MAP.id }, a: { show: a.show, say: a.say, ctx: a.ctx || "", intent: a.intent || "" } };
    }, { c });
    const w = c.want, A = r.a, txt = (A.show + " " + A.say).toLowerCase();
    const say_ = Array.isArray(c.say) ? c.say.join(" / ") : c.say;
    const isFallback = !!A.fallback || /didn't catch|say (that )?again/i.test(A.show);
    let ok;
    if (w.fallback) ok = isFallback;
    else if (w.quest) ok = r.after.quest === w.quest && (!w.step || r.after.step === w.step - 1) && !isFallback;
    else if (w.advance) ok = r.after.quest === r.before.quest && r.after.step === r.before.step + 1;
    else if (w.same) ok = r.after.quest === r.before.quest && r.after.step === r.before.step && !/airshaft|way out/i.test(A.show);
    else if (w.exit) ok = /airshaft|way out|where are you/i.test(txt) && !/hatch/i.test(A.show.split(".")[0]) ;
    else if (w.hatch) ok = /hatch/i.test(A.show);
    else if (w.place) ok = r.after.place === w.place;
    else if (w.died) ok = /unlucky/i.test(A.show);
    else if (w.newraid) ok = /new raid/i.test(A.show);
    else if (w.extracted) ok = /raid cleared/i.test(A.show);
    else if (w.enemy) ok = /spawn|nearest/i.test(txt) && !isFallback;
    else if (w.stop) ok = /standing by/i.test(A.show);
    else if (w.exitName) ok = A.say.includes(w.exitName);
    else if (w.othermap) ok = A.show.includes(w.othermap === "any" ? "only, for now" : w.othermap);
    else if (w.show && !w.map) ok = (A.show + " " + A.say).includes(w.show);  /* 10 Nov: the headline is now where, the thing is in the small line and the voice */
    else if (w.near) ok = new RegExp(w.near, "i").test(A.say) && !/shops|homes, shops/i.test(A.say);
    if (ok && w.place && w.exitName) ok = r.after.place === w.place;
    if (w.map) ok = r.after.map === w.map && (!w.place || r.after.place === w.place) && (!w.exitName || A.say.includes(w.exitName)) && (!w.show || (A.show + " " + A.say).includes(w.show)) && !isFallback;  /* which map it ended up on (5 Nov) */
    if (ok && /can you see/i.test(A.say)) ok = false;
    if (ok && w.noExit) ok = !/way out|airshaft|elevator|\blift\b|station|transceiver|hatch/i.test(A.show + " " + A.say);  /* a location on its own isn't asking for the way out (5 Nov) */  /* never ask about something you'd need to see */
    if (ok) pass++; else fails.push(`  ✗ "${say_}"  want ${JSON.stringify(w)}\n      got: ${A.show} | ${A.say.slice(0, 90)}`);
  }
  console.log(`${pass}/${CASES.length} understood`);
  if (fails.length) console.log(fails.join("\n"));
  await b.close();
  process.exit(fails.length && process.env.STRICT ? 1 : 0);
})();
