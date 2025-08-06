# 🔧 Solución de Problemas de Firebase

## Problema Actual
El error indica que Firestore está intentando conectarse a `tu-proyecto-id` en lugar de `proto-gts`, lo que sugiere un problema de caché o configuración.

## 🚀 Solución Paso a Paso

### 1. Limpiar Caché del Navegador
```bash
# En Chrome/Edge:
# 1. Presiona Ctrl+Shift+Delete
# 2. Selecciona "Todo el tiempo"
# 3. Marca todas las opciones
# 4. Haz clic en "Limpiar datos"

# O abre las herramientas de desarrollador (F12):
# 1. Ve a la pestaña "Application"
# 2. En "Storage", haz clic derecho y selecciona "Clear"
# 3. Recarga la página con Ctrl+F5
```

### 2. Verificar Configuración de Firebase
Asegúrate de que `public/js/firebase-config.js` tenga la configuración correcta:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBg6f6zGTz4O13uMgzkBdslpq5AYK5Jy3Y",
  authDomain: "proto-gts.firebaseapp.com",
  projectId: "proto-gts", // ← Este debe ser "proto-gts"
  storageBucket: "proto-gts.firebasestorage.app",
  messagingSenderId: "565196627065",
  appId: "1:565196627065:web:0c4c946154874479fd48a8",
  measurementId: "G-048PKJH5Y4"
};
```

### 3. Verificar Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `proto-gts`
3. Verifica que Firestore esté habilitado:
   - Ve a "Firestore Database" en el menú lateral
   - Si no está habilitado, haz clic en "Crear base de datos"
   - Selecciona "Comenzar en modo de prueba"

### 4. Verificar Reglas de Firestore
En Firebase Console, ve a "Firestore Database" > "Reglas" y asegúrate de que las reglas permitan lectura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Solo para desarrollo
    }
  }
}
```

### 5. Scripts de Diagnóstico
He agregado varios scripts para diagnosticar el problema:

#### `cache-clear.js`
- Limpia automáticamente la caché de Firebase
- Recarga los scripts de Firebase
- Se ejecuta automáticamente en la página de auth

#### `firebase-debug.js`
- Diagnóstica problemas de configuración
- Verifica conexión al proyecto
- Muestra recomendaciones específicas

### 6. Comandos de Consola
Abre las herramientas de desarrollador (F12) y ejecuta estos comandos:

```javascript
// Limpiar caché manualmente
clearAndReloadFirebase();

// Ejecutar diagnóstico
const debugger = new FirebaseDebugger();
debugger.runDiagnostic();

// Verificar configuración actual
console.log('Project ID:', firebase.app().options.projectId);
```

### 7. Verificar en Firebase Console
1. Ve a tu proyecto en Firebase Console
2. Ve a "Configuración del proyecto" (ícono de engranaje)
3. En "Tus apps", verifica que la configuración coincida
4. Si hay discrepancias, actualiza la configuración

### 8. Probar Conexión
Después de limpiar la caché, prueba:

1. Recarga la página con `Ctrl+F5`
2. Abre las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Busca mensajes de éxito como:
   - "Firebase initialized successfully with project: proto-gts"
   - "Conexión a Firestore exitosa"

### 9. Si el Problema Persiste

#### Opción A: Usar modo incógnito
1. Abre una ventana de incógnito
2. Ve a tu página de auth
3. Verifica si funciona sin caché

#### Opción B: Verificar DNS
```bash
# En Windows, ejecuta en CMD:
ipconfig /flushdns
```

#### Opción C: Verificar Firewall
- Asegúrate de que tu firewall no esté bloqueando las conexiones a Firebase
- Verifica que tengas conexión a internet

### 10. Verificación Final
Después de aplicar todas las soluciones, deberías ver en la consola:

```
✅ Firebase SDK cargado correctamente
✅ Firebase services loaded: Object
✅ Todos los servicios de Firebase están disponibles
✅ Conexión a Firestore exitosa
```

## 📞 Si Nada Funciona

1. **Verifica tu conexión a internet**
2. **Asegúrate de que Firestore esté habilitado en Firebase Console**
3. **Verifica que las reglas de Firestore permitan acceso**
4. **Contacta al soporte de Firebase si el problema persiste**

## 🔍 Logs Útiles

Para diagnosticar problemas, busca estos mensajes en la consola:

- ❌ `Failed to get document because the client is offline`
- ❌ `FirebaseError: [code=unavailable]`
- ❌ `Project ID incorrecto: tu-proyecto-id`
- ✅ `Firebase initialized successfully with project: proto-gts`
- ✅ `Conexión a Firestore exitosa` 