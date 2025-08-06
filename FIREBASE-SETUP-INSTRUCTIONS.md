# 🔥 Configuración de Firebase para Good to Save

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: "good-to-save")
4. Sigue los pasos de configuración

### 2. Habilitar Authentication

1. En Firebase Console, ve a "Authentication"
2. Haz clic en "Get started"
3. En la pestaña "Sign-in method", habilita:
   - ✅ Email/Password
   - ✅ Google (opcional)
   - ✅ Facebook (opcional)

### 3. Habilitar Firestore Database

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige la ubicación más cercana a tus usuarios

### 4. Obtener Credenciales

1. En Firebase Console, ve a "Configuración del proyecto" (⚙️)
2. En la pestaña "General", busca "Tu app"
3. Si no tienes una app web, haz clic en "Agregar app" y selecciona "Web"
4. Copia la configuración que aparece

### 5. Configurar Credenciales en el Proyecto

**📍 UBICACIÓN: `public/js/firebase-config.js`**

Reemplaza las credenciales en la línea 4-10:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",                    // ← Reemplaza esto
  authDomain: "TU_PROJECT_ID.firebaseapp.com",   // ← Reemplaza esto
  projectId: "TU_PROJECT_ID",                    // ← Reemplaza esto
  storageBucket: "TU_PROJECT_ID.appspot.com",    // ← Reemplaza esto
  messagingSenderId: "TU_MESSAGING_SENDER_ID",   // ← Reemplaza esto
  appId: "TU_APP_ID"                            // ← Reemplaza esto
};
```

### 6. Configurar Reglas de Firestore

En Firebase Console, ve a "Firestore Database" > "Reglas" y usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir lectura pública de productos (opcional)
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Probar la Configuración

1. Abre `public/pages/auth.html` en tu navegador
2. Abre la consola del navegador (F12)
3. Deberías ver: `✅ Firebase configurado correctamente`
4. Intenta registrar un usuario
5. Verifica en Firebase Console que el usuario aparezca en "Authentication"

## 🔧 Solución de Problemas

### Error: "Firebase no está disponible"
- Verifica que las credenciales estén correctas
- Asegúrate de que los SDKs de Firebase se carguen antes que tu código

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que Authentication esté habilitado

### Error: "Network request failed"
- Verifica tu conexión a internet
- Asegúrate de que el proyecto esté en la región correcta

## 📁 Estructura de Datos

### Colección: `users`
```javascript
{
  uid: "user_id_from_firebase_auth",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  accountType: "buyer", // o "seller"
  location: "Madrid, Spain",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Firebase Console
- [ ] Authentication habilitado
- [ ] Firestore Database habilitado
- [ ] Credenciales configuradas en `firebase-config.js`
- [ ] Reglas de Firestore configuradas
- [ ] Prueba de registro exitosa
- [ ] Prueba de login exitosa

¡Listo! Tu sistema de autenticación con Firebase está configurado. 🎉 