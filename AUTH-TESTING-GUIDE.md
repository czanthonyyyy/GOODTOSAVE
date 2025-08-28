# Guía de Pruebas del Sistema de Autenticación

## 🔍 Cómo Probar el Sistema

### 1. Verificar Estado de Firebase
Abre la consola del navegador (F12) y ejecuta:
```javascript
debugAuth.checkStatus()
```

**Resultado esperado:**
```javascript
{
  firebase: true,
  firebaseServices: true,
  firebaseAuthService: true,
  auth: true,
  db: true
}
```

### 2. Verificar Servicio de Autenticación
```javascript
debugAuth.checkService()
```

**Resultado esperado:**
```javascript
{
  initialized: true,
  auth: true,
  db: true,
  currentUser: false // o true si ya hay sesión
}
```

### 3. Probar Inicio de Sesión
```javascript
// Reemplaza con credenciales reales
debugAuth.testSignIn('tu-email@ejemplo.com', 'tu-contraseña')
```

## 🚨 Problemas Comunes y Soluciones

### Problema: "Firebase Auth Service is not available"
**Síntomas:**
- Mensaje en consola indicando que Firebase no está disponible
- Botón de login no responde

**Solución:**
1. Verifica que todos los scripts de Firebase estén cargados
2. Revisa la consola para errores de red
3. Asegúrate de que las credenciales de Firebase sean correctas

### Problema: "Error de sintaxis createProduct"
**Síntomas:**
- Error de JavaScript en la consola
- Página no carga correctamente

**Solución:**
- Este error ya está corregido en la versión actual
- Si persiste, verifica que el archivo `firebase-auth.js` esté actualizado

### Problema: Página se recarga sin mostrar errores
**Síntomas:**
- Al intentar iniciar sesión, la página se recarga
- No se muestran mensajes de error

**Solución:**
1. Verifica que el formulario tenga `preventDefault()`
2. Revisa que las funciones de manejo de errores estén funcionando
3. Usa el debug helper para identificar el problema

### Problema: Credenciales incorrectas no muestran error
**Síntomas:**
- Al ingresar credenciales incorrectas, no aparece mensaje de error
- El botón sigue en estado de carga

**Solución:**
1. Verifica que la función `clearFormErrors()` esté definida
2. Revisa que los selectores de elementos de error sean correctos
3. Usa el debug helper para ver qué error se está generando

## 🛠️ Herramientas de Debug

### Logs Automáticos
El sistema genera logs automáticamente. Para verlos:
```javascript
debugAuth.getLogs()
```

### Exportar Logs
Para guardar los logs en un archivo:
```javascript
debugAuth.exportLogs()
```

### Limpiar Logs
```javascript
debugAuth.clearLogs()
```

## 📋 Checklist de Pruebas

### ✅ Pruebas Básicas
- [ ] Firebase se inicializa correctamente
- [ ] Servicio de autenticación está disponible
- [ ] Formulario de login responde
- [ ] Validación de campos funciona
- [ ] Mensajes de error se muestran correctamente

### ✅ Pruebas de Autenticación
- [ ] Login con credenciales correctas funciona
- [ ] Login con credenciales incorrectas muestra error
- [ ] Redirección después del login funciona
- [ ] Registro de usuario funciona
- [ ] Recuperación de contraseña funciona

### ✅ Pruebas de Errores
- [ ] Error de red se maneja correctamente
- [ ] Error de credenciales inválidas se muestra
- [ ] Error de cuenta no encontrada se muestra
- [ ] Error de demasiados intentos se maneja
- [ ] Error de cuenta deshabilitada se maneja

## 🔧 Comandos Útiles en Consola

### Verificar Estado Completo
```javascript
console.log('Firebase Status:', debugAuth.checkStatus());
console.log('Auth Service:', debugAuth.checkService());
console.log('Current User:', window.firebaseAuthService?.getCurrentUser());
```

### Probar Funciones Específicas
```javascript
// Probar validación de email
const emailInput = document.getElementById('signin-email');
emailInput.value = 'test@example.com';
emailInput.dispatchEvent(new Event('blur'));

// Probar validación de contraseña
const passwordInput = document.getElementById('signin-password');
passwordInput.value = '123';
passwordInput.dispatchEvent(new Event('blur'));
```

### Simular Errores
```javascript
// Simular error de red
window.firebaseAuthService.signIn('test@example.com', 'wrongpassword')
  .catch(error => console.log('Error simulado:', error));
```

## 📞 Reportar Problemas

Si encuentras problemas:

1. **Ejecuta el debug helper:**
   ```javascript
   debugAuth.checkStatus();
   debugAuth.checkService();
   ```

2. **Exporta los logs:**
   ```javascript
   debugAuth.exportLogs();
   ```

3. **Proporciona información:**
   - Navegador y versión
   - Sistema operativo
   - Pasos para reproducir el problema
   - Logs exportados
   - Captura de pantalla del error

## 🎯 Resultados Esperados

### Login Exitoso
- Mensaje de éxito: "Sesión iniciada exitosamente"
- Redirección al dashboard correspondiente
- Usuario guardado en localStorage

### Login Fallido
- Mensaje de error específico
- Campos de email y contraseña marcados como error
- Botón vuelve a estado normal

### Error de Red
- Mensaje: "Error de conexión. Verifica tu internet e intenta de nuevo."
- No redirección
- Opción de reintentar

---

**Nota:** Esta guía te ayudará a identificar y resolver problemas del sistema de autenticación. Si los problemas persisten, usa las herramientas de debug para obtener información detallada.
