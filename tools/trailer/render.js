// Draws every trailer frame at full size: node tools/trailer/render.js  -> tools/trailer/frames/<format>-<scene>.png
const path=require('path'),fs=require('fs');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd()]}));
const SC=['home','load','ask','answer','pin','w1','w2','w3','end'], FMT={h:[1920,1080],v:[1080,1920]};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});fs.mkdirSync(path.join(__dirname,'frames'),{recursive:true});
for(const [f,[w,h]] of Object.entries(FMT)){const p=await b.newPage({viewport:{width:w,height:h}});
 for(const s of SC){await p.goto('file://'+path.join(__dirname,'frame.html')+'?f='+f+'&s='+s);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
  await p.screenshot({path:path.join(__dirname,'frames',f+'-'+s+'.png')});}
 await p.close();}
await b.close();console.log('frames done');})();
