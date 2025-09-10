(function(){
  let currentUser = null;
  let currentProductId = null;

  function getAuthServices() {
    return window.firebaseServices || {};
  }

  function getUserFromStorage() {
    try { 
      const raw = localStorage.getItem('user'); 
      return raw ? JSON.parse(raw) : null; 
    } catch(e){ 
      return null; 
    }
  }

  function initialsFrom(nameLike) {
    const str = (nameLike || '').trim();
    if (!str) return 'U';
    const parts = str.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  async function ensureSessionOrRedirect() {
    const { auth } = getAuthServices();
    const stored = getUserFromStorage();
    if (auth && auth.currentUser) return auth.currentUser;
    if (stored && stored.uid) return stored;
    window.location.href = '../auth/auth.html';
  }

  async function fetchUserDoc(uid) {
    const { db } = getAuthServices();
    if (!db) return null;
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists ? doc.data() : null;
    } catch (e) {
      console.error('Error fetching user doc:', e);
      return null;
    }
  }

  async function fetchProviderProducts(uid) {
    const { db } = getAuthServices();
    if (!db) return [];
    try {
      const snap = await db.collection('products').where('providerId', '==', uid).orderBy('createdAt', 'desc').get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error('Error fetching products:', e);
      return [];
    }
  }

  async function fetchProviderSales(uid) {
    const { db } = getAuthServices();
    if (!db) return [];
    try {
      // Buscar órdenes que contengan productos del proveedor
      const products = await fetchProviderProducts(uid);
      const productIds = products.map(p => p.id);
      
      if (productIds.length === 0) return [];

      const ordersSnap = await db.collection('orders').get();
      const orders = [];
      
      ordersSnap.docs.forEach(doc => {
        const order = { id: doc.id, ...doc.data() };
        if (order.items && Array.isArray(order.items)) {
          const providerItems = order.items.filter(item => productIds.includes(item.id));
          if (providerItems.length > 0) {
            orders.push({
              ...order,
              providerItems,
              providerTotal: providerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            });
          }
        }
      });
      
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      console.error('Error fetching sales:', e);
      return [];
    }
  }

  function renderProductsTable(products, page = 1, pageSize = 10) {
    const container = document.getElementById('products-content');
    if (!container) return;
    
    if (!products.length) {
      container.innerHTML = '<div class="products-empty">No products yet. Add your first product!</div>';
      return;
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageProducts = products.slice(startIndex, endIndex);

    const rows = pageProducts.map(p => {
      const price = (typeof p.price === 'number' ? p.price : parseFloat(p.price || 0)).toFixed(2);
      const status = (p.status || 'active').toLowerCase();
      const statusClass = status === 'active' ? 'status-active' : 'status-inactive';
      const image = p.image ? `<img src="${p.image}" alt="${p.title}" class="product-image">` : '<div class="product-image"></div>';
      
      return `<tr>
        <td>${image}</td>
        <td>${p.title || 'Untitled'}</td>
        <td>${p.category || 'local'}</td>
        <td><span class="pill-price">$${price}</span></td>
        <td><span class="status ${statusClass}">${status.toUpperCase()}</span></td>
        <td>
          <button class="btn" onclick="editProduct('${p.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">Delete</button>
        </td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table class="products-table">
        <thead>
          <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderSalesTable(sales, page = 1, pageSize = 10) {
    const container = document.getElementById('sales-content');
    if (!container) return;
    
    if (!sales.length) {
      container.innerHTML = '<div class="products-empty">No sales yet.</div>';
      return;
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageSales = sales.slice(startIndex, endIndex);

    const rows = pageSales.map(s => {
      const created = s.createdAt ? new Date(s.createdAt).toLocaleString() : '-';
      const status = (s.status || 'completed').toLowerCase();
      const statusClass = status === 'completed' ? 'status-active' : 'status-inactive';
      const total = s.providerTotal ? s.providerTotal.toFixed(2) : '0.00';
      const itemsText = s.providerItems ? s.providerItems.map(it => it.title).slice(0,2).join(', ') : '-';
      
      return `<tr>
        <td>${s.id || '-'}</td>
        <td>${created}</td>
        <td><span class="status ${statusClass}">${status.toUpperCase()}</span></td>
        <td class="pill-price">$${total}</td>
        <td title="${itemsText}">${itemsText}</td>
        <td><button class="btn" onclick="viewSaleDetail('${s.id}')">View Details</button></td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table class="sales-table">
        <thead>
          <tr><th>Order ID</th><th>Date</th><th>Status</th><th>Revenue</th><th>Items</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderMetrics(products, sales) {
    const elProducts = document.getElementById('m-products');
    const elSales = document.getElementById('m-sales');
    const elOrders = document.getElementById('m-orders');
    const elRevenue = document.getElementById('m-revenue');

    // Total products
    const activeProducts = products.filter(p => p.status === 'active').length;
    if (elProducts) elProducts.textContent = String(activeProducts);

    // Monthly sales
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlySales = sales.filter(s => new Date(s.createdAt) >= thisMonth);
    const monthlyTotal = monthlySales.reduce((sum, s) => sum + (s.providerTotal || 0), 0);
    if (elSales) elSales.textContent = `$${monthlyTotal.toFixed(2)}`;

    // Total orders
    if (elOrders) elOrders.textContent = String(sales.length);

    // Total revenue
    const totalRevenue = sales.reduce((sum, s) => sum + (s.providerTotal || 0), 0);
    if (elRevenue) elRevenue.textContent = `$${totalRevenue.toFixed(2)}`;
  }

  function bindProductsFilters(allProducts) {
    const search = document.getElementById('products-search');
    const statusSel = document.getElementById('products-status');
    
    const apply = () => {
      const q = (search?.value || '').toLowerCase();
      const st = statusSel?.value || 'all';
      const filtered = allProducts.filter(p => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const categoryMatch = (p.category || '').toLowerCase().includes(q);
        const statusOk = st === 'all' || (p.status || 'active').toLowerCase() === st;
        return (titleMatch || categoryMatch) && statusOk;
      });
      renderProductsTable(filtered);
    };
    
    search?.addEventListener('input', apply);
    statusSel?.addEventListener('change', apply);
    apply();
  }

  function bindSalesFilters(allSales) {
    const search = document.getElementById('sales-search');
    const statusSel = document.getElementById('sales-status');
    
    const apply = () => {
      const q = (search?.value || '').toLowerCase();
      const st = statusSel?.value || 'all';
      const filtered = allSales.filter(s => {
        const idMatch = (s.id || '').toLowerCase().includes(q);
        const items = s.providerItems ? s.providerItems.map(it => it.title?.toLowerCase() || '').join(' ') : '';
        const itemsMatch = items.includes(q);
        const statusOk = st === 'all' || (s.status || 'completed').toLowerCase() === st;
        return (idMatch || itemsMatch) && statusOk;
      });
      renderSalesTable(filtered);
    };
    
    search?.addEventListener('input', apply);
    statusSel?.addEventListener('change', apply);
    apply();
  }

  async function createProduct(productData) {
    const { db } = getAuthServices();
    if (!db || !currentUser) throw new Error('Firestore not available');

    const data = {
      ...productData,
      providerId: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('products').add(data);
    return { id: docRef.id, ...data };
  }

  async function updateProduct(productId, productData) {
    const { db } = getAuthServices();
    if (!db) throw new Error('Firestore not available');

    const data = {
      ...productData,
      updatedAt: new Date().toISOString()
    };

    await db.collection('products').doc(productId).update(data);
    return { id: productId, ...data };
  }

  async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { db } = getAuthServices();
    if (!db) throw new Error('Firestore not available');

    await db.collection('products').doc(productId).delete();
    await renderDashboard();
  }

  function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    if (product) {
      title.textContent = 'Edit Product';
      currentProductId = product.id;
      document.getElementById('product-title').value = product.title || '';
      document.getElementById('product-description').value = product.description || '';
      document.getElementById('product-price').value = product.price || '';
      document.getElementById('product-category').value = product.category || 'local';
      document.getElementById('product-image').value = product.image || '';
      document.getElementById('product-status').value = product.status || 'active';
    } else {
      title.textContent = 'Add New Product';
      currentProductId = null;
      form.reset();
    }
    
    modal.classList.add('show');
  }

  function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
    currentProductId = null;
  }

  function openEditModal(prefill) {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    document.getElementById('edit-firstName').value = prefill.firstName || '';
    document.getElementById('edit-lastName').value = prefill.lastName || '';
    document.getElementById('edit-phone').value = prefill.phone || '';
    document.getElementById('edit-location').value = prefill.location || '';
    modal.classList.add('show');
  }

  function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.classList.remove('show');
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? '-';
  }

  function formatDate(iso) {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString(); } catch(e){ return iso; }
  }

  async function updateUserProfile(uid, updates) {
    const { db, auth } = getAuthServices();
    if (!db) throw new Error('Firestore not available');

    const payload = { ...updates, updatedAt: new Date().toISOString() };
    await db.collection('users').doc(uid).set(payload, { merge: true });

    try {
      if (auth?.currentUser && (updates.firstName || updates.lastName)) {
        const displayName = `${updates.firstName ?? ''} ${updates.lastName ?? ''}`.trim();
        if (displayName) {
          await auth.currentUser.updateProfile({ displayName });
        }
      }
    } catch(e) { console.warn('Could not update displayName:', e); }
  }

  async function renderDashboard() {
    currentUser = await ensureSessionOrRedirect();
    if (!currentUser) return;

    const profileName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    setText('name', profileName);
    setText('email', currentUser.email || '-');
    const avatar = document.getElementById('avatar');
    if (avatar) avatar.textContent = initialsFrom(profileName);

    // User data from Firestore
    const userDoc = await fetchUserDoc(currentUser.uid) || {};
    setText('accountType', userDoc.accountType || 'Provider');
    setText('location', userDoc.location || '-');
    setText('createdAt', formatDate(userDoc.createdAt));
    setText('updatedAt', formatDate(userDoc.updatedAt));

    // Fetch data
    const products = await fetchProviderProducts(currentUser.uid);
    const sales = await fetchProviderSales(currentUser.uid);

    // Render metrics
    renderMetrics(products, sales);

    // Render tables
    renderProductsTable(products);
    renderSalesTable(sales);

    // Bind filters
    bindProductsFilters(products);
    bindSalesFilters(sales);

    // Event listeners
    setupEventListeners(userDoc);
  }

  function setupEventListeners(userDoc) {
    // Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          const { auth } = getAuthServices();
          if (auth?.signOut) await auth.signOut();
        } catch (e) {}
        localStorage.removeItem('user');
        window.location.href = '../pages/index.html';
      });
    }

    // Edit profile
    const editBtn = document.getElementById('edit-profile');
    const editClose = document.getElementById('edit-close');
    const editCancel = document.getElementById('edit-cancel');
    const editForm = document.getElementById('edit-form');

    editBtn?.addEventListener('click', () => openEditModal({
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      phone: userDoc.phone,
      location: userDoc.location
    }));

    editClose?.addEventListener('click', closeEditModal);
    editCancel?.addEventListener('click', closeEditModal);

    editForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updates = {
        firstName: document.getElementById('edit-firstName').value.trim(),
        lastName: document.getElementById('edit-lastName').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
        location: document.getElementById('edit-location').value.trim()
      };

      try {
        await updateUserProfile(currentUser.uid, updates);
        const newDisplayName = `${updates.firstName} ${updates.lastName}`.trim();
        setText('name', newDisplayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
        if (document.getElementById('avatar')) {
          document.getElementById('avatar').textContent = initialsFrom(newDisplayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
        }
        setText('location', updates.location);
        setText('updatedAt', formatDate(new Date().toISOString()));

        const stored = getUserFromStorage() || {};
        localStorage.setItem('user', JSON.stringify({
          ...stored,
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: newDisplayName || stored.displayName || currentUser.displayName || ''
        }));

        const headerAuth = document.querySelector('app-header-auth');
        if (headerAuth && headerAuth.populateUser) headerAuth.populateUser();

        closeEditModal();
        alert('Profile updated successfully!');
      } catch (err) {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile');
      }
    });

    // Add product
    const addProductBtn = document.getElementById('add-product');
    addProductBtn?.addEventListener('click', () => openProductModal());

    // Product form
    const productForm = document.getElementById('product-form');
    productForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const productData = {
        title: document.getElementById('product-title').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        price: parseFloat(document.getElementById('product-price').value) || 0,
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value.trim(),
        status: document.getElementById('product-status').value
      };

      try {
        if (currentProductId) {
          await updateProduct(currentProductId, productData);
          alert('Product updated successfully!');
        } else {
          await createProduct(productData);
          alert('Product created successfully!');
        }
        
        closeProductModal();
        await renderDashboard();
      } catch (err) {
        console.error('Failed to save product:', err);
        alert('Failed to save product');
      }
    });

    // Image preview
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    imageInput?.addEventListener('input', () => {
      const url = imageInput.value.trim();
      if (url) {
        imagePreview.src = url;
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
    });

    // Tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });

    // Export buttons
    document.getElementById('export-products')?.addEventListener('click', () => {
      exportToCSV(products, 'products');
    });

    document.getElementById('export-sales')?.addEventListener('click', () => {
      exportToCSV(sales, 'sales');
    });
  }

  function exportToCSV(data, type) {
    if (!data.length) {
      alert(`No ${type} to export`);
      return;
    }

    let headers, rows;
    
    if (type === 'products') {
      headers = ['ID', 'Title', 'Description', 'Price', 'Category', 'Status', 'Created At'];
      rows = data.map(p => [
        p.id,
        p.title || '',
        p.description || '',
        p.price || 0,
        p.category || '',
        p.status || '',
        p.createdAt || ''
      ]);
    } else {
      headers = ['Order ID', 'Date', 'Status', 'Revenue', 'Items'];
      rows = data.map(s => [
        s.id || '',
        s.createdAt ? new Date(s.createdAt).toLocaleString() : '',
        s.status || '',
        s.providerTotal || 0,
        s.providerItems ? s.providerItems.map(it => it.title).join('; ') : ''
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Global functions for onclick handlers
  window.editProduct = async (productId) => {
    const { db } = getAuthServices();
    if (!db) return;
    
    try {
      const doc = await db.collection('products').doc(productId).get();
      if (doc.exists) {
        openProductModal({ id: doc.id, ...doc.data() });
      }
    } catch (e) {
      console.error('Error fetching product:', e);
      alert('Error loading product');
    }
  };

  window.deleteProduct = deleteProduct;
  window.closeProductModal = closeProductModal;
  window.closeEditModal = closeEditModal;
  window.viewSaleDetail = (orderId) => {
    // Implement sale detail view if needed
    alert(`Viewing details for order ${orderId}`);
  };

  // Initialize dashboard
  document.addEventListener('DOMContentLoaded', renderDashboard);
})();
