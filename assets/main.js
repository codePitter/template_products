// ================== CONFIG ==================
    const WHATSAPP_TEL = '5493410000000'; // Cambiar (con país, sin +)
    const CURRENCY = 'ARS';
    const PRODUCTS = [
      {
        id: 'p1',
        title: 'Remera básica verde',
        price: 9500,
        category: 'Ropa',
        img: 'assets/img/remera_verde.jpg',
        desc: 'Algodón 100% · Talles S–XL',
        sale: true
      },
      {
        id: 'p2',
        title: 'Mochila urbana',
        price: 32000,
        category: 'Accesorios',
        img: 'assets/img/mochila.jpg',
        desc: 'Impermeable · 20L · Garantía 6 meses'
      },
      {
        id: 'p3',
        title: 'Mate cerámico esmaltado',
        price: 35000,
        category: 'Artesanías',
        img: 'assets/img/mate.jpg',
        desc: 'Hecho a mano · Pieza única'
      },
      {
        id: 'p4',
        title: 'Buzo oversize arena',
        price: 19900,
        category: 'Ropa',
        img: 'assets/img/buzo_os_arena.jpg',
        desc: 'Frisa suave · Talles S–XL'
      },
      {
        id: 'p5',
        title: 'Gorra snapback negra',
        price: 7900,
        category: 'Accesorios',
        img: 'assets/img/gorra_negra_fe.jpg',
        desc: 'Ajustable · Unisex'
      },
      {
        id: 'p6',
        title: 'Vela de soja cítrica',
        price: 5200,
        category: 'Artesanías',
        img: 'assets/img/vela_soja_citric.jpg',
        desc: 'Aroma natural · 200 ml'
      }
    ];
    // ============================================

    // UTILIDADES
    const $ = (s)=>document.querySelector(s);
    const $$ = (s)=>document.querySelectorAll(s);
    const fmtMoney = (n)=> new Intl.NumberFormat('es-AR', { style:'currency', currency: CURRENCY, maximumFractionDigits:0 }).format(n);
    const norm = (str)=> (str||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

    // Año dinámico
    $('#y').textContent = new Date().getFullYear();

    // Reveal on scroll
    const onScroll = () => { $$('.reveal').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight - 100) el.classList.add('show'); }); };
    document.addEventListener('scroll', onScroll); onScroll();

    // Render de productos
    function renderGrid(items){
      const grid = $('#grid');
      grid.innerHTML = '';
      if(!items.length){
        grid.innerHTML = '<div class="col-12"><div class="alert alert-warning">No se encontraron productos con ese criterio.</div></div>';
        return;
      }
      const frag = document.createDocumentFragment();
      items.forEach(p=>{
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4 reveal';
        col.innerHTML = `
          <article class="card-product h-100">
            ${p.sale ? '<span class="badge-sale">-20%</span>' : ''}
            <img src="${p.img}" alt="${p.title}" loading="lazy" decoding="async">
            <div class="p-3 p-md-4">
              <h3 class="h5 mb-1">${p.title}</h3>
              <p class="small text-muted mb-2">${p.desc||''}</p>
              <div class="d-flex align-items-center justify-content-between">
                <span class="price h5 mb-0">${fmtMoney(p.price)}</span>
                <div class="btn-group">
                  <a class="btn btn-sm btn-outline-success" href="${buyLink(p)}" target="_blank" rel="noopener">Comprar</a>
                  <button class="btn btn-sm btn-outline-secondary" type="button" data-action="ver" data-id="${p.id}">Ver</button>
                </div>
              </div>
            </div>
          </article>`;
        frag.appendChild(col);
      });
      grid.appendChild(frag);
      onScroll(); // animación para lo recién agregado
    }

    function buyLink(p){
      const text = encodeURIComponent(`Hola! Quiero comprar "${p.title}". ¿Disponibilidad?`);
      return `https://wa.me/${WHATSAPP_TEL}?text=${text}`;
    }

    // Búsqueda + filtros
    let activeCat = 'all';
    function applyFilters(){
      const term = norm($('#q').value);
      const filtered = PRODUCTS.filter(p=>{
        const byCat = (activeCat === 'all') || (p.category === activeCat);
        const hayTerm = !term || norm(p.title).includes(term) || norm(p.desc).includes(term);
        return byCat && hayTerm;
      });
      renderGrid(filtered);
    }

    $$('.filters .btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        $$('.filters .btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        activeCat = b.dataset.cat;
        applyFilters();
      });
    });

    $('#q').addEventListener('input', applyFilters);
    $('#ctaGeneral').addEventListener('click', (e)=>{
      e.preventDefault();
      window.open(`https://wa.me/${WHATSAPP_TEL}?text=${encodeURIComponent('Hola! Quiero hacer una compra.')}`, '_blank');
    });

    // Modal de producto
    const modalEl = document.getElementById('productModal');
    const modal = new bootstrap.Modal(modalEl);
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-action="ver"]');
      if(!btn) return;
      const id = btn.dataset.id;
      const p = PRODUCTS.find(x=>x.id===id);
      if(!p) return;
      $('#m_img').src = p.img;
      $('#m_img').alt = p.title;
      $('#m_title').textContent = p.title;
      $('#m_price').textContent = fmtMoney(p.price);
      $('#m_desc').textContent = p.desc || '';
      $('#m_buy').href = buyLink(p);
      $('#m_share').onclick = async ()=>{
        try{
          if(navigator.share){
            await navigator.share({ title:p.title, text:p.desc||'', url: location.href });
          }else{
            alert('Compartir no soportado por este navegador.');
          }
        }catch(_){/* cancelado */}
      };
      modal.show();
    });

    // Inicialización
    renderGrid(PRODUCTS);
    applyFilters();

function matchHeight() {
    const prevDiv = document.querySelector('.prev-div');
    const targetImg = document.querySelector('.target-img');
    if (prevDiv && targetImg) {
        targetImg.style.height = prevDiv.offsetHeight + 'px';
    }
}
window.addEventListener('load', matchHeight);
window.addEventListener('resize', matchHeight);
