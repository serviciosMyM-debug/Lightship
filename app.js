const $=s=>document.querySelector(s);
function iconMarkup(name){return `<svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${name}"></use></svg>`}
const themeButtons=document.querySelectorAll('.theme');
function updateTheme(){themeButtons.forEach(b=>{const dark=document.documentElement.dataset.theme==='dark';b.innerHTML=iconMarkup(dark?'sun':'moon');b.setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro')})}
themeButtons.forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('lightship-theme',document.documentElement.dataset.theme)}catch{}updateTheme()}));updateTheme();
const menu=$('.menu');if(menu)menu.addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');menu.innerHTML=iconMarkup(open?'close':'menu')});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.innerHTML=iconMarkup('menu');$('#nav').classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){$('#nav').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.innerHTML=iconMarkup('menu')}});
if($('#year'))$('#year').textContent=new Date().getFullYear();
function safeURL(src){try{const u=new URL(src,location.href);return ['https:','http:','file:','blob:'].includes(u.protocol)?u.href:null}catch{return null}}
function embedURL(src){try{const u=new URL(src);if(['www.youtube.com','youtube.com','m.youtube.com'].includes(u.hostname)){const id=u.searchParams.get('v')||u.pathname.split('/').pop();if(/^[\w-]{11}$/.test(id))return 'https://www.youtube-nocookie.com/embed/'+id}if(u.hostname==='youtu.be'&&/^[\w-]{11}$/.test(u.pathname.slice(1)))return 'https://www.youtube-nocookie.com/embed/'+u.pathname.slice(1);if(['vimeo.com','www.vimeo.com'].includes(u.hostname)&&/^\/\d+$/.test(u.pathname))return 'https://player.vimeo.com/video'+u.pathname}catch{}return null}
let media=window.LIGHTSHIP_MEDIA||[],visible=media,active=0;
const gallery=$('#gallery-grid'),box=$('#lightbox');
if(box&&$('.signature'))box.append($('.signature').cloneNode(true));
function renderGallery(filter='all'){visible=media.filter(m=>filter==='all'||m.type===filter);gallery.replaceChildren();$('#gallery-empty').hidden=visible.length>0;visible.forEach((m,i)=>{const b=document.createElement('button');b.className='gallery-item';b.setAttribute('aria-label','Ver '+m.title);const thumb=document.createElement('div');thumb.className='thumb';if(m.type==='image'){const img=document.createElement('img');img.src=safeURL(m.src)||'';img.alt=m.description||m.title;img.loading='lazy';thumb.append(img)}else{if(m.poster&&safeURL(m.poster)){const img=document.createElement('img');img.src=safeURL(m.poster);img.alt='';img.loading='lazy';thumb.append(img)}const badge=document.createElement('span');badge.className='video-label';badge.innerHTML=iconMarkup('play')+'Ver video';thumb.append(badge)}const exp=document.createElement('span');exp.className='expand';exp.innerHTML=iconMarkup(m.type==='video'?'play':'zoom');thumb.append(exp);const h=document.createElement('h3');h.textContent=m.title;const p=document.createElement('p');p.textContent=m.description||'';b.append(thumb,h,p);b.addEventListener('click',()=>openMedia(i));gallery.append(b)})}
function displayMedia(){const m=visible[active],target=$('#lightbox-media');target.replaceChildren();const embedded=m.type==='video'&&embedURL(m.src);let el;if(embedded){el=document.createElement('iframe');el.src=embedded;el.title=m.title;el.allow='fullscreen; picture-in-picture';el.referrerPolicy='strict-origin-when-cross-origin';el.allowFullscreen=true}else{el=document.createElement(m.type==='video'?'video':'img');el.src=safeURL(m.src)||'';if(m.type==='video'){el.controls=true;el.preload='metadata';el.playsInline=true}else el.alt=m.description||m.title}target.append(el);$('#lightbox-caption').textContent=`${active+1} / ${visible.length} · ${m.title}`;$('#prev').disabled=visible.length<2;$('#next').disabled=visible.length<2}
function openMedia(i){active=i;displayMedia();box.showModal();document.body.classList.add('modal-open')}
if(gallery){renderGallery();document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderGallery(b.dataset.filter)}));box.querySelector('.close').addEventListener('click',()=>box.close());box.addEventListener('close',()=>{$('#lightbox-media').replaceChildren();document.body.classList.remove('modal-open')});box.addEventListener('click',e=>{if(e.target===box){const r=box.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)box.close()}});function step(n){active=(active+n+visible.length)%visible.length;displayMedia()}$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);box.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO'||e.target.tagName==='IFRAME')return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)})}
if($('#quote-form'))$('#quote-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const message=`Hola Lightship, quisiera consultar por un servicio.\n\nNombre y empresa: ${d.get('name')}\nCorreo: ${d.get('email')}\nServicio: ${d.get('service')}\n\n${d.get('message')}`;location.href='https://wa.me/5493476597324?text='+encodeURIComponent(message)});

// Motion is an enhancement: all content stays visible without JavaScript.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
  const navLinks=[...document.querySelectorAll('#nav a')];
  if(navLinks.length){const activeSection=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -55% 0px',threshold:0});document.querySelectorAll('main>section[id]').forEach(section=>activeSection.observe(section))}
}
document.querySelectorAll('.service-list details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open&&!reducedMotion.matches&&detail.animate)detail.querySelector('.service-body').animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'})}));
const header=$('.header');if(header){let scrollQueued=false;const updateHeader=()=>{header.classList.toggle('is-scrolled',scrollY>20);scrollQueued=false};addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(updateHeader);scrollQueued=true}},{passive:true});updateHeader()}

