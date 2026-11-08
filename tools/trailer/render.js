// Draws every trailer frame at full size: node tools/trailer/render.js  -> tools/trailer/frames/<f>-<scene>[-n].png
// Word-by-word scenes get one frame per word shown; the lockup gets the mark drawing in over 12 frames.
const path=require('path'),fs=require('fs');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd()]}));
const T=require('./audio/timing.json');
const SHOTS=[['home'],['load'],['pin'],['w1'],['w2'],['w3']];
for(let n=0;n<=T.ben.words.length;n++)SHOTS.push(['ask','n='+n,'-'+n]);
for(let n=0;n<=T.maya.words.length;n++)SHOTS.push(['answer','n='+n,'-'+n]);
for(let k=0;k<=12;k++)SHOTS.push(['end','p='+(k/12).toFixed(3),'-'+k]);
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});const out=path.join(__dirname,'frames');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const [f,w,h] of [['h',1920,1080],['v',1080,1920]]){const p=await b.newPage({viewport:{width:w,height:h}});
 for(const [s,qs,suf] of SHOTS){await p.goto('file://'+path.join(__dirname,'frame.html')+'?f='+f+'&s='+s+(qs?'&'+qs:''));await p.waitForFunction(()=>document.body.dataset.ready);await p.waitForTimeout(60);
  await p.screenshot({path:path.join(out,f+'-'+s+(suf||'')+'.png')});}
 await p.close();}
await b.close();console.log('frames done');})();
