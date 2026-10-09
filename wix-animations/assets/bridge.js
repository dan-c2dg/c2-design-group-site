(() => {
 const cfg=window.C2_CONFIG,channel='c2dg-animation-v1',all=[...document.querySelectorAll('section[id]')];
 const keys={hero:'hero','our-work':'work','design-flipbook':'book',drone:'drone','our-story':'story','our-mission':'mission'};
 for(const el of all){const opt=cfg[keys[el.id]];if(opt)el.style.setProperty('--motion-height',`${Math.max(1.1,Number(opt.screens)||2)*100}vh`);}
 document.documentElement.style.setProperty('--top-inset',`${cfg.topInset}px`);
 let connected=false,parentOrigin=null,lastExit=-Infinity,startY=0,readyTimer,contactTimer,contactRequest=null,contactAttempts=0;
 const status=document.getElementById('embedStatus');
 const announce=text=>{if(status){status.textContent=text;status.hidden=!text;}};
 function sendContact(){if(connected&&contactRequest)send('CONTACT',{requestId:contactRequest});}
 window.C2Contact=()=>{
  window.C2CloseGallery?.();clearInterval(contactTimer);
  if(!inFrame){announce('Open the Wix website to contact C2 Design Group.');return;}
  contactRequest='contact-'+Date.now();contactAttempts=0;announce('');sendContact();
  contactTimer=setInterval(()=>{if(!contactRequest){clearInterval(contactTimer);return;}if(++contactAttempts>16){clearInterval(contactTimer);announce('The contact section is not connected yet. Please check the Wix setup.');contactRequest=null;return;}sendContact();},500);
 };
 const inFrame=parent!==window;
 // READY contains only public section IDs. Pin the replying parent on INIT.
 const send=(type,data={})=>{if(inFrame)parent.postMessage({channel,type,...data},parentOrigin&&parentOrigin!=='null'?parentOrigin:'*');};
 const galleries={'photography-aerials':'aerials','photography-architecture':'architecture','photography-people':'people','photography-events-products':'events'};
 function go(id,edge='start'){
  const gallery=galleries[id];const el=document.getElementById(gallery?'photography':id);if(!el)return false;
  // A previously open gallery must not keep scrolling locked after a nav click.
  window.C2CloseGallery?.();
  const y=el.getBoundingClientRect().top+scrollY+(edge==='end'?Math.max(0,el.offsetHeight-innerHeight):0);
  window.scrollTo({top:y,behavior:'instant'});
  window.dispatchEvent(new Event('scroll'));
  if(gallery){let tries=0;const open=()=>{if(window.C2OpenGallery)window.C2OpenGallery(gallery);else if(++tries<40)setTimeout(open,100);};open();}
  return true;
 }
 window.C2Navigate=id=>go(id);
 const locked=()=>!!document.querySelector('.photo-lightbox.is-open');
 const boundary=dir=>!locked()&&(dir<0?scrollY<=2:scrollY>=document.documentElement.scrollHeight-innerHeight-2);
 function exit(dir){if(!connected||performance.now()-lastExit<900)return;lastExit=performance.now();send('EXIT',{direction:dir});}
 addEventListener('message',e=>{
  if(e.source!==parent||e.data?.channel!==channel)return;
  if(parentOrigin!==null&&e.origin!==parentOrigin)return;
  if(e.data.type==='INIT'){parentOrigin=e.origin;connected=true;clearInterval(readyTimer);send('ACK');sendContact();}
  if(connected&&e.data.type==='CONTACT_RESULT'&&e.data.requestId===contactRequest){clearInterval(contactTimer);contactRequest=null;announce(e.data.ok?'':'The contact section is not connected yet. Please check the Wix setup.');}
  if(connected&&e.data.type==='NAVIGATE')send('NAVIGATED',{requestId:e.data.requestId,section:e.data.section,ok:go(e.data.section,e.data.edge)});
 });
 addEventListener('wheel',e=>{
  if(e.ctrlKey||locked()||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
  const dir=Math.sign(e.deltaY);
  if(boundary(dir)){if(connected){e.preventDefault();exit(dir);}return;}
  // One scroll owner: consume the wheel inside this document; do not chain into Wix.
  e.preventDefault();const factor=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
  window.scrollBy({top:e.deltaY*factor,behavior:'instant'});
 },{passive:false});
 addEventListener('touchstart',e=>{startY=e.touches[0]?.clientY||0;},{passive:true});
 addEventListener('touchmove',e=>{
  if(e.touches.length!==1||locked())return;
  const y=e.touches[0].clientY,d=startY-y;startY=y;
  if(Math.abs(d)>8&&boundary(Math.sign(d))&&connected){e.preventDefault();exit(Math.sign(d));}
 },{passive:false});
 addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)||locked())return;
  const d=['ArrowDown','PageDown',' '].includes(e.key)?(e.shiftKey&&e.key===' '?-1:1):['ArrowUp','PageUp'].includes(e.key)?-1:0;
  if(d&&boundary(d)&&connected){e.preventDefault();exit(d);}
 });
 readyTimer=setInterval(()=>{if(inFrame&&!connected)send('READY',{sections:all.map(e=>e.id)});},700);
 send('READY',{sections:all.map(e=>e.id)});
 if(!inFrame)clearInterval(readyTimer);
 if(location.hash)go(location.hash.slice(1));
})();
