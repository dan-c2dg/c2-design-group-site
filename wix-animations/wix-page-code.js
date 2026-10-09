// Frontend HOME PAGE code. Required HTML embed ID: htmlAnimations.
// Required native Wix contact section ID: contactSection.
import wixWindowFrontend from 'wix-window-frontend';
const CHANNEL='c2dg-animation-v1';
$w.onReady(()=>{
 const embed=$w('#htmlAnimations');let busy=false;
 const completed=new Set();
 const post=data=>embed.postMessage({channel:CHANNEL,...data});
 embed.onMessage(async event=>{
  const m=event.data;if(m?.channel!==CHANNEL)return;
  if(m.type==='READY'){post({type:'INIT'});return;}
  if(m.type==='CONTACT'){
   if(completed.has(m.requestId)){post({type:'CONTACT_RESULT',requestId:m.requestId,ok:true});return;}
   if(busy)return;
   busy=true;
   try{
    await $w('#contactSection').scrollTo();
    completed.add(m.requestId);
    post({type:'CONTACT_RESULT',requestId:m.requestId,ok:true});
   }catch(error){
    console.error('C2DG: set the native Wix contact section ID to contactSection.',error);
    post({type:'CONTACT_RESULT',requestId:m.requestId,ok:false});
   }finally{busy=false;}
   return;
  }
  if(m.type==='EXIT'&&!busy&&(m.direction===1||m.direction===-1)){
   busy=true;
   try{if(m.direction>0)await $w('#contactSection').scrollTo();else await wixWindowFrontend.scrollTo(0,0,{scrollAnimation:false});}
   catch(error){console.error('C2DG section boundary handoff failed.',error);}
   finally{setTimeout(()=>{busy=false;},900);}
  }
 });
});
