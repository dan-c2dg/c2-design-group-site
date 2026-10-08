import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const CFG=window.C2_CONFIG;
function motionProgress(el,key){if(!el)return 0;const opt=CFG[key]||{},travel=Math.max(1,el.offsetHeight-innerHeight);const raw=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/travel));return Math.max(0,Math.min(1,(raw-(opt.start||0))/Math.max(.001,(opt.end??1)-(opt.start||0))));}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function updateWork(){const el=document.querySelector('#our-work');if(!el)return;const p=motionProgress(el,'work'),copy=el.querySelector('.work-intro-inner');copy.style.transform=`translateY(${-p*35}px)`;copy.style.opacity=String(1-p*.55)}
addEventListener('scroll',updateWork,{passive:true});updateWork();
if(document.querySelector('#hero')){
const C2_MODEL_URL = './models/C2Icon.glb';

const canvas = document.querySelector('#webgl');
const loading = document.querySelector('#loading');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25,innerWidth/innerHeight,.1000,1000);
camera.position.set(20,5,20);
camera.lookAt(0,3,0);
scene.add(new THREE.HemisphereLight(0xffffff,0x202530,10));
const key = new THREE.DirectionalLight(0xffffff,4); key.position.set(5,1,-5); scene.add(key);
const fill = new THREE.DirectionalLight(0x6688ff,3.2); fill.position.set(5,30,-4); scene.add(fill);

let heroModel, heroMixer, heroClip;
new GLTFLoader().load(C2_MODEL_URL,(gltf)=>{
  heroModel=gltf.scene;
  heroModel.scale.setScalar(1.5);
	heroModel.rotation.set(0, 0, 0);
  scene.add(heroModel);
  if(gltf.animations.length){
    heroClip=gltf.animations[0];
    heroMixer=new THREE.AnimationMixer(heroModel);
    heroMixer.clipAction(heroClip).play();
  }
  loading.style.display='none';
  updateHero();
},undefined,(e)=>{console.error(e);loading.textContent='C2 model failed to load';});

