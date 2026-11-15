const path=require('path');const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:812},deviceScaleFactor:3,timezoneId:'Europe/London'});
const p=await ctx.newPage(); p.on('pageerror',e=>console.log('err',e.message));
await p.route(/^https?:/,r=>r.abort());
await p.goto('file://'+path.resolve('www/index.html')); await p.waitForTimeout(1500);
const n=await p.$$eval('#ob .obs',a=>a.length); console.log('screens',n);
for(let i=0;i<n-1;i++){await p.click('#obbtns button');await p.waitForTimeout(300);}
await p.waitForTimeout(500); await p.screenshot({path:''+__dirname+'/ob-voice.png'});
console.log(await p.$eval('#ob',e=>e.innerText.slice(0,400)));
await b.close();})();
