// Firebase Configuration
// IMPORTANTE: Reemplaza estas credenciales con las tuyas de Firebase Console

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
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