// A reversible, scroll-linked fade. No content is hidden without JavaScript.
const sceneSelector='.hero-content>*,.section-heading>div,.section-heading>p,.about>div:first-child,.about-copy>p,.about-copy>.values,.about-copy>.text-link,.service-list>details,.vessel,.coverage>div>*,.ports>li,.gallery-item,.contact>div>*,.contact>form';
const scenes=new Map();let motionFrame=0;
const clamp01=value=>Math.min(1,Math.max(0,value));
const smooth=value=>value*value*(3-2*value);
function collectScenes(){document.querySelectorAll(sceneSelector).forEach(el=>{if(!scenes.has(el)){el.classList.add('scroll-scene');scenes.set(el,{y:0})}});queueMotion()}
function queueMotion(){if(!motionFrame)motionFrame=requestAnimationFrame(paintMotion)}
function paintMotion(){
  motionFrame=0;
  const viewHeight=innerHeight,top=(header?.offsetHeight||0)+12,bottom=viewHeight-46;
  const entryDistance=Math.min(245,Math.max(130,viewHeight*.28));
  const exitDistance=Math.min(170,Math.max(95,viewHeight*.19));
  const updates=[];
  scenes.forEach((state,el)=>{
    if(!el.isConnected){scenes.delete(el);return}
    if(reducedMotion.matches){updates.push({el,state,y:0,opacity:1});return}
    const rect=el.getBoundingClientRect(),naturalTop=rect.top-state.y,naturalBottom=rect.bottom-state.y;
    const entering=smooth(clamp01((bottom-naturalTop)/entryDistance));
    const leaving=smooth(clamp01((naturalBottom-top)/exitDistance));
    const focused=el.contains(document.activeElement);
    updates.push({el,state,y:focused?0:64*(1-entering)-44*(1-leaving),opacity:focused?1:entering*leaving});
  });
  updates.forEach(({el,state,y,opacity})=>{state.y=y;el.style.setProperty('--scroll-y',y.toFixed(2)+'px');el.style.setProperty('--scroll-opacity',opacity.toFixed(3))});
}
addEventListener('scroll',queueMotion,{passive:true});addEventListener('resize',queueMotion,{passive:true});
addEventListener('pageshow',queueMotion);document.addEventListener('focusin',queueMotion);document.addEventListener('focusout',queueMotion);
reducedMotion.addEventListener('change',queueMotion);
if('ResizeObserver' in window){new ResizeObserver(queueMotion).observe(document.body)}
if(gallery)new MutationObserver(collectScenes).observe(gallery,{childList:true});
collectScenes();

// Crossfading photographs: pause off-screen, in a background tab, or for reduced motion.
const slides=[...document.querySelectorAll('.hero-slide')],slideCounter=$('#slide-counter'),slidePause=$('#slide-pause');
let currentSlide=0,slideTimer=null,slidesPaused=false,heroInView=true;
function showSlide(index){currentSlide=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{const active=i===currentSlide;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active))});if(slideCounter)slideCounter.textContent=String(currentSlide+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}
function syncSlides(){clearInterval(slideTimer);slideTimer=null;if(slides.length>1&&!slidesPaused&&!reducedMotion.matches&&!document.hidden&&heroInView)slideTimer=setInterval(()=>showSlide(currentSlide+1),7500);if(slidePause){const paused=slidesPaused||reducedMotion.matches;slidePause.innerHTML=iconMarkup(paused?'play':'pause');slidePause.disabled=reducedMotion.matches;slidePause.setAttribute('aria-label',reducedMotion.matches?'Cambio automático desactivado por movimiento reducido':paused?'Reanudar cambio de fotos':'Pausar cambio de fotos');slidePause.setAttribute('aria-pressed',String(paused))}}
if(slides.length){$('#slide-prev').addEventListener('click',()=>{showSlide(currentSlide-1);syncSlides()});$('#slide-next').addEventListener('click',()=>{showSlide(currentSlide+1);syncSlides()});slidePause.addEventListener('click',()=>{slidesPaused=!slidesPaused;syncSlides()});document.addEventListener('visibilitychange',syncSlides);reducedMotion.addEventListener('change',syncSlides);if('IntersectionObserver' in window)new IntersectionObserver(entries=>{heroInView=entries[0].isIntersecting;syncSlides()},{threshold:.05}).observe($('#inicio'));showSlide(0);syncSlides()}
