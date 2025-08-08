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
  }

  document.addEventListener('DOMContentLoaded', renderDashboard);
})();
