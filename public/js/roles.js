// Roles helper using Firebase compat SDK exposed via window.firebaseServices
(function initRolesHelper(){
	function ensureFirebase() {
		if (!window.firebaseServices || !window.firebaseServices.auth || !window.firebaseServices.db) {
			console.error('Firebase services not available. Ensure firebase-app-compat, firebase-auth-compat, firebase-firestore-compat and firebase-config are loaded');
			return null;
		}
		return window.firebaseServices;
	}

	async function fetchUserRole(uid) {
		const services = ensureFirebase();
		if (!services) return null;
		try {
			const doc = await services.db.collection('users').doc(uid).get();
			if (!doc.exists) return null;
			const data = doc.data() || {};
			const raw = data.role || data.accountType || 'buyer';
			return raw === 'seller' ? 'provider' : raw; // normaliza
		} catch (e) {
			console.warn('No se pudo obtener el rol del usuario:', e);
			return null;
		}
	}

	async function getCurrentUserRole() {
		const services = ensureFirebase();
		if (!services) return null;
		const user = services.auth.currentUser;
		if (!user) return null;
		return await fetchUserRole(user.uid);
	}

	async function requireRole(required) {
		const role = await getCurrentUserRole();
		if (!role) {
			window.location.href = '../auth/auth.html';
			return;
		}
		if (Array.isArray(required)) {
			if (!required.includes(role)) {
				window.location.href = role === 'provider' ? './provider-dashboard.html' : './buyer-dashboard.html';
			}
			return;
		}
		if (role !== required) {
			window.location.href = role === 'provider' ? './provider-dashboard.html' : './buyer-dashboard.html';
		}
	}

	window.RolesHelper = { fetchUserRole, getCurrentUserRole, requireRole };
})();


