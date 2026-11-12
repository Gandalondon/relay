/* Relay site: shared behaviour for every page. */
const still = matchMedia("(prefers-reduced-motion: reduce)");
/* every page opens at the top (no carried-over scroll position), unless the link points at a section */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
/* scrollIntoView also reaches a viewer that wraps the page, where scrollTo alone does not */
if (!location.hash) { window.scrollTo(0, 0); try { document.documentElement.scrollIntoView({ block: "start" }); } catch (e) {} }
/* ============ name: change it here and in each page's <title> ============ */
const APP_NAME = "Relay";
/* the wordmark: ARC light cream, RELAY bold amber. Elsewhere the name is plain text */
document.querySelectorAll("[data-name]").forEach(el => { if (el.closest(".logo")) el.textContent = "Relay"; else el.textContent = APP_NAME; });

/* ============ logo: the three lines draw in once on load (about 600ms), then stay still ============
   Each line draws from its left end, a beat after the one above, then the wordmark wipes in left to right. Skipped with reduced motion. */
const logo = document.getElementById("logo");
if (logo) logo.setAttribute("aria-label", APP_NAME + " home");
/* only on the home page, and only once per visit: going between pages never replays it, a refresh does */
function logoIn() {
  if (!logo || still.matches || !logo.animate || !document.querySelector(".hero")) return;
  let seen = false, reload = false;
  try { const nav = performance.getEntriesByType("navigation")[0]; reload = !!nav && nav.type === "reload"; } catch (e) {}
  try { seen = sessionStorage.getItem("logo-in") === "1"; sessionStorage.setItem("logo-in", "1"); } catch (e) {}
  if (seen && !reload) return;
  const ease = "cubic-bezier(.3,0,.2,1)";
  logo.querySelectorAll("path").forEach((p, i) => {
    const L = Math.ceil(p.getTotalLength());
    p.style.strokeDasharray = L;
    p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 440, delay: i * 70, easing: ease, fill: "backwards" });
  });
  const n = logo.querySelector(".name");
  /* the wordmark wipes in left to right, letter by letter, once the lines have drawn */
  if (n) n.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 360, delay: 520, easing: "cubic-bezier(.4,0,.2,1)", fill: "backwards" });
}
window.addEventListener("scroll", () => drift(), { passive: true });

/* ============ contours: one faint terrain behind the whole page, fixed while you scroll ============
   Decorative, not a real map. It drifts slowly with the scroll (a fifth of the speed) and stays still with reduced motion. */
const topo = document.createElement("canvas"); topo.className = "topo"; topo.setAttribute("aria-hidden", "true");
document.body.insertBefore(topo, document.body.firstChild);
let topoQueued = false;
function drawTopo() {
  topoQueued = false;
  const W = innerWidth, H = innerHeight, oy = still.matches ? 0 : window.scrollY * .2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (topo.width !== Math.round(W * dpr) || topo.height !== Math.round(H * dpr)) { topo.width = Math.round(W * dpr); topo.height = Math.round(H * dpr); }
  const g = topo.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  const s = 16, cols = Math.ceil(W / s) + 1, rows = Math.ceil(H / s) + 1;
  const f = (x, y) => { y += oy; return Math.sin(x * .006 + 1.3) * Math.cos(y * .008) + .6 * Math.sin((x + y) * .004 + 2) + .35 * Math.cos(x * .013 - y * .005); };
  const v = []; for (let j = 0; j < rows; j++) { v[j] = []; for (let i = 0; i < cols; i++) v[j][i] = f(i * s, j * s); }
  g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--contour").trim() || "#24262A"; g.lineWidth = 1;
  for (let lv = -1.6; lv <= 1.6; lv += .2) {
    g.beginPath();
    for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = v[j][i], b = v[j][i + 1], cc = v[j + 1][i + 1], d = v[j + 1][i];
      const pts = [];
      const e = (p, q, x1, y1, x2, y2) => { if ((p - lv) * (q - lv) < 0) { const t = (lv - p) / (q - p); pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); } };
      const x = i * s, y = j * s;
      e(a, b, x, y, x + s, y); e(b, cc, x + s, y, x + s, y + s); e(cc, d, x + s, y + s, x, y + s); e(d, a, x, y + s, x, y);
      if (pts.length >= 2) { g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); }
      if (pts.length === 4) { g.moveTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]); }
    }
    g.stroke();
  }
}
function drift() { if (!topoQueued) { topoQueued = true; requestAnimationFrame(drawTopo); } }
function drawAll() { drift(); }
window.addEventListener("resize", drift);

/* ============ fade-ins, as on Sniff ============ */
function reveal() {
  const site = document.querySelector(".site"); if (!site || !("IntersectionObserver" in window)) return;
  const vh = innerHeight || 800;
  site.querySelectorAll(".reveal").forEach(el => { if (el.getBoundingClientRect().top < vh) el.classList.add("in", "now"); });
  site.classList.add("rv");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
  site.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
}

/* ============ the hero phone greets you like the app does ============ */
(function () {
  const g = document.getElementById("greet"); if (!g) return;
  const h = new Date().getHours(), part = h >= 5 && h < 12 ? "Morning" : h >= 12 && h < 18 ? "Afternoon" : "Evening";
  const L = ["Let's get you home in one piece.", "Need a hand topside?", "Try not to get lost out there.", "What's the plan?", "Got yourself into trouble again?", "Let's make this a quick one."];
  g.textContent = part + ", Raider.\n" + L[Math.floor(Math.random() * L.length)];
})();

/* mark the current page in the footer */
document.querySelectorAll(".ftop nav a").forEach(a => { if (location.pathname.replace(/\/$/, "").endsWith("/" + a.getAttribute("href").replace(/^\.\//, ""))) a.setAttribute("aria-current", "page"); });

reveal(); logoIn(); drawAll();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawAll);
