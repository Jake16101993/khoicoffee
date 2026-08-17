const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
qa('[data-scroll]').forEach(el=>el.addEventListener('click',()=>{
  const target=q(el.dataset.scroll);
  if(!target) return;
  const header=q('.site-header');
  const offset=(header?.getBoundingClientRect().height||0)+14;
  const top=target.getBoundingClientRect().top+window.scrollY-offset;
  window.scrollTo({top,behavior:'smooth'});
}));

const eventModal=q('#eventModal');
qa('.open-modal').forEach(card=>card.addEventListener('click',()=>{
  q('#modalTitle').textContent=card.dataset.title;
  q('#modalTime').textContent=card.dataset.time;
  q('#modalPrice').textContent=card.dataset.price;
  q('#modalType').textContent=card.dataset.type || 'EVENT AT KHÓI';
  q('#modalDesc').textContent=card.dataset.desc || '';
  q('#modalImage').src=q('img',card)?.src || '';
  const ul=q('#modalHighlights');
  ul.innerHTML='';
  (card.dataset.highlights||'').split('|').filter(Boolean).forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li)});
  eventModal.classList.add('show');
}));
q('.open-room-modal')?.addEventListener('click',()=>q('#roomModal').classList.add('show'));
qa('.modal-close').forEach(b=>b.addEventListener('click',()=>b.closest('.modal').classList.remove('show')));
qa('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));

const galleryImgs=qa('.gallery-strip img').map(i=>i.src), drinkImgs=qa('.drink-four img').map(i=>i.src), menuImg=q('.menu-preview img')?.src, lb=q('#lightbox'), lbImg=q('#lightboxImage');
let activeImgs=galleryImgs, idx=0;
function showFrom(list,i){activeImgs=list;idx=(i+activeImgs.length)%activeImgs.length;lbImg.src=activeImgs[idx];lb.classList.add('show')}
function show(i){showFrom(activeImgs,i)}
qa('[data-gallery]').forEach(b=>b.addEventListener('click',()=>showFrom(galleryImgs,+b.dataset.gallery)));
q('[data-menu-preview]')?.addEventListener('click',()=>showFrom([menuImg],0));
qa('[data-drink]').forEach(b=>b.addEventListener('click',()=>showFrom(drinkImgs,+b.dataset.drink)));
q('#openGallery')?.addEventListener('click',()=>showFrom(galleryImgs,0));
q('#openDrinks')?.addEventListener('click',()=>showFrom(drinkImgs,0));
q('.lb-prev')?.addEventListener('click',()=>show(idx-1));q('.lb-next')?.addEventListener('click',()=>show(idx+1));
q('.lightbox-close')?.addEventListener('click',()=>lb.classList.remove('show'));lb?.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('show')});

// V18: keep desktop drinks grid exactly aligned to the menu image height.
(function(){
  const menu = document.querySelector('.menu-preview');
  const drinkGrid = document.querySelector('.drink-four');
  if(!menu || !drinkGrid) return;
  const syncDrinkGridHeight = () => {
    if(window.innerWidth >= 1025){
      const h = menu.getBoundingClientRect().height;
      drinkGrid.style.height = h + 'px';
      drinkGrid.style.flex = '0 0 auto';
    } else {
      drinkGrid.style.height = '';
      drinkGrid.style.flex = '';
    }
  };
  window.addEventListener('load', syncDrinkGridHeight);
  window.addEventListener('resize', syncDrinkGridHeight);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(syncDrinkGridHeight);
  setTimeout(syncDrinkGridHeight, 50);
})();
