const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
const db=window.KhoiDB?.client;

const defaultEvents=[
  {id:'local-lq',title:'Giải đấu Liên Quân tại Khói Coffee',type:'GIẢI ĐẤU',status:'coming_soon',event_date:null,start_time:null,end_time:null,price:100000,price_label:'100K/người',image_url:'assets/lienquan-event.png',description:'Cùng đồng đội tranh tài tại giải Liên Quân của Khói Coffee. Không gian thi đấu thoải mái, giao lưu vui vẻ và có cơ hội nhận quà dành cho những đội chơi nổi bật.',highlights:['Thi đấu Liên Quân theo đội','Không khí giao lưu sôi động','Phí tham gia 100K/người','Số lượng chỗ có giới hạn'],featured:true,sort_order:1},
  {id:'local-latte',title:'Latte Art Workshop',type:'WORKSHOP',status:'published',event_date:'2026-09-05',start_time:'14:00',end_time:'16:30',price:399000,price_label:'399K/người',image_url:'assets/cafe-06.jpg',description:'Workshop thực hành latte art dành cho người mới, từ cách đánh sữa đến tạo hình cơ bản. Mỗi khách có thời gian tự tay thực hành và mang về trải nghiệm thật cùng barista.',highlights:['Thực hành trực tiếp','Hướng dẫn từng bước','Bao gồm nguyên liệu','Nhóm nhỏ dễ tương tác'],featured:false,sort_order:2},
  {id:'local-acoustic',title:'Acoustic Chill',type:'LIVE MUSIC',status:'published',event_date:'2026-09-12',start_time:'20:00',end_time:'22:00',price:79000,price_label:'79K/người',image_url:'assets/cafe-05.jpg',description:'Đêm acoustic nhẹ nhàng giữa không gian xanh của Khói. Một buổi tối để nghe nhạc, trò chuyện và thư giãn cùng bạn bè trong không khí gần gũi.',highlights:['Ban nhạc acoustic trực tiếp','Không gian xanh buổi tối','Chỗ ngồi giới hạn','Phù hợp hẹn hò và nhóm bạn'],featured:false,sort_order:3},
  {id:'local-board',title:'Board Game Night',type:'GAME NIGHT',status:'published',event_date:'2026-09-19',start_time:'19:00',end_time:'22:00',price:89000,price_label:'89K/người',image_url:'assets/cafe-04.jpg',description:'Một tối board game vui vẻ dành cho nhóm bạn và người muốn làm quen bạn mới.',highlights:['Nhiều game dễ chơi','Có người hướng dẫn','Không khí giao lưu','Nhóm nhỏ'],featured:false,sort_order:4}
];
let publicEvents=[...defaultEvents];

function formatDate(v){if(!v)return 'Sắp công bố';const d=new Date(v+'T00:00:00');return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}
function formatTime(v){return v?String(v).slice(0,5):''}
function eventWhen(e){if(e.status==='coming_soon')return 'COMING SOON';const date=formatDate(e.event_date),start=formatTime(e.start_time),end=formatTime(e.end_time);return [date,[start,end].filter(Boolean).join(' - ')].filter(Boolean).join(' · ')}
function priceLabel(e){if(e.price_label)return e.price_label;if(!e.price)return 'Miễn phí';return new Intl.NumberFormat('vi-VN').format(e.price)+'đ/người'}
function esc(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}

qa('[data-scroll]').forEach(el=>el.addEventListener('click',()=>scrollToTarget(el.dataset.scroll)));
function scrollToTarget(selector){const target=q(selector);if(!target)return;const header=q('.site-header');const offset=(header?.getBoundingClientRect().height||0)+14;const top=target.getBoundingClientRect().top+window.scrollY-offset;window.scrollTo({top,behavior:'smooth'})}

const menuBtn=q('.menu-btn');
menuBtn?.addEventListener('click',()=>q('.nav-links')?.classList.toggle('mobile-open'));

