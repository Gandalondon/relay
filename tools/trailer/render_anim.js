// Films anim.html frame by frame (30 fps, JPEG q92): node tools/trailer/render_anim.js -> frames/<f>-anim-<scene>/00001.jpg ...
const path=require('path'),fs=require('fs'),http=require('http');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd()]}));
const ROOT=path.resolve(__dirname,'..','..');
const PAGE=process.env.PAGE||'anim', SCENES=(process.env.SCENES||'home,talk').split(','), ALPHA=(process.env.ALPHA||'').split(',');  /* ALPHA scenes: PNG on a clear background */
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.json')?'application/json':f.endsWith('.png')?'image/png':'font/woff2'});r.end(d);});}).listen(0);
(async()=>{const port=srv.address().port;const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
for(const [f,w,h] of [['h',1920,1080],['v',1080,1920]].filter(x=>(process.env.FMT||'h,v').split(',').includes(x[0]))){  /* FMT=h: 16:9 only */const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:+(process.env.DSF||1)});  /* DSF=2: 4K frames for YouTube (10 Nov) */
 for(const al of [0,1]){ if(al&&!SCENES.some(x=>ALPHA.includes(x)))continue;
 await p.goto(`http://localhost:${port}/tools/trailer/${PAGE}.html?f=${f}`+(al?'&alpha=1':''));await p.waitForFunction(()=>document.body.dataset.ready);await p.evaluate(()=>document.fonts.ready);
 const TL=await p.evaluate(()=>window.TL); fs.writeFileSync(path.join(__dirname,'frames',PAGE+'-timeline.json'),JSON.stringify(TL));
 for(const sc of SCENES.filter(x=>ALPHA.includes(x)==!!al)){const dir=path.join(__dirname,'frames',f+'-'+PAGE+'-'+sc);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
  const n=Math.round(TL[sc]*30);
  for(let i=0;i<n;i++){await p.evaluate(([s,t])=>setT(s,t),[sc,i/30]);await p.screenshot(al?{path:path.join(dir,String(i+1).padStart(5,'0')+'.png'),omitBackground:true}:{path:path.join(dir,String(i+1).padStart(5,'0')+'.jpg'),type:'jpeg',quality:+(process.env.Q||92)});}
 }}
 await p.close();}
await b.close();srv.close();console.log('anim frames done');})();
