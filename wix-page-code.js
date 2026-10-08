/* Paste into Wix HOME PAGE code (not backend code).
   Default: ONE Embed Site element, ID htmlAnimations.
   Contact section ID contactSection; wrapper section ID animationSection.
   To use separate embeds set MODE='separate' and use the IDs in SEPARATE below.
   Navbar items below are Wix buttons/text elements with those element IDs.
*/
import wixWindowFrontend from 'wix-window-frontend';
const MODE = 'single';
const CHANNEL='c2dg-animation-v1';
const SEPARATE=[
 ['hero','htmlHero'],['our-work','htmlOurWork'],['branding','htmlBranding'],
 ['design-flipbook','htmlBook'],['drone','htmlDrone'],['photography','htmlPhotography'],
 ['videography','htmlVideo'],['our-story','htmlStory'],['our-mission','htmlMission']
];
const NAV={navHome:'hero',navOurWork:'our-work',navBranding:'branding',navPrint:'design-flipbook',navDrone:'drone',navPhotography:'photography',navVideo:'videography',navOurStory:'our-story',navOurMission:'our-mission'};
$w.onReady(()=>{
 const entries=MODE==='single'?[['hero','htmlAnimations']]:SEPARATE;
 const ready=new Set(),pending=new Map();let exitBusy=false;
 function post(id,data){$w('#'+id).postMessage({channel:CHANNEL,...data});}
 function nav(section,edge='start'){
  const found=MODE==='single'?entries[0]:entries.find(x=>x[0]===section);
  if(!found)return;
  const id=found[1],payload={type:'NAVIGATE',section,edge};
  if(ready.has(id))post(id,payload);else pending.set(id,payload);
  const target=MODE==='single'?'animationSection':id;
  return $w('#'+target).scrollTo();
 }
 entries.forEach(([section,id],index)=>{
  $w('#'+id).onMessage(async event=>{
   const m=event.data;if(m?.channel!==CHANNEL)return;
   if(m.type==='READY')post(id,{type:'INIT'});
   if(m.type==='ACK'){ready.add(id);if(pending.has(id)){post(id,pending.get(id));pending.delete(id);}}
   if(m.type==='EXIT'&&!exitBusy&&(m.direction===1||m.direction===-1)){
    exitBusy=true;
    try{
     const next=index+m.direction;
     if(MODE==='separate'&&next>=0&&next<entries.length)await nav(entries[next][0],m.direction<0?'end':'start');
     else if(m.direction>0)await $w('#contactSection').scrollTo();
     else await wixWindowFrontend.scrollTo(0,0,{scrollAnimation:false});
    }catch(error){console.error('C2DG section handoff failed. Check element IDs.',error);}
    finally{setTimeout(()=>{exitBusy=false;},900);}
   }
  });
 });
 // Optional navbar items: add only the IDs you intend to use.
 for(const [id,section] of Object.entries(NAV)){
  try{$w('#'+id).onClick(()=>nav(section));}catch(error){console.info('Optional C2DG navbar item not installed: '+id);}
 }
 try{$w('#navContact').onClick(()=>$w('#contactSection').scrollTo());}catch(error){console.info('Set navContact on your Wix Let’s Elevate button to enable the contact link.');}
});
