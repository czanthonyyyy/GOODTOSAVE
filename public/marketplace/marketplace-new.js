/**
 * Marketplace JavaScript - New Cart System
 * Works with the new app-cart web component
 */

class MarketplaceManager {
    constructor() {
        this.products = [
            {
                id: 'kings-box',
                title: "King's box",
                price: 2.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Burger+King"
            },
            {
                id: 'smile-enjoy',
                title: "Smile and Enjoy",
                price: 3.15,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=McDonald's"
            },
            {
                id: 'tasssty-box',
                title: "Tasssty box",
                price: 3.00,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Krispy+Kreme"
            },
            {
                id: 'taco-box',
                title: "Taco Box",
                price: 2.45,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Taco+Bell"
            },
            {
                id: 'totumas',
                title: "Totumas",
                price: 3.25,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Las+Totumas"
            },
            {
                id: 'meat-more',
                title: "Meat and more",
                price: 5.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Brazzeiro"
            },
            {
                id: 'full-breakfast',
                title: "Full breakfast",
                price: 4.00,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=En+La+Fonda"
            },
            {
                id: 'delicious-box',
                title: "Delicious box",
                price: 2.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Sabroso+Panama"
            },
            {
                id: 'maranon-box',
                title: "Marañon box",
                price: 1.60,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Marañon"
            },
            {
                id: 'charged-meal',
                title: "Charged meal",
                price: 1.45,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=La+Fonda"
            },
            {
                id: 'panamanian-box',
                title: "Panamanian box",
                price: 2.10,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=El+Motete"
            },
            {
                id: 'endless-lunch',
                title: "Endless Lunch",
                price: 3.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Llenos+y+Carbon"
            },
            {
                id: 'pio-pio',
                title: "Pio Pio",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Pio+Pio"
            },
            {
                id: 'leonardo',
                title: "Leonardo",
                price: 2.90,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Leonardo"
            },
            {
                id: 'rio-oro',
                title: "Rio de oro",
                price: 6.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Rio+de+Oro"
            },
            {
                id: 'la-migueria',
                title: "La migueria",
                price: 2.10,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=La+Migueria"
            },
            {
                id: 'dominos-pizza',
                title: "Dominos Pizza",
                price: 3.75,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Domino's+Pizza"
            },
            {
                id: 'nacion-sushi',
                title: "Nacion Sushi",
                price: 2.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Nacion+Sushi"
            },
            {
                id: 'popeyes',
                title: "Popeyes",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Popeyes"
            },
            {
                id: 'subway',
                title: "Subway",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Subway"
            }
        ];
        
        this.init();
        this.loadProductsFromFirestore().catch(() => {});
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.updateProductButtons();
        this.setupSearchFunctionality();
    }

    async loadProductsFromFirestore() {
        try {
            const services = window.firebaseServices;
            if (!services || !services.db) return;

            const snapshot = await services.db.collection('products').orderBy('createdAt', 'desc').limit(100).get();
            const loaded = [];
            snapshot.forEach(doc => {
                const p = doc.data() || {};
                const id = p.id || doc.id;
                const title = p.title || p.name || 'Product';
                const price = typeof p.price === 'number' ? p.price : parseFloat(p.price || '0') || 0;
                const image = p.image || 'https://via.placeholder.com/200x160/39b54a/ffffff?text=Product';
                const category = p.category || 'local';
                loaded.push({ id, title, price, image, category });
            });

            if (!loaded.length) return;

            const existingIds = new Set(this.products.map(p => p.id));
            loaded.forEach(p => {
                if (!existingIds.has(p.id)) {
                    this.products.push({ id: p.id, title: p.title, price: p.price, image: p.image });
                    this.appendProductCard(p);
                }
            });

            this.updateProductButtons();
            this.applyFilters();
        } catch (e) {
            console.warn('No se pudieron cargar productos desde Firestore:', e);
        }
    }

    appendProductCard(p) {
        if (!this.container) return;
        const item = document.createElement('div');
        item.className = 'item';
        item.dataset.productId = p.id;
        item.dataset.category = p.category || 'local';
        item.innerHTML = `
            <span class="titulo-item">${p.title}</span>
            <img src="${p.image}" alt="${p.title}" class="img-item">
            <span class="precio-item">$${p.price.toFixed(2)}</span>
            <button class="boton-item">Add to cart</button>
        `;
        this.container.prepend(item);
    }

