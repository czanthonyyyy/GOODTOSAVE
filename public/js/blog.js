// Blog data and rendering
(function() {
    const ARTICLES = [
        {
            title: 'Reduce Food Waste at Home',
            slug: 'reduce-food-waste-at-home',
            date: '2025-02-15',
            categories: ['Home', 'Sustainability'],
            excerpt: 'Simple actions to plan your shopping, store better, and turn leftovers into easy meals.',
            image: '../assets/img/card_img.png'
        },
        {
            title: 'Good to Save Marketplace Guide',
            slug: 'marketplace-guide',
            date: '2025-02-22',
            categories: ['Marketplace', 'Savings'],
            excerpt: 'Step-by-step guide to find offers, follow providers, and make the most of opportunities.',
            image: '../assets/img/card_img.png'
        },
        {
            title: 'Sustainable Providers: Our Selection Criteria',
            slug: 'sustainable-providers',
            date: '2025-03-02',
            categories: ['Sustainability', 'Community'],
            excerpt: 'Quality, safety, and environmental criteria we require from our partners.',
            image: '../assets/img/card_img.png'
        },
        {
            title: 'Understanding Date Labels: Expiration vs Best Before',
            slug: 'understanding-date-labels',
            date: '2025-03-10',
            categories: ['Education', 'Home'],
            excerpt: 'Learn the difference and avoid throwing away food that is still perfectly fine.',
            image: '../assets/img/card_img.png'
        },
        {
            title: 'Family Savings with Good to Save',
            slug: 'family-savings-with-gts',
            date: '2025-03-18',
            categories: ['Savings', 'Community'],
            excerpt: 'Real stories of families reducing monthly expenses while supporting local businesses.',
            image: '../assets/img/card_img.png'
        },
        {
            title: 'Zero-Waste Recipes',
            slug: 'zero-waste-recipes',
            date: '2025-03-25',
            categories: ['Recipes', 'Home'],
            excerpt: 'Practical ideas to turn leftovers into delicious and nutritious meals.',
            image: '../assets/img/card_img.png'
        }
    ];

    function formatDate(iso) {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) { return iso; }
    }

    function renderCategories() {
        const all = new Set();
        ARTICLES.forEach(a => a.categories.forEach(c => all.add(c)));
        const container = document.getElementById('dynamic-categories');
        if (!container) return;
        container.innerHTML = '';
        [...all].sort().forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-pill';
            btn.textContent = cat;
            btn.dataset.category = cat;
            container.appendChild(btn);
        });
    }

    function renderArticles(filterText = '', category = 'all') {
        const grid = document.getElementById('articles-grid');
        const empty = document.getElementById('no-results');
        if (!grid) return;

        const normalized = filterText.trim().toLowerCase();
        const filtered = ARTICLES.filter(a => {
            const matchesText = !normalized || (
                a.title.toLowerCase().includes(normalized) ||
                a.excerpt.toLowerCase().includes(normalized) ||
                a.categories.join(' ').toLowerCase().includes(normalized)
            );
            const matchesCat = category === 'all' || a.categories.includes(category);
            return matchesText && matchesCat;
        });

        grid.innerHTML = '';
        filtered.forEach(a => {
            const card = document.createElement('article');
            card.className = 'article-card';
            card.innerHTML = `
                <img class="article-thumb" src="${a.image}" alt="${a.title}">
                <div class="article-content">
                    <h3 class="article-title">${a.title}</h3>
                    <p class="article-excerpt">${a.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">${formatDate(a.date)}</span>
                        <div class="badge-list">${a.categories.map(c => `<span class="badge">${c}</span>`).join('')}</div>
                    </div>
                    <a class="btn btn-outline" href="blog/${a.slug}.html">Read more</a>
                </div>
            `;
            grid.appendChild(card);
        });

        if (empty) {
            empty.hidden = filtered.length !== 0;
        }
    }

    function setupInteractions() {
        const search = document.getElementById('blog-search');
        const container = document.querySelector('.categories');

        let currentCategory = 'all';
        let currentSearch = '';

        if (search) {
            search.addEventListener('input', (e) => {
                currentSearch = e.target.value || '';
                renderArticles(currentSearch, currentCategory);
            });
        }

        if (container) {
            container.addEventListener('click', (e) => {
                const btn = e.target.closest('button.category-pill');
                if (!btn) return;
                currentCategory = btn.dataset.category || 'all';
                container.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderArticles(currentSearch, currentCategory);
            });
        }
    }

    // init
    document.addEventListener('DOMContentLoaded', function() {
        renderCategories();
        setupInteractions();
        renderArticles();
    });
})();



