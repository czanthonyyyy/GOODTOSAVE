const admin = require('firebase-admin');
require('dotenv').config();

// Inicializar Firebase Admin
// IMPORTANTE: Necesitas descargar tu service account key desde Firebase Console
// y guardarlo como GOOGLE_APPLICATION_CREDENTIALS o usar el objeto de configuración

let serviceAccount;
try {
  // Opción 1: Usar variable de entorno para el archivo de credenciales
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  } else {
    // Opción 2: Configuración directa (para desarrollo)
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "tu-proyecto-id",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "tu-private-key-id",
      private_key: process.env.FIREBASE_PRIVATE_KEY ? 
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
        "tu-private-key",
      client_email: process.env.FIREBASE_CLIENT_EMAIL || "tu-client-email",
      client_id: process.env.FIREBASE_CLIENT_ID || "tu-client-id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || "tu-cert-url"
    };
  }
} catch (error) {
  console.error('Error loading Firebase service account:', error);
  process.exit(1);
}

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tu-proyecto.appspot.com"
});

// Exportar servicios
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = {
  admin,
  auth,
  db,
  storage
}; 