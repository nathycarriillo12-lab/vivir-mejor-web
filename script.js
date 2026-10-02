
const WHATSAPP='524624320651';
const wa=(msg='Hola, Vivir Mejor. Quiero conocer más sobre sus proyectos.')=>`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll('[data-wa]').forEach(a=>a.href=wa(a.dataset.wa||undefined));
const menuBtn=document.querySelector('.hamb'); const mobile=document.querySelector('.mobile-menu');
if(menuBtn){menuBtn.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});}
const modal=document.querySelector('.modal');
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.modal;const src=document.getElementById(id);if(modal&&src){modal.querySelector('.modal-content').innerHTML=src.innerHTML;modal.classList.add('open');modal.setAttribute('aria-hidden','false')}}));
document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>{modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true')}));
if(modal) modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});
let cart=JSON.parse(localStorage.getItem('vm_cart')||'[]');
function saveCart(){localStorage.setItem('vm_cart',JSON.stringify(cart));renderCart()}
function addToCart(name,price){const found=cart.find(x=>x.name===name);if(found)found.qty++;else cart.push({name,price,qty:1});saveCart();document.querySelector('.cart')?.scrollIntoView({behavior:'smooth',block:'center'})}
function removeFromCart(name){cart=cart.filter(x=>x.name!==name);saveCart()}
function renderCart(){const box=document.querySelector('[data-cart-items]');const totalEl=document.querySelector('[data-cart-total]');if(!box)return;box.innerHTML='';let total=0;cart.forEach(x=>{total+=x.price*x.qty;const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<span>${x.qty} × ${x.name}</span><strong>$${(x.price*x.qty).toLocaleString('es-MX')} <button type="button" aria-label="Quitar ${x.name}" data-remove="${x.name}">×</button></strong>`;box.appendChild(row)});if(!cart.length)box.innerHTML='<p class="resource-meta">Tu carrito está vacío.</p>';totalEl&&(totalEl.textContent=`$${total.toLocaleString('es-MX')} MXN`);box.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>removeFromCart(b.dataset.remove)));}
const checkout=document.querySelector('[data-checkout]');if(checkout){checkout.addEventListener('click',()=>{if(!cart.length)return alert('Agrega al menos un producto.');const detail=cart.map(x=>`${x.qty} x ${x.name} ($${x.price} c/u)`).join('\n');const total=cart.reduce((s,x)=>s+x.price*x.qty,0);window.open(wa(`Hola, Vivir Mejor. Quiero solicitar estos souvenirs:\n${detail}\nTotal: $${total} MXN`),'_blank')})}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.add,Number(b.dataset.price))));renderCart();

/* Navegación principal: ordenada según el recorrido de conversión. */
(function(){
  const items=[
    ['nosotros.html','Nosotros'],
    ['programas.html','Programas'],
    ['empresas.html','Empresas'],
    ['alianzas.html','Alianzas'],
    ['eventos.html','Eventos'],
    ['souvenirs.html','Souvenirs'],
    ['voluntariado.html','Voluntariado'],
    ['contacto.html','Contacto']
  ];
  const extra=[
    ['historias.html','Historias'],
    ['podcast.html','Podcast'],
    ['transparencia.html','Transparencia']
  ];
  document.querySelectorAll('.menu').forEach(nav=>{
    nav.innerHTML='';
    items.forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;nav.appendChild(a)});
    const more=document.createElement('div'); more.className='menu-more';
    const toggle=document.createElement('button'); toggle.type='button'; toggle.className='menu-more-toggle'; toggle.setAttribute('aria-expanded','false'); toggle.textContent='Más ▾';
    const list=document.createElement('div'); list.className='menu-more-list';
    extra.forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;list.appendChild(a)});
    more.append(toggle,list); nav.appendChild(more);
    const cta=document.createElement('a'); cta.href='aportar.html'; cta.className='cta'; cta.textContent='Invertir en impacto'; document.querySelector('.site-header .nav')?.appendChild(cta);
    toggle.addEventListener('click',()=>{const open=more.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
  });
  document.querySelectorAll('.mobile-menu').forEach(menu=>{
    menu.innerHTML='';
    [...items,...extra].forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;menu.appendChild(a)});
    const cta=document.createElement('a');cta.href='aportar.html';cta.textContent='Invertir en impacto';cta.className='mobile-cta';menu.appendChild(cta);
  });
})();

/* Copiar datos bancarios */
document.querySelectorAll('[data-copy-bank]').forEach(btn=>btn.addEventListener('click',async()=>{
 const key=btn.dataset.copyBank;
 const el=document.querySelector('[data-bank-value="'+key+'"]');
 if(!el)return;
 try{await navigator.clipboard.writeText(el.textContent.trim());const old=btn.textContent;btn.textContent='Copiado ✓';setTimeout(()=>btn.textContent=old,1600);}
 catch(e){alert('No se pudo copiar. Puedes seleccionar el dato manualmente.');}
}));

/* Flujo de aportación en 3 pasos */
(function(){
 const panels=[...document.querySelectorAll('.donation-step-panel')];
 if(!panels.length)return;
 let step=1, amount=500, method='transfer';
 const money=n=>'$'+Number(n).toLocaleString('es-MX')+' MXN';
 const destination=()=>document.getElementById('donationDestination')?.value||'Fondo general';
 function sync(){
  panels.forEach((p,i)=>p.hidden=i!==step-1);
  const n=document.getElementById('donationStepNumber'), bar=document.getElementById('donationProgress');
  if(n)n.textContent=step;if(bar)bar.style.width=(step/3*100)+'%';
  ['selectedAmount','selectedAmount2','selectedAmount3'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=money(amount)});
  ['selectedDestination2','selectedDestination3'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=destination()});
  const sm=document.getElementById('selectedMethod3');if(sm)sm.textContent=method==='transfer'?'Transferencia bancaria':'Pago en línea';
  const finish=document.getElementById('donationFinish');
  if(finish)finish.href=wa('Hola, Vivir Mejor. Quiero hacer una aportación de '+money(amount)+' para '+destination()+'. Elegí '+(method==='transfer'?'transferencia bancaria':'pago en línea')+'.');
 }
 document.querySelectorAll('[data-amount]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-amount]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  const v=b.dataset.amount, wrap=document.getElementById('customAmountWrap');
  if(v==='custom'){if(wrap)wrap.hidden=false;return}
  if(wrap)wrap.hidden=true;amount=Number(v);sync();
 }));
 document.getElementById('customAmount')?.addEventListener('input',e=>{if(Number(e.target.value)>=50){amount=Number(e.target.value);sync()}});
 document.getElementById('donationDestination')?.addEventListener('change',sync);
 document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-method]').forEach(x=>x.classList.remove('active'));b.classList.add('active');method=b.dataset.method;
  document.querySelectorAll('[data-method-panel]').forEach(x=>x.hidden=x.dataset.methodPanel!==method);sync();
 }));
 document.querySelectorAll('[data-next-step]').forEach(b=>b.addEventListener('click',()=>{if(step<3){step++;sync();window.scrollTo({top:0,behavior:'smooth'})}}));
 document.querySelectorAll('[data-prev-step]').forEach(b=>b.addEventListener('click',()=>{if(step>1){step--;sync();window.scrollTo({top:0,behavior:'smooth'})}}));
 sync();
})();
