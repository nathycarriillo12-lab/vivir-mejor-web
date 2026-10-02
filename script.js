
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
