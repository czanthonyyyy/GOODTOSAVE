// Firebase Configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export services globally
window.firebaseServices = {
  auth: auth,
  db: db
};

console.log('✅ Firebase configurado correctamente'); 