(() => {
 const nav=document.querySelector('.embedded-nav'),mobile=document.querySelector('#embedNavToggle'),links=document.querySelector('#embedNavLinks');
 const menus=[...nav.querySelectorAll('details')];
 const close=()=>{menus.forEach(d=>d.open=false);links.classList.remove('mobile-open');mobile.setAttribute('aria-expanded','false');};
 function measure(){document.documentElement.style.setProperty('--embedded-nav-bottom',`${nav.getBoundingClientRect().bottom+10}px`);}
 mobile.addEventListener('click',()=>{const open=links.classList.toggle('mobile-open');mobile.setAttribute('aria-expanded',String(open));measure();});
 nav.addEventListener('click',e=>{
  const link=e.target.closest('a[data-section],a[data-contact]');if(!link)return;
  e.preventDefault();close();measure();
  if(link.hasAttribute('data-contact'))window.C2Contact();else window.C2Navigate(link.dataset.section);
 });
 for(const menu of menus){
  let timer;menu.addEventListener('mouseenter',()=>{if(matchMedia('(min-width: 761px) and (hover: hover)').matches){clearTimeout(timer);menu.open=true;measure();}});
  menu.addEventListener('mouseleave',()=>{if(matchMedia('(min-width: 761px) and (hover: hover)').matches)timer=setTimeout(()=>{menu.open=false;measure();},200);});
  menu.addEventListener('toggle',measure);
 }
 document.addEventListener('click',e=>{if(!nav.contains(e.target)){close();measure();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();measure();}});
 new ResizeObserver(measure).observe(nav);addEventListener('resize',measure);measure();
})();
