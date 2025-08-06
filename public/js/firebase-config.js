// Firebase Configuration
// IMPORTANTE: Reemplaza estos valores con tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBg6f6zGTz4O13uMgzkBdslpq5AYK5Jy3Y",
  authDomain: "proto-gts.firebaseapp.com",
  projectId: "proto-gts",
  storageBucket: "proto-gts.firebasestorage.app",
  messagingSenderId: "565196627065",
  appId: "1:565196627065:web:0c4c946154874479fd48a8",
  measurementId: "G-048PKJH5Y4"
};

// Limpiar cualquier instancia previa de Firebase
if (window.firebase && window.firebase.apps) {
  window.firebase.apps.forEach(app => {
    if (app.name !== '[DEFAULT]') {
      app.delete();
    }
  });
}

// Initialize Firebase
try {
  // Forzar reinicialización con nueva configuración
  if (window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
    window.firebase.app().delete();
  }
  
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configurar Firestore con configuración específica
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true
});

// Enable Firestore offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed - multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported');
    }
  });

// Export for use in other modules
window.firebaseServices = {
  auth,
  db,
  storage,
  firebase
};

// Verificar que los servicios estén disponibles
console.log('Firebase services loaded:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  projectId: firebaseConfig.projectId
});

// Verificar configuración de Firestore
console.log('Firestore settings:', {
  projectId: db.app.options.projectId,
  databaseId: db.app.options.databaseId
}); 