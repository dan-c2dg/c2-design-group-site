/* Scroll inside the embed; hand off only at its boundaries. */
(() => {
 const cfg=window.C2_CONFIG, all=[...document.querySelectorAll('section[id]')];
 const keys={hero:'hero','our-work':'work','design-flipbook':'book',drone:'drone','our-story':'story','our-mission':'mission'};
 for(const el of all){const opt=cfg[keys[el.id]];if(opt)el.style.setProperty('--motion-height',`${Math.max(1.1,Number(opt.screens)||2)*100}vh`);}
 document.documentElement.style.setProperty('--top-inset',`${cfg.topInset}px`);
 let connected=false,lastExit=0,startY=0;
 const inFrame=parent!==window;
 const origin=cfg.parentOrigins.find(o=>document.referrer.startsWith(o+'/'))||cfg.parentOrigins[0];
 const send=(type,data={})=>{if(inFrame&&origin)parent.postMessage({channel:'c2dg-animation-v1',type,...data},origin);};
 const active=()=>all.find(el=>{const r=el.getBoundingClientRect();return r.top<=2&&r.bottom>2;})||all[0];
 function go(id,edge='start'){
  const el=document.getElementById(id);if(!el)return;
  const y=el.getBoundingClientRect().top+scrollY+(edge==='end'?Math.max(0,el.offsetHeight-innerHeight):0);
  window.scrollTo({top:y,behavior:'instant'});
 }
 function boundary(dir){
  if(document.querySelector('.photo-lightbox.is-open'))return false;
  const max=document.documentElement.scrollHeight-innerHeight;
  return dir<0?scrollY<=2:scrollY>=max-2;
 }
 function exit(dir){
  if(!connected)return;
  const now=performance.now();if(now-lastExit<800)return;lastExit=now;
  send('EXIT',{direction:dir});
 }
 addEventListener('message',e=>{
  if(e.source!==parent||!cfg.parentOrigins.includes(e.origin)||e.data?.channel!=='c2dg-animation-v1')return;
  if(e.data.type==='INIT'){connected=true;clearInterval(readyTimer);send('ACK');}
  if(e.data.type==='NAVIGATE')go(e.data.section,e.data.edge);
 });
 addEventListener('wheel',e=>{
  if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
  if(boundary(Math.sign(e.deltaY))&&connected){e.preventDefault();exit(Math.sign(e.deltaY));}
 },{passive:false});
 addEventListener('touchstart',e=>{startY=e.touches[0]?.clientY||0;},{passive:true});
 addEventListener('touchmove',e=>{if(e.touches.length!==1)return;const d=startY-e.touches[0].clientY;if(Math.abs(d)>25&&boundary(Math.sign(d))&&connected){e.preventDefault();exit(Math.sign(d));startY=e.touches[0].clientY;}},{passive:false});
 addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||document.querySelector('.photo-lightbox.is-open'))return;
  const d=['ArrowDown','PageDown',' '].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
  if(d&&boundary(d)&&connected){e.preventDefault();exit(d);}
 });
 document.getElementById('embedNext').onclick=()=>{const i=all.indexOf(active());if(i<all.length-1)go(all[i+1].id);else exit(1);};
 document.getElementById('embedPrevious').onclick=()=>{const i=all.indexOf(active());if(i>0)go(all[i-1].id);else if(scrollY>2)go(all[0].id);else exit(-1);};
 const readyTimer=setInterval(()=>{if(inFrame&&!connected)send('READY',{sections:all.map(e=>e.id)});},700);
 send('READY',{sections:all.map(e=>e.id)});
 if(!inFrame){clearInterval(readyTimer);document.getElementById('embedNext').title='Open this page in Wix to continue to the Wix contact form';}
 if(location.hash)go(location.hash.slice(1));
})();
