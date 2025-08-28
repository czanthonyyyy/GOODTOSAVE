// Roles helper using Firebase compat SDK exposed via window.firebaseServices
(function initRolesHelper(){
	function ensureFirebase() {
		if (!window.firebaseServices || !window.firebaseServices.auth || !window.firebaseServices.db) {
			console.warn('⚠️ Firebase services not available. Ensure firebase-app-compat, firebase-auth-compat, firebase-firestore-compat and firebase-config are loaded');
			return null;
		}
		return window.firebaseServices;
	}

	async function waitForFirebase() {
		if (ensureFirebase()) {
			return true;
		}

		return new Promise((resolve) => {
			let attempts = 0;
			const maxAttempts = 100; // 10 segundos máximo
			
			const checkFirebase = () => {
				if (ensureFirebase()) {
					resolve(true);
				} else if (attempts < maxAttempts) {
					attempts++;
					setTimeout(checkFirebase, 100);
				} else {
					console.warn('⚠️ Timeout esperando Firebase services');
					resolve(false);
				}
			};
			checkFirebase();
		});
	}

	async function fetchUserRole(uid) {
		try {
			const firebaseReady = await waitForFirebase();
			if (!firebaseReady) return null;
			
			const services = ensureFirebase();
			if (!services) return null;
			
			const doc = await services.db.collection('users').doc(uid).get();
			if (!doc.exists) return null;
			const data = doc.data() || {};
			const raw = data.role || data.accountType || 'buyer';
			return raw === 'seller' ? 'provider' : raw; // normaliza
		} catch (e) {
			console.warn('⚠️ No se pudo obtener el rol del usuario:', e);
			return null;
		}
	}

	async function getCurrentUserRole() {
		try {
			const firebaseReady = await waitForFirebase();
			if (!firebaseReady) return null;
			
			const services = ensureFirebase();
			if (!services) return null;
			
			const user = services.auth.currentUser;
			if (!user) return null;
			return await fetchUserRole(user.uid);
		} catch (e) {
			console.warn('⚠️ Error al obtener rol del usuario actual:', e);
			return null;
		}
	}

	async function requireRole(required) {
		try {
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
		} catch (e) {
			console.error('❌ Error al verificar rol:', e);
			window.location.href = '../auth/auth.html';
		}
	}

	window.RolesHelper = { fetchUserRole, getCurrentUserRole, requireRole };
})();


