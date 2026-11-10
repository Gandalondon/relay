// One set of app captures with real MetaForge tiles, for the site, portfolio, Play listing and onboarding (7 Nov 2026).
// Tiles come from tools/captures/tiles/<map>/<z>/<x>/<y>.webp (fetched once through Chrome; the workspace can't reach MetaForge).
// Any tile a scene needs that isn't there is listed in tools/captures/missing.txt.
// Run from the repo root: node tools/captures/capture.js   -> tools/captures/out/<scene>.png at 1125 x 2436 (375 x 812 at 3x)
const path = require('path'), fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PW || process.cwd()] }));
const HERE = __dirname, APP = 'file://' + path.resolve(HERE, '../../www/index.html');
const SCENES = require(process.env.SCENES ? require('path').resolve(process.env.SCENES) : './scenes.js');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, timezoneId: 'Europe/London' });
  const missing = new Set(), rects = {}; fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
  const only = process.argv[2];
  for (const s of SCENES) {
    if (only && s.id !== only) continue;
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log('  error', s.id, e.message));
    await p.route(/^https?:/, r => {
      const u = r.request().url(), m = u.match(/maps\/([a-z-]+)\/.+?\/(\d+\/\d+[\/_]\d+\.webp)$/)  /* Stella Montis tiles are {z}/{x}_{y} (8 Nov) */;
      const f = m && path.join(HERE, 'tiles', m[1], m[2]);
      if (f && fs.existsSync(f)) return r.fulfill({ path: f, contentType: 'image/webp' });
      if (m) missing.add(u);
      r.abort();
    });
    await p.addInitScript(() => { try { localStorage.setItem('relay-onb', '1'); localStorage.setItem('relay-onb2', '1'); localStorage.setItem('relay-line', '1'); } catch (e) {} window.__r = Math.random; Math.random = () => 0; });  // greeting: always "Let's get you home in one piece."
    await p.goto(APP); await p.waitForTimeout(1500); await p.evaluate(() => { Math.random = window.__r; });
    await p.evaluate(() => { try { window.OB_EVERY_OPEN = false; } catch (e) {} document.querySelectorAll('#sppack,#ob,.ob').forEach(el => el.hidden = true); });
    await p.evaluate(async (s) => {
      try { SHOW_METRES = false; } catch (e) {}  // marketing screens never show metres (10 Nov)
      speak = (t, cb) => { if (cb) setTimeout(cb, 0); }; listen = () => {};
      S = Object.assign({}, EMPTY); S.voiceV = 2;
      if (s.map) { if (S.map !== s.map) switchMap(s.map); }
      if (s.place) { const pl = findPlace(' ' + s.place.toLowerCase() + ' '); if (pl) { S.place = { n: pl.n, y: pl.y, x: pl.x }; S.placeAt = Date.now(); S.raidAt = Date.now(); } }
      if (s.ask) await handle(s.ask);
      if (s.listen) { micOn(true); renderListening(); }
    }, s);
    await p.waitForTimeout(2500);
    await p.evaluate((s) => {
      document.body.classList.remove('speaking');
      const w = document.getElementById('word'); if (s.word && w) w.textContent = s.word;
      document.querySelectorAll('#sppack,#heard').forEach(el => el.hidden = true);  // no test-build Heard line in marketing screens (10 Nov)
    }, s);
    if (s.click) { await p.click(s.click); await p.waitForTimeout(2500); }
    if (s.text) await p.evaluate((t) => { const w = document.querySelector('.greet,#word'); if (w) w.textContent = t; }, s.text);
    await p.evaluate(() => { document.querySelectorAll('.greet,#word,h1,h2').forEach(e => { e.innerHTML = e.innerHTML.replace(/(\w)'(\w)/g, '$1\u2019$2'); }); });  // curly apostrophes (Let's)
    rects[s.id] = await p.evaluate(() => { const m = document.querySelector('.mapwrap'); if (!m) return null; const r = m.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(HERE, 'out', s.id + '.png') });
    const fs_ = await p.evaluate(() => { const w = document.getElementById('word'); return w && !w.classList.contains('greet') && !w.hidden ? parseFloat(getComputedStyle(w).fontSize) : null; });
    if (fs_ !== null && fs_ !== 48) { console.log('  HEADLINE NOT 48 PX:', s.id, fs_); process.exitCode = 1; }  // one size on every answer screen (10 Nov)
    console.log(s.id, '|', await p.evaluate(() => (document.getElementById('word') || {}).textContent));
    await p.close();
  }
  fs.writeFileSync(path.join(HERE, 'out', 'rects.json'), JSON.stringify(rects, null, 1));
  fs.writeFileSync(path.join(HERE, 'missing.txt'), [...missing].sort().join('\n') + '\n');
  console.log('missing tiles:', missing.size);
  await b.close();
})();