const eventModal=q('#eventModal'),allEventsModal=q('#allEventsModal');
function openEventDetail(e){
  q('#modalTitle').textContent=e.title||'';
  q('#modalTime').textContent=eventWhen(e);
  q('#modalPrice').textContent=priceLabel(e);
  q('#modalType').textContent=e.status==='coming_soon'?'COMING SOON':(e.type||'EVENT AT KHÓI');
  q('#modalDesc').textContent=e.description||'';
  q('#modalImage').src=e.image_url||'assets/cafe-05.jpg';
  const ul=q('#modalHighlights');ul.innerHTML='';(e.highlights||[]).forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li)});
  allEventsModal?.classList.remove('show');eventModal?.classList.add('show');
}
function renderFeaturedEvents(){
  const list=q('#events-list');if(!list)return;
  const ordered=[...publicEvents].sort((a,b)=>(Number(b.featured)-Number(a.featured))||((a.sort_order??100)-(b.sort_order??100)));
  list.innerHTML=ordered.slice(0,3).map((e,i)=>`<article class="mini-event ${i===0?'featured-event':''}" data-event-id="${esc(e.id)}"><img src="${esc(e.image_url||'assets/cafe-05.jpg')}" alt="${esc(e.title)}"><div class="shade"></div>${e.status==='coming_soon'?'<div class="event-coming-badge">COMING SOON</div>':''}${i===0?'<div class="featured-badge">★ SỰ KIỆN NỔI BẬT</div>':''}<div class="mini-copy"><span>${esc(e.type||'EVENT')}</span><h4>${esc(e.title)}</h4><p>${esc(eventWhen(e))}</p><b>♙ ${esc(priceLabel(e))}</b></div></article>`).join('');
  qa('[data-event-id]',list).forEach(card=>card.addEventListener('click',()=>{const e=publicEvents.find(x=>String(x.id)===card.dataset.eventId);if(e)openEventDetail(e)}));
}
function renderAllEvents(){
  const grid=q('#allEventsGrid');if(!grid)return;
  grid.innerHTML=publicEvents.map(e=>`<article class="all-event-row" data-all-event-id="${esc(e.id)}"><img src="${esc(e.image_url||'assets/cafe-05.jpg')}" alt="${esc(e.title)}"><div class="all-event-info"><span class="${e.status==='coming_soon'?'soon':''}">${esc(e.status==='coming_soon'?'COMING SOON':(e.type||'EVENT'))}</span><h3>${esc(e.title)}</h3><p>${esc(eventWhen(e))}</p><p>Khói Coffee · Không gian xanh</p><strong>${esc(priceLabel(e))}</strong></div></article>`).join('');
  qa('[data-all-event-id]',grid).forEach(card=>card.addEventListener('click',()=>{const e=publicEvents.find(x=>String(x.id)===card.dataset.allEventId);if(e)openEventDetail(e)}));
}
q('#openAllEvents')?.addEventListener('click',()=>{renderAllEvents();allEventsModal?.classList.add('show')});

q('.open-room-modal')?.addEventListener('click',()=>q('#roomModal')?.classList.add('show'));
qa('.modal-close').forEach(b=>b.addEventListener('click',()=>b.closest('.modal')?.classList.remove('show')));
qa('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));

const galleryImgs=qa('.gallery-strip img').map(i=>i.src),drinkImgs=qa('.drink-four img').map(i=>i.src),menuImg=q('.menu-preview img')?.src,lb=q('#lightbox'),lbImg=q('#lightboxImage');
let activeImgs=galleryImgs,idx=0;
function showFrom(list,i){activeImgs=list.filter(Boolean);if(!activeImgs.length)return;idx=(i+activeImgs.length)%activeImgs.length;lbImg.src=activeImgs[idx];lb.classList.add('show')}
function show(i){showFrom(activeImgs,i)}
qa('[data-gallery]').forEach(b=>b.addEventListener('click',()=>showFrom(galleryImgs,+b.dataset.gallery)));
q('[data-menu-preview]')?.addEventListener('click',()=>showFrom([menuImg],0));
qa('[data-drink]').forEach(b=>b.addEventListener('click',()=>showFrom(drinkImgs,+b.dataset.drink)));
q('#openGallery')?.addEventListener('click',()=>showFrom(galleryImgs,0));q('#openDrinks')?.addEventListener('click',()=>showFrom(drinkImgs,0));
q('.lb-prev')?.addEventListener('click',()=>show(idx-1));q('.lb-next')?.addEventListener('click',()=>show(idx+1));q('.lightbox-close')?.addEventListener('click',()=>lb.classList.remove('show'));lb?.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('show')});

