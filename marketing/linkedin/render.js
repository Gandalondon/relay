const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:627},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/post.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await (await p.$('#fg')).screenshot({path:__dirname+'/relay-linkedin-voices.png'});await b.close();})();
