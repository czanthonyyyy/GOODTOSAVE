// Home initializations - OPTIMIZADO PARA RENDIMIENTO
document.addEventListener('DOMContentLoaded', () => {
    // Personalized greeting if session exists - SIMPLIFICADO
    try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
            const u = JSON.parse(rawUser);
            const sub = document.querySelector('.hero-subtitle');
            if (sub && u) {
                const name = (u.displayName || u.email || 'there').split('@')[0];
                sub.innerHTML = `Welcome back, <span class="highlight-name">${name}</span>. Pick your next deal.`;
            }
        }
    } catch {}

    // Cargar productos destacados de forma asíncrona y optimizada
    setTimeout(() => {
        loadTrendingProducts();
    }, 100);

    // Inicializar FAQ de forma simple
    initFaq();
});

// Función optimizada para cargar productos destacados
async function loadTrendingProducts() {
    try {
        const res = await fetch('/assets/data/products.json');
        const data = await res.json();
        const picks = (data.products || []).slice(0, 4).map(p => ({
            id: p.id,
            title: p.title,
            price: p.discountedPrice || p.originalPrice || 0,
            image: p.image && !p.image.startsWith('data:') ? p.image : '../assets/articles/image.png'
        }));

        const grid = document.getElementById('trending-grid');
        if (!grid) return;

        grid.innerHTML = picks.map(p => `
            <div class="featured-card" role="listitem">
                <div class="featured-image-wrap">
                    <img src="${p.image}" alt="${p.title} - featured deal" loading="lazy"/>
                </div>
                <div class="featured-body">
                    <h3 class="featured-title">${p.title}</h3>
                    <div class="featured-price">$${Number(p.price).toFixed(2)}</div>
                    <a href="../marketplace/marketplace.html" class="btn btn-outline" aria-label="View deal ${p.title}">View deal</a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        // Fallback simple en caso de error
        const grid = document.getElementById('trending-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="featured-card" role="listitem">
                    <div class="featured-image-wrap">
                        <img src="../assets/articles/image.png" alt="Featured deal" loading="lazy"/>
                    </div>
                    <div class="featured-body">
                        <h3 class="featured-title">Deal</h3>
                        <div class="featured-price">$0.00</div>
                        <a href="../marketplace/marketplace.html" class="btn btn-outline" aria-label="View deals">View deals</a>
                    </div>
                </div>
            `;
        }
    }
}

// FAQ accordion simplificado
function initFaq() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.faq-question');
        if (!btn) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        const ans = btn.nextElementSibling;
        if (ans) ans.classList.toggle('open', !open);
    });
}


