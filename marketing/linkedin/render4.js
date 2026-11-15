const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:4800,height:2508},deviceScaleFactor:1});
await p.goto('file://'+__dirname+'/post4.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
await (await p.$('#fg')).screenshot({path:__dirname+'/big.png'});await b.close();})();
