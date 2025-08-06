# 🔥 Configuración de Firebase para GTS Prototype

Este documento te guiará a través de la configuración completa de Firebase para el proyecto GTS (Good to Save).

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Google (para Firebase Console)
- Editor de código (VS Code recomendado)

## 🚀 Configuración Paso a Paso

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto: `gts-prototype`
4. Habilita Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 2. Configurar Servicios de Firebase

#### 2.1 Authentication
1. En Firebase Console, ve a "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita:
   - Email/Password
   - Google (opcional)
   - Facebook (opcional)

#### 2.2 Firestore Database
1. Ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Elige la ubicación más cercana a tus usuarios

#### 2.3 Storage
1. Ve a "Storage"
2. Haz clic en "Comenzar"
3. Selecciona "Comenzar en modo de prueba"
4. Elige la misma ubicación que Firestore

### 3. Obtener Configuración de Firebase

#### 3.1 Configuración del Frontend
1. En Firebase Console, ve a "Configuración del proyecto"
2. En la pestaña "General", haz clic en "Configuración de SDK"
3. Copia la configuración de la web app
4. Reemplaza el contenido en `public/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-messaging-sender-id",
  appId: "tu-app-id"
};
```

#### 3.2 Configuración del Backend
1. En Firebase Console, ve a "Configuración del proyecto"
2. En la pestaña "Cuentas de servicio"
3. Haz clic en "Generar nueva clave privada"
4. Descarga el archivo JSON
5. Copia el contenido del archivo JSON a las variables de entorno

### 4. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `env.example`
3. Reemplaza los valores con tu configuración real:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de Firebase (reemplaza con tus valores reales)
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu private key aquí\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-service-account%40tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com

# URLs de redirección
EMAIL_VERIFICATION_URL=http://localhost:3000/auth.html
PASSWORD_RESET_URL=http://localhost:3000/auth.html
```

### 5. Instalar Dependencias

```bash
npm install
```

### 6. Configurar Firebase CLI (Opcional)

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 7. Inicializar Datos de Prueba

#### 7.1 Categorías
En Firebase Console, ve a Firestore y crea una colección llamada `categories` con estos documentos:

```json
{
  "name": "Frutas y Verduras",
  "description": "Productos frescos de la huerta",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

```json
{
  "name": "Lácteos",
  "description": "Productos lácteos y derivados",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

```json
{
  "name": "Panadería",
  "description": "Productos de panadería y pastelería",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo
```bash
# Terminal 1: Servidor backend
npm start

# Terminal 2: Servidor frontend
npm run dev
```

### Producción
```bash
# Construir y desplegar
npm run build
firebase deploy
```

## 📁 Estructura de Archivos

```
GTS-PROTOTYPE/
├── public/                    # Frontend estático
│   ├── js/
│   │   ├── firebase-config.js # Configuración de Firebase
│   │   └── firebase-service.js # Servicio de Firebase
│   └── pages/                 # Páginas HTML
├── backend/                   # Backend Node.js
│   ├── config/
│   │   └── firebase-admin.js  # Configuración Firebase Admin
│   ├── services/
│   │   ├── auth.js           # Servicio de autenticación
│   │   └── database.js       # Servicio de base de datos
│   └── server.js             # Servidor Express
├── firebase.json             # Configuración de Firebase
├── firestore.rules           # Reglas de seguridad Firestore
├── firestore.indexes.json    # Índices de Firestore
├── storage.rules             # Reglas de Storage
└── package.json              # Dependencias del proyecto
```

## 🔐 Reglas de Seguridad

### Firestore Rules
Las reglas están configuradas en `firestore.rules`:
- Usuarios pueden leer/escribir solo sus propios datos
- Productos son públicos para lectura, escritura solo para vendedores
- Órdenes solo accesibles para comprador y vendedor
- Reviews públicos para lectura, escritura para usuarios autenticados

### Storage Rules
Las reglas están en `storage.rules`:
- Imágenes de perfil: lectura pública, escritura solo para el usuario
- Imágenes de productos: lectura pública, escritura solo para vendedores
- Validación de tipos de archivo y tamaño máximo (5MB)

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Crear Usuario de Prueba
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "accountType": "buyer"
  }'
```

## 🚨 Solución de Problemas

### Error: "Firebase services not available"
- Verifica que `firebase-config.js` se carga antes que `firebase-service.js`
- Asegúrate de que los SDKs de Firebase estén incluidos en el HTML

### Error: "Permission denied"
- Verifica las reglas de Firestore y Storage
- Asegúrate de que el usuario esté autenticado
- Revisa los roles y permisos

### Error: "Invalid token"
- Verifica la configuración de Firebase Admin
- Asegúrate de que las variables de entorno estén correctas
- Revisa que el service account tenga los permisos necesarios

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor
2. Verifica la configuración de Firebase
3. Consulta la documentación de Firebase
4. Revisa las reglas de seguridad

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:
```bash
npm update
firebase-tools update
```

---

¡Listo! Tu proyecto GTS ahora está completamente configurado con Firebase. 🎉 