function heroProgress(){return motionProgress(document.querySelector('#hero'),'hero');}
function updateHero(){
  const p=heroProgress();
  if(heroMixer&&heroClip) heroMixer.setTime(heroClip.duration*p);
  if(heroModel){
    heroModel.rotation.y = p*Math.PI*1.8;
    heroModel.position.y = Math.sin(p*Math.PI)*.28;
  }
  
}
addEventListener('scroll',updateHero,{passive:true});
addEventListener('resize',()=>{
  renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
});
function renderHero(){
  renderer.render(scene,camera);
  requestAnimationFrame(renderHero);
}
renderHero();



}
if(document.querySelector('#design-flipbook')){
const flipSection=document.querySelector('#design-flipbook');
const flipProgress=document.querySelector('#flipProgress');
const flipPageLabel=document.querySelector('#flipPageLabel');
const flipStack=document.querySelector('#flipbook-stack');
const digitalDevice=document.querySelector('#digital-device');
const digitalScreen=document.querySelector('#digital-screen-image');
const digitalCaption=document.querySelector('#digitalCaption');
// ONE persistent webpage image. Replace this with a tall screenshot (about 2x the visible screen height) for the scrolling-page effect.
const digitalScrollImage='images/AAA-website.png';
function flipSectionProgress(){return motionProgress(flipSection,'book');}
function updateFlipbook(){
  if(!flipStack)return;
  const p=flipSectionProgress(), pages=[...flipStack.querySelectorAll('.flip-paper')], printEnd=CFG.book.printEnd;
  const printP=THREE.MathUtils.clamp(p/printEnd,0,1);
  const maxTurns=Math.max(0,pages.length-1),turnPosition=printP*maxTurns,current=Math.min(Math.floor(turnPosition),pages.length-1),local=turnPosition-current;
  pages.forEach((page,i)=>{if(i<current){page.style.transform='rotateY(-180deg)';page.style.opacity='0';page.style.zIndex=1+i}else if(i===current){page.style.transform=`rotateY(${-180*local}deg)`;page.style.opacity='1';page.style.zIndex=pages.length+10}else{page.style.transform='rotateY(0deg)';page.style.opacity='1';page.style.zIndex=pages.length-i+5}});
  /* Laptop entrance and webpage scroll are intentionally separate. The laptop settles first; only then does the webpage begin scrolling inside its screen. */
  const digitalStart=CFG.book.laptopStart, digitalEnd=CFG.book.laptopEnd;
  const digitalP=THREE.MathUtils.clamp((p-digitalStart)/(digitalEnd-digitalStart),0,1);
  const eased=digitalP*digitalP*(3-2*digitalP);
  const bookFadeStart=CFG.book.fadeStart, bookFadeEnd=CFG.book.fadeEnd;
  const bookFade=1-THREE.MathUtils.clamp((p-bookFadeStart)/(bookFadeEnd-bookFadeStart),0,1);
  if(flipStack){flipStack.style.opacity=bookFade.toFixed(3)}
  if(digitalDevice){digitalDevice.style.opacity=eased.toFixed(3);digitalDevice.style.transform=`translateY(-46%) translateX(${28-28*eased}%) scale(${.92+.08*eased})`}
  if(digitalCaption){digitalCaption.style.opacity=eased.toFixed(3);digitalCaption.style.transform=`translateY(${12-12*eased}px)`}

  /* Pause while the laptop reaches its final position. Then scroll the one persistent webpage image through the masked screen. */
  const screenScrollStart=CFG.book.screenStart, screenScrollEnd=CFG.book.screenEnd;
  const screenP=THREE.MathUtils.clamp((p-screenScrollStart)/(screenScrollEnd-screenScrollStart),0,1);
  const screenEased=screenP*screenP*(3-2*screenP);
  if(digitalScreen){digitalScreen.src=digitalScrollImage;digitalScreen.style.transform=`translate3d(0,${(-100*screenEased).toFixed(2)}%,0)`}
  if(flipProgress)flipProgress.style.width=(p*100)+'%';
  if(flipPageLabel){
    const isPrint=p<screenScrollStart;
    flipPageLabel.textContent=isPrint?`Print ${Math.min(pages.length,Math.max(1,current+1)).toString().padStart(2,'0')} / ${pages.length} • Scroll to turn`:'';
    flipPageLabel.style.opacity=isPrint?'0.55':'0';
    flipPageLabel.style.transform=isPrint?'translateY(0)':'translateY(12px)';
  }
}
addEventListener('scroll',updateFlipbook,{passive:true});addEventListener('resize',updateFlipbook);updateFlipbook();


}
if(document.querySelector('#drone')){
const photoSection=document.querySelector('#drone');
const photoBg=document.querySelector('#photoBg');const photoSky=document.querySelector('#photoSky');const droneCanvas=document.querySelector('#drone-webgl');const droneLoading=document.querySelector('#drone-loading');const captureFlash=document.querySelector('#captureFlash');const droneProgress=document.querySelector('#droneProgress');
const droneRenderer=new THREE.WebGLRenderer({canvas:droneCanvas,antialias:true,alpha:true,powerPreference:'high-performance'});droneRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));droneRenderer.setSize(innerWidth,innerHeight);droneRenderer.outputColorSpace=THREE.SRGBColorSpace;droneRenderer.toneMapping=THREE.ACESFilmicToneMapping;droneRenderer.toneMappingExposure=1.2;
const droneScene=new THREE.Scene();const droneCamera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.01,1000);droneCamera.position.set(0,1.4,18);droneCamera.lookAt(0,1.4,0);droneScene.add(new THREE.HemisphereLight(0xffffff,0x23313a,2.6));const dk=new THREE.DirectionalLight(0xffffff,4);dk.position.set(6,10,7);droneScene.add(dk);const df=new THREE.DirectionalLight(0x79a9c2,1.8);df.position.set(-7,4,-5);droneScene.add(df);
const flightGroup=new THREE.Group();droneScene.add(flightGroup);let droneRoot=null,droneReady=false,droneRotors=[];const DRONE_MODEL_URL='./models/drone.glb';
new GLTFLoader().load(DRONE_MODEL_URL,gltf=>{droneRoot=gltf.scene;droneRoot.scale.setScalar(1.0);/* model correction: rotate the aircraft so rotor discs are horizontal */droneRoot.rotation.x=Math.PI/2;flightGroup.add(droneRoot);droneRoot.traverse(o=>{if(/^ROTOR_/.test(o.name))droneRotors.push(o)});droneReady=true;droneLoading.style.display='none';updateDrone()},xhr=>{if(xhr.total)droneLoading.textContent='Loading aerial experience… '+Math.round(xhr.loaded/xhr.total*100)+'%'},e=>{console.error(e);droneLoading.textContent='Place drone.glb in ./models/'});
function droneProgressValue(){return motionProgress(photoSection,'drone');}
function updateDrone(){
  if(updateDrone.lastCaptureIndex===undefined) updateDrone.lastCaptureIndex=-1;
  const p=droneProgressValue();if(!droneReady)return;
  const points=[[9,1.2,4.4],[6.1,.8,3.9],[2.7,.55,3.55],[-1.4,.7,3.35],[-5,.15,3.95],[-1.7,.45,3.35],[2.6,.8,3.65],[6.2,1.0,4],[9,1.2,4.4]];
  const scaled=p*(points.length-1),i=Math.min(Math.floor(scaled),points.length-2),t=scaled-i,e=t*t*(3-2*t),a=points[i],b=points[i+1];
  flightGroup.position.set(THREE.MathUtils.lerp(a[0],b[0],e),THREE.MathUtils.lerp(a[1],b[1],e),THREE.MathUtils.lerp(a[2],b[2],e));
  const dx=b[0]-a[0],dy=b[1]-a[1];
  flightGroup.rotation.set(THREE.MathUtils.clamp(dy*.035,-.10,.10),THREE.MathUtils.clamp(dx*.014,-.12,.12),THREE.MathUtils.clamp(-dx*.024,-.20,.20));
  const spin=performance.now()*.035;droneRotors.forEach((r,n)=>r.rotation.z=spin*(n%2?-1:1));
  const bgX=THREE.MathUtils.lerp(-7,7,p),skyX=THREE.MathUtils.lerp(9,-9,p);photoBg.style.transform=`translate3d(${bgX}%,0,0) scale(1.04)`;photoSky.style.transform=`translate3d(${skyX}%,0,0) scale(1.06)`;
  const captures=CFG.drone.flashAt;
  if(captureFlash){
    let captureIndex=-1;
    captures.forEach((v,n)=>{if(Math.abs(v-p)<.018)captureIndex=n});
    if(captureIndex!==-1 && captureIndex!==updateDrone.lastCaptureIndex){
      const worldPos=flightGroup.getWorldPosition(new THREE.Vector3());
      worldPos.project(droneCamera);
      captureFlash.style.left=((worldPos.x*.5+.5)*100)+'%';
      captureFlash.style.top=((-worldPos.y*.5+.5)*100)+'%';
      captureFlash.classList.remove('burst');
      void captureFlash.offsetWidth;
      captureFlash.classList.add('burst');
      updateDrone.lastCaptureIndex=captureIndex;
    }else if(captureIndex===-1){
      updateDrone.lastCaptureIndex=-1;
    }
  }
  droneProgress.style.width=(p*100)+'%';
}
addEventListener('scroll',updateDrone,{passive:true});addEventListener('resize',()=>{droneRenderer.setSize(innerWidth,innerHeight);droneCamera.aspect=innerWidth/innerHeight;droneCamera.updateProjectionMatrix();updateDrone()});function renderDrone(){const spin=performance.now()*.035;droneRotors.forEach((r,n)=>r.rotation.z=spin*(n%2?-1:1));droneRenderer.render(droneScene,droneCamera);requestAnimationFrame(renderDrone)}renderDrone();


}
if(document.querySelector('#our-story, #our-mission')){
const storySection=document.querySelector('#our-story');
const storyMark=document.querySelector('.story-mark');
const missionSection=document.querySelector('#our-mission');
const missionMark=document.querySelector('.mission-mark');
function sectionProgress(el){return motionProgress(el,el.id==='our-story'?'story':'mission');}
function updateStoryMission(){
  if(storySection&&storyMark){
    const p=sectionProgress(storySection);
    const eased=p*p*(3-2*p);
    const x=eased*42;
    const y=eased*8;
    storyMark.style.transform=`translate3d(${x}vw,${y}vh,0) rotate(${-12+eased*760}deg)`;
    storyMark.style.opacity=String(0.75*(1-eased*.92));
  }
  if(missionSection&&missionMark){
    const p=sectionProgress(missionSection);
    const eased=p*p*(3-2*p);
    const distance=Math.min(innerWidth,innerHeight)*.42;
    const x=eased*distance;
    const y=-eased*distance;
    missionMark.style.transform=`translate3d(${x}px,${y}px,0) rotate(0deg)`;
    missionMark.style.opacity=String(.9*(1-eased*.75));
  }
}
addEventListener('scroll',updateStoryMission,{passive:true});
addEventListener('resize',updateStoryMission);
updateStoryMission();


}
if(document.querySelector('#photography')){
const galleries={
 aerials:{title:'Aerials',images:[
  'https://static.wixstatic.com/media/beab6e_85c124f713574e499860d4a4333921a8~mv2.jpg','https://static.wixstatic.com/media/47f173_8c2ceed23bb04dcca8f6ef332c13ef9~mv2.jpg','https://static.wixstatic.com/media/47f173_f3622f513ce3453f8e1a1cffcab27015~mv2.jpg','https://static.wixstatic.com/media/beab6e_831179829bc8479c858e12f5dd6575eb~mv2.jpg','https://static.wixstatic.com/media/47f173_7bd2812abffa4ac487162b386fd6a6a3~mv2.jpg','https://static.wixstatic.com/media/beab6e_f30cfc020d0a469f96f1a5e22837f0e7~mv2.jpg'
 ]},
 architecture:{title:'Architecture',images:[
  'https://static.wixstatic.com/media/4f980b_54d12d6345aa4aea9ac765861fad02dd~mv2.jpg','https://static.wixstatic.com/media/4f980b_7cb46f71555b4ede83c3d409d8984294~mv2.jpg','https://static.wixstatic.com/media/4f980b_86c83e3590fe4520b633402b1bbbabe2~mv2.jpg','https://static.wixstatic.com/media/4f980b_4474578d7c6d4a96a0c9cf9f1a54d9e4~mv2.jpg','https://static.wixstatic.com/media/4f980b_7733c83e8fb744a6b3621c28dde4a16e~mv2.jpg','https://static.wixstatic.com/media/4f980b_580a7f5c2042438ab15484c0bfed3163~mv2.jpg','https://static.wixstatic.com/media/4f980b_8b152f359484446592a584401e364b59~mv2.jpg','https://static.wixstatic.com/media/4f980b_34e84cc07def4dc0af49daada1c5c7ea~mv2.jpg'
 ]},
 people:{title:'People',images:[
  'https://static.wixstatic.com/media/47f173_5ef293983bf446c9adc645a702a4eef8~mv2.jpg','https://static.wixstatic.com/media/47f173_0c454c35c18741ceaff6ccd7197af904~mv2.jpg','https://static.wixstatic.com/media/47f173_986f43fade3e44deaa0b48a56f5f201b~mv2.jpg','https://static.wixstatic.com/media/47f173_a2324aacd9f84b50ac3f10c97893b950~mv2.jpg','https://static.wixstatic.com/media/47f173_3fe10769172d438d8cf11fc6064f7646~mv2.jpg','https://static.wixstatic.com/media/47f173_f78a5a483d854bc3849f1fb0f035db6e~mv2.jpg','https://static.wixstatic.com/media/47f173_96c8c17a71694326aed802a7d76c37be~mv2.jpg','https://static.wixstatic.com/media/beab6e_69571a33efd14be4907c34ac615f7e8f~mv2.jpg'
 ]},
 events:{title:'Events + Products',images:[
  'https://static.wixstatic.com/media/47f173_5522417e60a44dd39e4e39ea4421d6c3~mv2.jpg','https://static.wixstatic.com/media/4f980b_a34f00887da543aeaafa1f4d27573392~mv2.jpg','https://static.wixstatic.com/media/beab6e_0eed98e2e95a47c992f753bdf918a0e6~mv2.jpg','https://static.wixstatic.com/media/beab6e_5cd95eb3fde94bb6ae70d5c530dd024d~mv2.jpg','https://static.wixstatic.com/media/4f980b_4192380998284181814ead137d9c4cfe~mv2.jpg','https://static.wixstatic.com/media/4f980b_f647a9ae4bad4d5b9c973abb2797f1db~mv2.jpg','https://static.wixstatic.com/media/4f980b_212ac90fe0c643508d9eb2d883f51404~mv2.jpg','https://static.wixstatic.com/media/beab6e_e92987a5c6f14d5792b53423a6a43373~mv2.jpg'
 ]}
};
const photoLightbox=document.querySelector('#photoLightbox'),photoLightboxImage=document.querySelector('#photoLightboxImage'),photoLightboxTitle=document.querySelector('#photoLightboxTitle'),photoLightboxCount=document.querySelector('#photoLightboxCount'),photoLightboxDots=document.querySelector('#photoLightboxDots');let galleryKey=null,galleryIndex=0,touchStartX=0;
function renderGallery(){const g=galleries[galleryKey];if(!g)return;photoLightboxImage.src=g.images[galleryIndex];photoLightboxImage.alt=`C2DG ${g.title} photograph ${galleryIndex+1}`;photoLightboxTitle.textContent=g.title;photoLightboxCount.textContent=`${String(galleryIndex+1).padStart(2,'0')} / ${String(g.images.length).padStart(2,'0')}`;photoLightboxDots.innerHTML=g.images.map((_,i)=>`<button type="button" class="${i===galleryIndex?'is-active':''}" aria-label="Photo ${i+1}"></button>`).join('');photoLightboxDots.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{galleryIndex=i;renderGallery()}));}
function openGallery(key){galleryKey=key;galleryIndex=0;renderGallery();photoLightbox.classList.add('is-open');photoLightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeGallery(){photoLightbox.classList.remove('is-open');photoLightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function stepGallery(dir){if(!galleryKey)return;const g=galleries[galleryKey];galleryIndex=(galleryIndex+dir+g.images.length)%g.images.length;renderGallery()}
document.querySelectorAll('.photo-tile').forEach(tile=>tile.addEventListener('click',()=>openGallery(tile.dataset.gallery)));
document.querySelector('.photo-lightbox-close')?.addEventListener('click',closeGallery);document.querySelector('.photo-lightbox-prev')?.addEventListener('click',()=>stepGallery(-1));document.querySelector('.photo-lightbox-next')?.addEventListener('click',()=>stepGallery(1));photoLightbox?.addEventListener('click',e=>{if(e.target===photoLightbox)closeGallery()});photoLightboxImage?.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX},{passive:true});photoLightboxImage?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchStartX;if(Math.abs(dx)>45)stepGallery(dx<0?1:-1)},{passive:true});document.addEventListener('keydown',e=>{if(!photoLightbox.classList.contains('is-open'))return;if(e.key==='Escape')closeGallery();if(e.key==='ArrowRight')stepGallery(1);if(e.key==='ArrowLeft')stepGallery(-1)});


}
if(document.querySelector('#videography')){
const VIDEO_URL = 'https://video.wixstatic.com/video/47f173_c6e8c68c65244c438dab9c88472930d7/1080p/mp4/file.mp4';
const c2Video=document.getElementById('c2VideoBg');const c2VideoToggle=document.getElementById('c2VideoToggle');const c2VideoIcon=c2VideoToggle?.querySelector('.video-control-icon');const c2VideoLabel=c2VideoToggle?.querySelector('.video-control-label');
function setVideoButton(paused){if(!c2VideoToggle)return;c2VideoToggle.classList.toggle('is-paused',paused);c2VideoToggle.setAttribute('aria-pressed',paused?'true':'false');c2VideoToggle.setAttribute('aria-label',paused?'Play background video':'Pause background video');if(c2VideoIcon)c2VideoIcon.textContent=paused?'▶':'Ⅱ';if(c2VideoLabel)c2VideoLabel.textContent=paused?'PLAY':'PAUSE'}
if(c2Video&&VIDEO_URL){const source=document.createElement('source');source.src=VIDEO_URL;source.type='video/mp4';c2Video.appendChild(source);c2Video.load();c2Video.play().catch(()=>{})}if(c2Video){c2Video.addEventListener('play',()=>setVideoButton(false));c2Video.addEventListener('pause',()=>setVideoButton(true));c2Video.addEventListener('error',()=>console.warn('C2DG background video could not be loaded.'))}if(c2VideoToggle&&c2Video)c2VideoToggle.addEventListener('click',()=>{if(c2Video.paused)c2Video.play().catch(()=>{});else c2Video.pause()});setVideoButton(false);

}