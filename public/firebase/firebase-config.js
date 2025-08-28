// Firebase Configuration (Compat SDK)
// IMPORTANTE: Reemplaza estas credenciales con las tuyas de Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBg6f6zGTz4O13uMgzkBdslpq5AYK5Jy3Y",
  authDomain: "proto-gts.firebaseapp.com",
  databaseURL: "https://proto-gts-default-rtdb.firebaseio.com",
  projectId: "proto-gts",
  storageBucket: "proto-gts.firebasestorage.app",
  messagingSenderId: "565196627065",
  appId: "1:565196627065:web:0c4c946154874479fd48a8",
  measurementId: "G-048PKJH5Y4"
};

// Initialize Firebase using global compat SDK loaded in HTML
(function initFirebaseCompat() {
  try {
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK (compat) no está cargado. Verifica las etiquetas <script> en auth.html.');
      return;
    }

    // Verificar que los servicios necesarios estén disponibles
    if (typeof firebase.auth === 'undefined') {
      console.error('❌ Firebase Auth no está disponible. Verifica que firebase-auth-compat.js esté cargado.');
      return;
    }

    if (typeof firebase.firestore === 'undefined') {
      console.error('❌ Firebase Firestore no está disponible. Verifica que firebase-firestore-compat.js esté cargado.');
      return;
    }

    // Prevent re-initialization
    if (firebase.apps && firebase.apps.length > 0) {
      console.debug('ℹ️ Firebase ya estaba inicializado');
    } else {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase inicializado correctamente');
    }

    // Initialize services (compat)
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Verificar que los servicios se inicializaron correctamente
    if (!auth) {
      throw new Error('Firebase Auth no se pudo inicializar');
    }

    if (!db) {
      throw new Error('Firebase Firestore no se pudo inicializar');
    }

    // Expose globally for the auth service
    window.firebaseServices = { auth, db };
    console.log('✅ Firebase configurado correctamente - Auth y Firestore disponibles');
    
    // Disparar evento personalizado para notificar que Firebase está listo
    window.dispatchEvent(new CustomEvent('firebaseReady'));
    
  } catch (e) {
    console.error('❌ Error al inicializar Firebase:', e);
    // Disparar evento de error para que otros scripts puedan manejarlo
    window.dispatchEvent(new CustomEvent('firebaseError', { detail: e }));
  }
})();