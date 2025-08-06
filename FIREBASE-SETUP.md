# 🔥 Configuración de Firebase para GTS Prototype

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Ingresa el nombre del proyecto (ej: `gts-prototype`)
4. Puedes desactivar Google Analytics por ahora
5. Haz clic en **"Crear proyecto"**

### 2. Configurar Authentication

1. En el panel izquierdo, ve a **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **"Email/Password"**
5. Guarda los cambios

### 3. Configurar Firestore Database

1. En el panel izquierdo, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
4. Selecciona la ubicación más cercana
5. Haz clic en **"Listo"**

### 4. Configurar Storage

1. En el panel izquierdo, ve a **"Storage"**
2. Haz clic en **"Comenzar"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Selecciona la ubicación más cercana
5. Haz clic en **"Listo"**

### 5. Obtener Configuración del Frontend

1. Ve a **"Project Settings"** (⚙️ icono)
2. En la pestaña **"General"**, busca **"Your apps"**
3. Haz clic en **"Add app"** → **"Web"**
4. Dale un nombre a tu app (ej: `gts-web`)
5. **NO** marques "Set up Firebase Hosting"
6. Haz clic en **"Register app"**
7. Copia la configuración que aparece

### 6. Actualizar Configuración Frontend

Edita el archivo `public/js/firebase-config.js` y reemplaza los valores:

```javascript
const firebaseConfig = {
  apiKey: "TU-API-KEY-REAL",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 7. Obtener Credenciales del Backend

1. En **"Project Settings"** → **"Service accounts"**
2. Haz clic en **"Generate new private key"**
3. Descarga el archivo JSON
4. **IMPORTANTE**: Guarda este archivo de forma segura

### 8. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# ===== CONFIGURACIÓN DEL SERVIDOR =====
PORT=3000
NODE_ENV=development

# ===== CONFIGURACIÓN DE FIREBASE =====
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu private key aquí\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-service-account%40tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com

# ===== CONFIGURACIÓN DE EMAIL =====
EMAIL_VERIFICATION_URL=http://localhost:3000/auth.html
PASSWORD_RESET_URL=http://localhost:3000/auth.html

# ===== CONFIGURACIÓN DE CORS =====
CORS_ORIGIN=http://localhost:3000

# ===== CONFIGURACIÓN DE LOGS =====
LOG_LEVEL=info
```

**Reemplaza los valores con los del archivo JSON descargado.**

### 9. Instalar Dependencias

```bash
npm install
```

### 10. Probar la Configuración

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Ve a `http://localhost:3000/pages/auth.html`
3. Abre la consola del navegador (F12)
4. Deberías ver mensajes de verificación de Firebase

### 11. Verificar Funcionalidad

1. **Registro de Usuario:**
   - Llena el formulario de registro
   - Haz clic en "Sign Up"
   - Verifica que el usuario se cree en Firebase Console

2. **Inicio de Sesión:**
   - Usa las credenciales del usuario creado
   - Haz clic en "Sign In"
   - Verifica que funcione correctamente

## 🔧 Solución de Problemas

### Error: "Firebase SDK no está cargado"
- Verifica que los scripts de Firebase estén cargados en `auth.html`
- Revisa la consola del navegador para errores de red

### Error: "Servicios de Firebase no están configurados"
- Verifica que `firebase-config.js` tenga la configuración correcta
- Asegúrate de que los valores coincidan con tu proyecto

### Error: "Error de conexión a la base de datos"
- Verifica que Firestore esté habilitado en Firebase Console
- Revisa las reglas de seguridad de Firestore

### Error: "Usuario no encontrado"
- Verifica que Authentication esté habilitado
- Revisa que el método Email/Password esté activado

## 📁 Estructura de Archivos

```
GTS-PROTOTYPE/
├── public/
│   ├── js/
│   │   ├── firebase-config.js      # Configuración de Firebase
│   │   ├── firebase-service.js     # Servicios de Firebase
│   │   ├── auth.js                 # Lógica de autenticación
│   │   └── auth-verification.js    # Verificación de configuración
│   └── pages/
│       └── auth.html               # Página de autenticación
├── backend/
│   ├── config/
│   │   └── firebase-admin.js       # Configuración del backend
│   └── services/
│       ├── auth.js                 # Servicios de autenticación
│       └── database.js             # Servicios de base de datos
└── .env                            # Variables de entorno
```

## 🚀 Próximos Pasos

1. **Configurar Reglas de Seguridad** en Firestore
2. **Implementar Autenticación Social** (Google, Facebook)
3. **Configurar Firebase Hosting** para producción
4. **Implementar Funciones Cloud** para lógica del servidor

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa la consola del navegador
2. Verifica que todos los archivos estén en su lugar
3. Asegúrate de que las credenciales sean correctas
4. Revisa que Firebase Console esté configurado correctamente 