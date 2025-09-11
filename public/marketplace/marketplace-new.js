/**
 * Marketplace JavaScript - Simplified Version
 * Ready for new product card system
 */

class MarketplaceManager {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupSearchFunctionality();
        this.setupCartIntegration();
        this.initializeProducts();
    }
    
    // Initialize products visibility
    initializeProducts() {
        const items = document.querySelectorAll('.item');
        
        items.forEach((item, index) => {
            // Ensure all items are visible initially
            item.classList.remove('hidden');
            item.style.display = 'flex';
            item.style.opacity = '1';
            item.style.visibility = 'visible';
            
            // Add a small delay for animation
            setTimeout(() => {
                item.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });
    }

    cacheElements() {
        this.searchInput = document.getElementById('product-search');
        this.sortSelect = document.getElementById('sort-select');
        this.filterPills = document.querySelectorAll('.filter-pill');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.searchBtn = document.querySelector('.search-btn');
    }

    setupEventListeners() {
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
                    this.toggleView(view);
                    
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
        // Simple visual feedback without changing transform
        pill.style.boxShadow = '0 6px 20px rgba(57, 181, 74, 0.4)';
        setTimeout(() => {
            pill.style.boxShadow = '';
        }, 300);
    }

    showViewToggleFeedback(btn) {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }

<<<<<<< HEAD
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
=======
    toggleView(view) {
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            console.log('Toggling view to:', view);
            if (view === 'list') {
                productsGrid.classList.add('list-view');
                console.log('Added list-view class');
            } else {
                productsGrid.classList.remove('list-view');
                console.log('Removed list-view class');
>>>>>>> c4d58f0a691a9850122899d238e342a5f669ed41
            }
            
            // Force reflow to ensure the change takes effect
            productsGrid.offsetHeight;
        } else {
            console.error('Products grid not found');
        }
    }

    // Product filtering and search functionality
    applyFilters() {
        const query = (this.searchInput?.value || '').trim().toLowerCase();
        const activePill = document.querySelector('.filter-pill.active');
        const activeCategory = activePill ? activePill.dataset.category : 'all';
        const sort = this.sortSelect ? this.sortSelect.value : 'featured';

        // Get all product items
        const items = document.querySelectorAll('.item');
        
        let visibleCount = 0;
        
        items.forEach(item => {
            const title = item.querySelector('.titulo-item')?.textContent.toLowerCase() || '';
            const category = item.dataset.category || '';
            
            let shouldShow = true;
            
            // Filter by category
            if (activeCategory !== 'all' && category !== activeCategory) {
                shouldShow = false;
            }
            
            // Filter by search query
            if (query && !title.includes(query)) {
                shouldShow = false;
            }
            
            // Show/hide item with smooth transition
            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.display = 'flex';
                item.style.opacity = '1';
                item.style.visibility = 'visible';
                item.style.transform = 'scale(1)';
                visibleCount++;
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                // Hide after transition
                setTimeout(() => {
                    if (item.classList.contains('hidden')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Update products count
        this.updateProductsCount(visibleCount, activeCategory);
        
        // Apply sorting only if there are visible items
        if (visibleCount > 0) {
            this.applySorting(sort);
        }
    }
    
    // Update products count display
    updateProductsCount(count, category) {
        const countElement = document.getElementById('products-count');
        const sortInfoElement = document.querySelector('.products-sort-info');
        
        if (countElement) {
            countElement.textContent = count;
        }
        
        if (sortInfoElement) {
            if (category === 'all') {
                sortInfoElement.textContent = 'Showing all products';
            } else {
                const categoryName = this.getCategoryDisplayName(category);
                sortInfoElement.textContent = `Showing ${categoryName} products`;
            }
        }
    }
    
    // Apply sorting to visible items
    applySorting(sort) {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        const items = Array.from(container.querySelectorAll('.item:not(.hidden)'));
        
        items.sort((a, b) => {
            const priceA = this.extractPrice(a.querySelector('.precio-item')?.textContent);
            const priceB = this.extractPrice(b.querySelector('.precio-item')?.textContent);
            const titleA = a.querySelector('.titulo-item')?.textContent.toLowerCase() || '';
            const titleB = b.querySelector('.titulo-item')?.textContent.toLowerCase() || '';
            
<<<<<<< HEAD
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
=======
            switch (sort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    // For now, just sort by title alphabetically
                    return titleA.localeCompare(titleB);
                case 'popular':
                    // For now, just sort by title alphabetically
                    return titleA.localeCompare(titleB);
                case 'featured':
                default:
                    return 0; // Keep original order
>>>>>>> c4d58f0a691a9850122899d238e342a5f669ed41
            }
        });
        
        // Re-append sorted items
        items.forEach(item => container.appendChild(item));
    }
    
    // Extract price from string (e.g., "$2.50" -> 2.50)
    extractPrice(priceString) {
        if (!priceString) return 0;
        const match = priceString.match(/\$?(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }
    
    // Setup cart functionality for product cards
    setupCartIntegration() {
        // Add event listeners to all "Add to cart" buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('boton-item')) {
                e.preventDefault();
                this.addProductToCart(e.target);
            }
        });
    }
    
    // Add product to cart
    addProductToCart(button) {
        const item = button.closest('.item');
        if (!item) return;
        
        // Get product data
        const title = item.querySelector('.titulo-item')?.textContent || '';
        const price = this.extractPrice(item.querySelector('.precio-item')?.textContent);
        const image = item.querySelector('.img-item')?.src || '';
        const category = item.dataset.category || '';
        
        // Create product object
        const product = {
            id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: title,
            supplier: this.getSupplierFromCategory(category),
            image: image,
            originalPrice: price,
            discountedPrice: price
        };
        
        // Add to cart if cart system is available
        if (typeof window.addToCart === 'function') {
            window.addToCart({ id: product.id, title: product.title, price: product.discountedPrice, image: product.image });
            if (typeof window.openCart === 'function') window.openCart();
        } else if (window.ShoppingCart) {
            window.ShoppingCart.addItem(product, 1);
            document.dispatchEvent(new CustomEvent('show-cart'));

            const originalText = button.textContent;
            button.textContent = 'Added ✓';
            button.disabled = true;
            button.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        } else if (document.querySelector('app-cart')) {
            const wc = document.querySelector('app-cart');
            wc.addItem({ id: product.id, title: product.title, price: product.discountedPrice, image: product.image });
            wc.openCart();
        } else {
            console.warn('Shopping cart not available');
        }
    }
    
    // Debug method to check all elements
    debugElements() {
        console.log('=== DEBUG INFO ===');
        console.log('Search input:', this.searchInput);
        console.log('Sort select:', this.sortSelect);
        console.log('Filter pills:', this.filterPills.length);
        console.log('View buttons:', this.viewButtons.length);
        console.log('Products grid:', document.getElementById('products-grid'));
        console.log('All items:', document.querySelectorAll('.item').length);
        console.log('Visible items:', document.querySelectorAll('.item:not(.hidden)').length);
        console.log('==================');
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