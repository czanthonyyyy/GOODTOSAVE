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
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK (compat) no está cargado. Verifica las etiquetas <script> en auth.html.');
      return;
    }

    // Prevent re-initialization
    if (firebase.apps && firebase.apps.length > 0) {
      console.debug('ℹ️ Firebase ya estaba inicializado');
    } else {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase inicializado');
    }

    // Initialize services (compat)
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Expose globally for the auth service
    window.firebaseServices = { auth, db };
    console.log('✅ Firebase configurado correctamente');
  } catch (e) {
    console.error('❌ Error al inicializar Firebase:', e);
  }
})();