(function(){const menu=q('.menu-preview'),drinkGrid=q('.drink-four');if(!menu||!drinkGrid)return;const sync=()=>{if(window.innerWidth>=1025){drinkGrid.style.height=menu.getBoundingClientRect().height+'px';drinkGrid.style.flex='0 0 auto'}else{drinkGrid.style.height='';drinkGrid.style.flex=''}};window.addEventListener('load',sync);window.addEventListener('resize',sync);document.fonts?.ready?.then(sync);setTimeout(sync,60)})();

async function loadPublicEvents(){
  if(!window.KhoiDB?.ready){renderFeaturedEvents();return}
  const {data,error}=await db.from('events').select('*').in('status',['published','coming_soon']).order('sort_order',{ascending:true}).order('created_at',{ascending:false});
  if(!error&&data?.length)publicEvents=data;
  renderFeaturedEvents();
}

const roomForm=q('#roomBookingForm');
roomForm?.addEventListener('submit',async e=>{
  e.preventDefault();const msg=q('#bookingFormMessage');msg.className='booking-form-message';
  if(!window.KhoiDB?.ready){msg.textContent='Hệ thống booking chưa được kết nối. Vui lòng gọi Hotline 0377 125 247.';msg.classList.add('error');return}
  const payload={name:q('#bookingName').value.trim(),phone:q('#bookingPhone').value.trim(),booking_date:q('#bookingDate').value,booking_time:q('#bookingTime').value,people:Number(q('#bookingPeople').value),duration:q('#bookingDuration').value,note:q('#bookingNote').value.trim()||null};
  if(!payload.name||!payload.phone||!payload.booking_date||!payload.booking_time||!payload.people){msg.textContent='M điền giúp Khói đầy đủ thông tin nha.';msg.classList.add('error');return}
  const btn=q('button[type="submit"]',roomForm);btn.disabled=true;btn.textContent='Đang gửi...';
  const {error}=await db.from('room_bookings').insert(payload);btn.disabled=false;btn.textContent='Gửi yêu cầu đặt phòng';
  if(error){msg.textContent='Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi Hotline 0377 125 247.';msg.classList.add('error');return}
  roomForm.reset();msg.textContent='Đã nhận yêu cầu. Khói sẽ liên hệ lại với bạn sớm nha!';
});

async function loadSitePopup(){
  if(!window.KhoiDB?.ready)return;
  const {data,error}=await db.from('site_popup').select('*').eq('id',1).maybeSingle();if(error||!data?.enabled)return;
  const now=Date.now();if(data.start_at&&now<new Date(data.start_at).getTime())return;if(data.end_at&&now>new Date(data.end_at).getTime())return;
  if(data.frequency==='session'&&sessionStorage.getItem('khoi_popup_seen')==='1')return;
  q('#sitePromoTitle').textContent=data.title||'';q('#sitePromoBody').textContent=data.body||'';const img=q('#sitePromoImage');if(data.image_url){img.src=data.image_url}else img.removeAttribute('src');const cta=q('#sitePromoCta');cta.textContent=data.cta_label||'Xem ngay';cta.href=data.cta_url||'#events';
  setTimeout(()=>q('#sitePromoModal')?.classList.add('show'),550);if(data.frequency==='session')sessionStorage.setItem('khoi_popup_seen','1');
}
q('.site-promo-close')?.addEventListener('click',()=>q('#sitePromoModal')?.classList.remove('show'));
q('#sitePromoModal')?.addEventListener('click',e=>{if(e.target.id==='sitePromoModal')e.currentTarget.classList.remove('show')});
q('#sitePromoCta')?.addEventListener('click',e=>{const href=e.currentTarget.getAttribute('href')||'';if(href.startsWith('#')){e.preventDefault();q('#sitePromoModal')?.classList.remove('show');scrollToTarget(href)}});

renderFeaturedEvents();
loadPublicEvents();
loadSitePopup();