    cacheElements() {
        this.container = document.querySelector('.contenedor-items');
        this.searchInput = document.getElementById('product-search');
        this.sortSelect = document.getElementById('sort-select');
        this.filterPills = document.querySelectorAll('.filter-pill');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.searchBtn = document.querySelector('.search-btn');
    }

    setupEventListeners() {
        // Event delegation for add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('boton-item')) {
                this.addToCart(e);
            }
        });

        // Listen for cart updates
        document.addEventListener('cart-updated', () => {
            this.updateProductButtons();
        });

        // Search input events
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.applyFilters());
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Search button click
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }

        // Sort
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.applyFilters());
        }

        // Category filters
        if (this.filterPills && this.filterPills.length) {
            this.filterPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    this.filterPills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    this.applyFilters();
                    
                    // Add visual feedback
                    this.showFilterFeedback(pill);
                });
            });
        }

        // View toggle
        if (this.viewButtons && this.viewButtons.length) {
            this.viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.viewButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const view = btn.dataset.view;
                    if (this.container) {
                        if (view === 'compact') this.container.classList.add('compact');
                        else this.container.classList.remove('compact');
                    }
                    
                    // Add visual feedback
                    this.showViewToggleFeedback(btn);
                });
            });
        }
    }

    setupSearchFunctionality() {
        // Add search suggestions
        if (this.searchInput) {
            this.searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
            
            this.searchInput.addEventListener('blur', () => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => this.hideSearchSuggestions(), 200);
            });
        }
    }

    showSearchSuggestions() {
        // Create search suggestions dropdown
        let suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            suggestionsContainer.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                margin-top: 8px;
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            `;
            
            const searchContainer = document.querySelector('.hero-search-container');
            if (searchContainer) {
                searchContainer.style.position = 'relative';
                searchContainer.appendChild(suggestionsContainer);
            }
        }
        
        // Show suggestions based on current input
        const query = this.searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const suggestions = this.getSearchSuggestions(query);
            this.displaySearchSuggestions(suggestions, suggestionsContainer);
        }
    }

    getSearchSuggestions(query) {
        const suggestions = [];
        const categories = ['fast-food', 'bakery', 'pizza', 'sushi', 'chicken', 'local'];
        
        // Add category suggestions
        categories.forEach(category => {
            if (category.includes(query) || this.getCategoryDisplayName(category).toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'category',
                    text: this.getCategoryDisplayName(category),
                    value: category
                });
            }
        });
        
        // Add product suggestions
        this.products.forEach(product => {
            if (product.title.toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'product',
                    text: product.title,
                    value: product.id
                });
            }
        });
        
        return suggestions.slice(0, 8); // Limit to 8 suggestions
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'fast-food': 'Fast Food',
            'bakery': 'Bakery',
            'pizza': 'Pizza',
            'sushi': 'Sushi',
            'chicken': 'Chicken',
            'local': 'Local'
        };
        return categoryNames[category] || category;
    }

    displaySearchSuggestions(suggestions, container) {
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = '';
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.2s ease;
            `;
            
            const icon = document.createElement('i');
            icon.className = suggestion.type === 'category' ? 'ri-price-tag-3-line' : 'ri-restaurant-2-line';
            icon.style.color = '#39b54a';
            
            const text = document.createElement('span');
            text.textContent = suggestion.text;
            
            item.appendChild(icon);
            item.appendChild(text);
            
            item.addEventListener('click', () => {
                if (suggestion.type === 'category') {
                    this.selectCategory(suggestion.value);
                } else {
                    this.searchInput.value = suggestion.text;
                    this.applyFilters();
                }
                container.style.display = 'none';
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
            
            container.appendChild(item);
        });
        
        container.style.display = 'block';
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    selectCategory(category) {
        // Find and click the corresponding filter pill
        const pill = document.querySelector(`[data-category="${category}"]`);
        if (pill) {
            this.filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            this.applyFilters();
            this.showFilterFeedback(pill);
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (query.length > 0) {
            this.applyFilters();
            this.hideSearchSuggestions();
            
            // Add search feedback
            this.showSearchFeedback();
        }
    }

    showSearchFeedback() {
        const searchContainer = document.querySelector('.hero-search');
        const originalBackground = searchContainer.style.background;
        
        searchContainer.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        searchContainer.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            searchContainer.style.background = originalBackground;
            searchContainer.style.transform = '';
        }, 300);
    }

    showFilterFeedback(pill) {
        pill.style.transform = 'scale(1.05)';
        setTimeout(() => {
            pill.style.transform = '';
        }, 200);
    }

    showViewToggleFeedback(btn) {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }

    addToCart(event) {
        const button = event.target;
        const item = button.closest('.item');
        
        if (!item) return;

        const productId = item.dataset.productId;
        const title = item.querySelector('.titulo-item').textContent;
        const priceText = item.querySelector('.precio-item').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        const image = item.querySelector('.img-item').src;
        
        // Find product in our products array
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
            // Update product with real image
            product.image = image;
            
            // Get the cart component
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.addItem(product);
                
                // Show success feedback
                this.showAddToCartFeedback(button);
                
                // Open the cart automatically after 500ms
                setTimeout(() => {
                    if (cartComponent && !cartComponent.isOpen) {
                        cartComponent.openCart();
                        console.log('Cart opened automatically after adding product');
                    }
                }, 500);
            }
        }
    }

    // Enhanced filtering, searching and sorting
    applyFilters() {
        const query = (this.searchInput?.value || '').trim().toLowerCase();
        const activePill = document.querySelector('.filter-pill.active');
        const activeCategory = activePill ? activePill.dataset.category : 'all';
        const sort = this.sortSelect ? this.sortSelect.value : 'featured';

        const items = Array.from(document.querySelectorAll('.contenedor-items .item'));
        let visibleCount = 0;

        // Filter by search and category
        items.forEach(item => {
            const title = item.querySelector('.titulo-item')?.textContent.toLowerCase() || '';
            const category = item.dataset.category || 'all';
            const matchesQuery = !query || title.includes(query);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            if (matchesQuery && matchesCategory) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        this.showNoResultsMessage(visibleCount === 0);

        // Sorting visible items
        const visibleItems = items.filter(it => it.style.display !== 'none');
        const byText = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });
        
        visibleItems.sort((a, b) => {
            if (sort === 'price-asc' || sort === 'price-desc') {
                const pa = parseFloat(a.querySelector('.precio-item').textContent.replace('$',''));
                const pb = parseFloat(b.querySelector('.precio-item').textContent.replace('$',''));
                return sort === 'price-asc' ? pa - pb : pb - pa;
            }
            if (sort === 'az' || sort === 'za') {
                const ta = a.querySelector('.titulo-item').textContent.trim();
                const tb = b.querySelector('.titulo-item').textContent.trim();
                return sort === 'az' ? byText(ta, tb) : byText(tb, ta);
            }
            return 0; // featured: no change
        });

        // Re-append in new order
        if (this.container) {
            visibleItems.forEach(it => this.container.appendChild(it));
        }

        // Update results count
        this.updateResultsCount(visibleCount);
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #666;">
                    <i class="ri-search-line" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                    <h3 style="margin: 0 0 10px 0; color: #333;">No results found</h3>
                    <p style="margin: 0; color: #888;">Try different search terms or change the filters</p>
                </div>
            `;
            
            if (this.container) {
                this.container.appendChild(noResultsMsg);
            }
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    updateResultsCount(count) {
        // Commenting out this function to avoid showing the product counter
        // que no es necesario y causa problemas visuales
        return;
        
        /*
        let countElement = document.querySelector('.results-count');
        
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'results-count';
            countElement.style.cssText = `
                text-align: center;
                padding: 15px;
                color: #666;
                font-size: 14px;
                font-weight: 500;
            `;
            
            const controlsSection = document.querySelector('.catalog-controls');
            if (controlsSection) {
                controlsSection.appendChild(countElement);
            }
        }
        
        countElement.textContent = `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
        */
    }

    showAddToCartFeedback(button) {
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.textContent = 'Added!';
        button.style.background = '#27ae60';
        button.style.color = 'white';
        button.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
            button.style.color = '';
            button.style.transform = '';
        }, 1500);
    }

    updateProductButtons() {
        const cartComponent = document.querySelector('app-cart');
        if (!cartComponent) return;

        const cartItems = cartComponent.cartItems || [];
        
        this.products.forEach(product => {
            const itemElement = document.querySelector(`[data-product-id="${product.id}"]`);
            if (itemElement) {
                const button = itemElement.querySelector('.boton-item');
                const inCart = cartItems.some(item => item.id === product.id);
                
                if (inCart) {
                    button.textContent = 'In Cart';
                    button.style.background = '#27ae60';
                    button.style.color = 'white';
                } else {
                    button.textContent = 'Add to Cart';
                    button.style.background = '';
                    button.style.color = '';
                }
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MarketplaceManager();
    });
} else {
    new MarketplaceManager();
} 