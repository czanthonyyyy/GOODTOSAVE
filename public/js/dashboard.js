(function(){
  function getAuthServices() {
    return window.firebaseServices || {};
  }

  function getUserFromStorage() {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch(e){ return null; }
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
    if (auth && auth.currentUser) return auth.currentUser; // live session
    if (stored && stored.uid) return stored; // fallback
    // No session -> go to auth
    window.location.href = 'auth.html';
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

  async function fetchUserOrders(uid) {
    // Strategy: prefer Firestore collection `orders` by uid; fallback to localStorage snapshots
    const { db } = getAuthServices();
    let orders = [];
    try {
      if (db) {
        const snap = await db.collection('orders').where('uid','==',uid).orderBy('createdAt','desc').limit(100).get();
        orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) { console.warn('No Firestore orders or query failed:', e); }

    // Fallback: localStorage last orders history (client-side only demo)
    if (!orders.length) {
      try {
        // Try the new user-specific history key first
        const historyKey = `orders_history_${uid}`;
        const historyRaw = localStorage.getItem(historyKey);
        if (historyRaw) {
          const hist = JSON.parse(historyRaw);
          orders = Array.isArray(hist) ? hist : [];
        } else {
          // Fallback to old format
          const historyRaw = localStorage.getItem('orders_history');
          if (historyRaw) {
            const hist = JSON.parse(historyRaw);
            orders = Array.isArray(hist?.[uid]) ? hist[uid] : [];
          } else {
            // Also consider lastOrder snapshot as a single recent order
            const last = localStorage.getItem('lastOrder');
            if (last) {
              const lo = JSON.parse(last);
              orders = [{ id: 'LOCAL-' + Date.now(), status: 'paid', total: lo.total, items: lo.items, createdAt: lo.timestamp }];
            }
          }
        }
      } catch (e) {}
    }
    return orders;
  }

  function renderOrdersTable(orders, page = 1, pageSize = 10) {
    const container = document.getElementById('orders-content');
    if (!container) return;
    if (!orders.length) {
      container.innerHTML = '<div class="orders-empty">No orders yet</div>';
      document.getElementById('pagination').style.display = 'none';
      return;
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageOrders = orders.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orders.length / pageSize);

    const rows = pageOrders.map(o => {
      const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : '-';
      const status = (o.status || 'paid').toLowerCase();
      const statusClass = status === 'paid' ? 'status-paid' : (status === 'pending' ? 'status-pending' : '');
      const total = (typeof o.total === 'number' ? o.total : parseFloat(o.total || 0)).toFixed(2);
      const itemsText = Array.isArray(o.items) ? o.items.map(it => it.title).slice(0,2).join(', ') : '-';
      return `<tr>
        <td>${o.id || '-'}</td>
        <td>${created}</td>
        <td><span class="status ${statusClass}">${status.toUpperCase()}</span></td>
        <td class="pill-total">$${total}</td>
        <td title="${itemsText}">${itemsText}</td>
        <td><button class="btn" onclick="showOrderDetail('${o.id}')">View Details</button></td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table class="orders-table" id="orders-table">
        <thead>
          <tr><th>Order ID</th><th>Date</th><th>Status</th><th>Total</th><th>Items</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    // Update pagination
    const pagination = document.getElementById('pagination');
    if (totalPages > 1) {
      pagination.style.display = 'flex';
      document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
      document.getElementById('prev-page').disabled = page <= 1;
      document.getElementById('next-page').disabled = page >= totalPages;
    } else {
      pagination.style.display = 'none';
    }
  }

  function bindOrdersFilters(allOrders) {
    const search = document.getElementById('orders-search');
    const statusSel = document.getElementById('orders-status');
    let currentPage = 1;
    
    const apply = () => {
      const q = (search?.value || '').toLowerCase();
      const st = statusSel?.value || 'all';
      const filtered = allOrders.filter(o => {
        const idMatch = (o.id || '').toLowerCase().includes(q);
        const items = Array.isArray(o.items) ? o.items.map(it => it.title?.toLowerCase() || '').join(' ') : '';
        const itemsMatch = items.includes(q);
        const statusOk = st === 'all' || (o.status || 'paid').toLowerCase() === st;
        return (idMatch || itemsMatch) && statusOk;
      });
      currentPage = 1; // Reset to first page when filtering
      renderOrdersTable(filtered, currentPage);
    };
    
    search?.addEventListener('input', apply);
    statusSel?.addEventListener('change', apply);
    
    // Pagination controls
    document.getElementById('prev-page')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        const filtered = getCurrentFilteredOrders(allOrders, search?.value, statusSel?.value);
        renderOrdersTable(filtered, currentPage);
      }
    });
    
    document.getElementById('next-page')?.addEventListener('click', () => {
      const filtered = getCurrentFilteredOrders(allOrders, search?.value, statusSel?.value);
      const totalPages = Math.ceil(filtered.length / 10);
      if (currentPage < totalPages) {
        currentPage++;
        renderOrdersTable(filtered, currentPage);
      }
    });
    
    apply();
  }

  function getCurrentFilteredOrders(allOrders, searchValue, statusValue) {
    const q = (searchValue || '').toLowerCase();
    const st = (statusValue || 'all');
    return allOrders.filter(o => {
      const idMatch = (o.id || '').toLowerCase().includes(q);
      const items = Array.isArray(o.items) ? o.items.map(it => it.title?.toLowerCase() || '').join(' ') : '';
      const itemsMatch = items.includes(q);
      const statusOk = st === 'all' || (o.status || 'paid').toLowerCase() === st;
      return (idMatch || itemsMatch) && statusOk;
    });
  }

  function exportToCSV(orders) {
    if (!orders.length) {
      alert('No orders to export');
      return;
    }

    const headers = ['Order ID', 'Date', 'Status', 'Total', 'Items'];
    const csvContent = [
      headers.join(','),
      ...orders.map(o => {
        const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : '-';
        const status = (o.status || 'paid').toLowerCase();
        const total = (typeof o.total === 'number' ? o.total : parseFloat(o.total || 0)).toFixed(2);
        const itemsText = Array.isArray(o.items) ? o.items.map(it => it.title).join('; ') : '-';
        return [o.id || '-', created, status, total, itemsText].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showOrderDetail(orderId) {
    const orders = getCurrentFilteredOrders(window.allOrders || [], 
      document.getElementById('orders-search')?.value, 
      document.getElementById('orders-status')?.value);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      alert('Order not found');
      return;
    }

    const modal = document.getElementById('order-detail-modal');
    const body = document.getElementById('order-detail-body');
    
    const created = order.createdAt ? new Date(order.createdAt).toLocaleString() : '-';
    const status = (order.status || 'paid').toLowerCase();
    const total = (typeof order.total === 'number' ? order.total : parseFloat(order.total || 0)).toFixed(2);
    
    const itemsHtml = Array.isArray(order.items) ? order.items.map(item => `
      <div class="order-item">
        <span class="order-item-name">${item.title || 'Unknown Item'}</span>
        <span class="order-item-qty">x${item.quantity || 1}</span>
        <span class="order-item-price">$${(item.price || 0).toFixed(2)}</span>
      </div>
    `).join('') : '<div class="order-item"><span class="order-item-name">No items found</span></div>';

    body.innerHTML = `
      <div class="order-detail">
        <div class="order-detail-header">
          <div class="order-detail-title">Order #${order.id}</div>
          <button class="order-detail-close" onclick="closeOrderDetail()">✕</button>
        </div>
        <div class="order-detail-content">
          <div><strong>Date:</strong> ${created}</div>
          <div><strong>Status:</strong> <span class="status status-${status}">${status.toUpperCase()}</span></div>
          <div><strong>Total:</strong> <span class="pill-total">$${total}</span></div>
          <div style="margin-top: 12px;"><strong>Items:</strong></div>
          ${itemsHtml}
        </div>
      </div>
    `;
    
    modal.classList.add('show');
  }

  function closeOrderDetail() {
    const modal = document.getElementById('order-detail-modal');
    if (modal) modal.classList.remove('show');
  }

  function renderMetrics(orders) {
    const elOrders = document.getElementById('m-orders');
    const elSpent = document.getElementById('m-spent');
    const elLastTotal = document.getElementById('m-last-total');
    const elLastDate = document.getElementById('m-last-date');
    const elAvg = document.getElementById('m-avg');

    const totals = orders.map(o => (typeof o.total === 'number' ? o.total : parseFloat(o.total || 0)) || 0);
    const sum = totals.reduce((a,b)=>a+b,0);
    const count = orders.length;
    const avg = count ? sum / count : 0;
    const last = orders[0];
    if (elOrders) elOrders.textContent = String(count);
    if (elSpent) elSpent.textContent = `$${sum.toFixed(2)}`;
    if (elLastTotal) elLastTotal.textContent = `$${(last? (typeof last.total==='number'?last.total:parseFloat(last.total||0)):0).toFixed(2)}`;
    if (elLastDate) elLastDate.textContent = last?.createdAt ? new Date(last.createdAt).toLocaleString() : '-';
    if (elAvg) elAvg.textContent = `$${avg.toFixed(2)}`;
  }

  async function updateUserProfile(uid, updates) {
    const { db, auth } = getAuthServices();
    if (!db) throw new Error('Firestore no disponible');

    // Actualizar Firestore
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    await db.collection('users').doc(uid).set(payload, { merge: true });

    // Actualizar displayName en Auth si cambia
    try {
      if (auth?.currentUser && (updates.firstName || updates.lastName)) {
        const displayName = `${updates.firstName ?? ''} ${updates.lastName ?? ''}`.trim();
        if (displayName) {
          await auth.currentUser.updateProfile({ displayName });
        }
      }
    } catch(e) { console.warn('No se pudo actualizar displayName:', e); }
  }

  function openEditModal(prefill) {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    document.getElementById('edit-firstName').value = prefill.firstName || '';
    document.getElementById('edit-lastName').value = prefill.lastName || '';
    document.getElementById('edit-phone').value = prefill.phone || '';
    document.getElementById('edit-accountType').value = prefill.accountType || 'buyer';
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

  async function renderDashboard() {
    const user = await ensureSessionOrRedirect();
    if (!user) return;

    const profileName = user.displayName || user.email?.split('@')[0] || 'User';
    setText('name', profileName);
    setText('email', user.email || '-');
    const avatar = document.getElementById('avatar');
    if (avatar) avatar.textContent = initialsFrom(profileName);

    // Datos adicionales desde Firestore
    const userDoc = await fetchUserDoc(user.uid) || {};
    setText('uid', user.uid);
    setText('accountType', userDoc.accountType || '-');
    setText('location', userDoc.location || '-');
    setText('createdAt', formatDate(userDoc.createdAt));
    setText('updatedAt', formatDate(userDoc.updatedAt));

    // Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          const { auth } = getAuthServices();
          if (auth?.signOut) await auth.signOut();
        } catch (e) {}
        localStorage.removeItem('user');
        window.location.href = 'index.html';
      });
    }

    // Editar perfil
    const editBtn = document.getElementById('edit-profile');
    const editClose = document.getElementById('edit-close');
    const editCancel = document.getElementById('edit-cancel');
    const editForm = document.getElementById('edit-form');

    editBtn?.addEventListener('click', () => openEditModal({
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      phone: userDoc.phone,
      accountType: userDoc.accountType,
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
        accountType: document.getElementById('edit-accountType').value,
        location: document.getElementById('edit-location').value.trim()
      };

      try {
        await updateUserProfile(user.uid, updates);
        // Actualizar UI inmediata
        const newDisplayName = `${updates.firstName} ${updates.lastName}`.trim();
        setText('name', newDisplayName || profileName);
        if (avatar) avatar.textContent = initialsFrom(newDisplayName || profileName);
        setText('accountType', updates.accountType);
        setText('location', updates.location);
        setText('updatedAt', formatDate(new Date().toISOString()));

        // Actualizar localStorage.user
        const stored = getUserFromStorage() || {};
        localStorage.setItem('user', JSON.stringify({
          ...stored,
          uid: user.uid,
          email: user.email,
          displayName: newDisplayName || stored.displayName || user.displayName || ''
        }));

      // Refresh header if authenticated header exists
        const headerAuth = document.querySelector('app-header-auth');
        if (headerAuth && headerAuth.populateUser) headerAuth.populateUser();

        closeEditModal();
        alert('Profile updated');
      } catch (err) {
        console.error('Failed to update profile:', err);
        alert('Profile update failed');
      }
    });
    // Orders section
    const orders = await fetchUserOrders(user.uid);
    window.allOrders = orders; // Store globally for CSV export and detail view
    renderMetrics(orders);
    renderOrdersTable(orders);
    bindOrdersFilters(orders);

    // Export CSV button
    document.getElementById('export-csv')?.addEventListener('click', () => {
      const filtered = getCurrentFilteredOrders(orders, 
        document.getElementById('orders-search')?.value, 
        document.getElementById('orders-status')?.value);
      exportToCSV(filtered);
    });
  }

  document.addEventListener('DOMContentLoaded', renderDashboard);

  // Make functions globally available for onclick handlers
  window.showOrderDetail = showOrderDetail;
  window.closeOrderDetail = closeOrderDetail;
})();
