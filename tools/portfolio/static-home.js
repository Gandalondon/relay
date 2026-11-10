// Static homepage for the portfolio: flat rows, no animation, real app screens in the phones.
// Run from the repo root: (cd site && python3 -m http.server 8766 &) ; node tools/portfolio/static-home.js 2
// Writes marketing/portfolio/relay_home.png (3456 wide at 2x). Screens come from marketing/portfolio/relay-*.png
const {chromium}=require(require.resolve("playwright",{paths:[process.env.PW||"/home/claude/relay/tests"]}));
const S=require("path").resolve(__dirname,"../../marketing/portfolio")+"/";
const scale=+process.argv[2]||2;
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const p=await b.newPage({viewport:{width:1728,height:1117},deviceScaleFactor:scale,reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto("http://localhost:8766/beta/index.html");await p.waitForTimeout(1200);
const imgs={};  // the homepage has the real screens since 7 Nov
await p.evaluate((imgs)=>{
 const css=`
 .hdr{position:absolute!important}
 .park,.flyer,.lander{display:none!important}
 .reveal{opacity:1!important;transform:none!important}
 .story .wrap{display:block!important}
 .step{min-height:0!important;display:grid!important;grid-template-columns:minmax(0,600px) 1fr;gap:64px;align-items:center;padding-block:120px}
 .step .txt{grid-column:1}
 .mphone{display:flex!important;justify-content:center;margin:0!important;grid-column:2}
 .mphone .phone{--pw:320px}
 .screen.shot{padding:0!important;background:#1C1E22}
 .screen.shot img{display:block;width:100%;height:100%;object-fit:cover}
 .fphone{transform:none!important}
 .finale .wrap{min-height:0!important;padding-block:120px 160px}
 .fin{font-size:160px!important}
 .heyhero .word{font-size:280px!important}
 .heyhero{padding-bottom:40px}
 `;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 document.querySelectorAll('[data-greet]').forEach(g=>g.textContent='Evening,\nRaider.');
},imgs);
await p.evaluate(async()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;})));});  // 10 Nov: lazy images were blank in the full-page shot
await p.waitForTimeout(1500);
await p.screenshot({path:S+"relay_home.png",fullPage:true});
console.log(await p.evaluate(()=>document.documentElement.scrollHeight),errs);await b.close();})();
