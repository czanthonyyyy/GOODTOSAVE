/**
 * Auth Verification Script
 * Verifica que Firebase esté correctamente configurado y funcionando
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== VERIFICACIÓN DE FIREBASE ===');
    
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no está cargado');
        showVerificationError('Firebase SDK no está cargado');
        return;
    }
    
    console.log('✅ Firebase SDK cargado');
    
    // Verificar servicios de Firebase
    if (!window.firebaseServices) {
        console.error('❌ Servicios de Firebase no están disponibles');
        showVerificationError('Servicios de Firebase no están configurados');
        return;
    }
    
    console.log('✅ Servicios de Firebase disponibles');
    
    // Verificar configuración
    const { auth, db, storage } = window.firebaseServices;
    
    if (!auth) {
        console.error('❌ Firebase Auth no está disponible');
        showVerificationError('Firebase Auth no está configurado');
        return;
    }
    
    if (!db) {
        console.error('❌ Firestore no está disponible');
        showVerificationError('Firestore no está configurado');
        return;
    }
    
    if (!storage) {
        console.error('❌ Firebase Storage no está disponible');
        showVerificationError('Firebase Storage no está configurado');
        return;
    }
    
    console.log('✅ Todos los servicios de Firebase están disponibles');
    
    // Verificar configuración de Auth
    try {
        const currentUser = auth.currentUser;
        console.log('👤 Usuario actual:', currentUser ? 'Autenticado' : 'No autenticado');
        
        if (currentUser) {
            console.log('   - UID:', currentUser.uid);
            console.log('   - Email:', currentUser.email);
            console.log('   - Display Name:', currentUser.displayName);
        }
    } catch (error) {
        console.error('❌ Error verificando usuario actual:', error);
    }
    
    // Verificar conexión a Firestore
    try {
        db.collection('test').doc('connection-test').get()
            .then(() => {
                console.log('✅ Conexión a Firestore exitosa');
            })
            .catch((error) => {
                console.error('❌ Error de conexión a Firestore:', error);
                showVerificationError('Error de conexión a la base de datos');
            });
    } catch (error) {
        console.error('❌ Error verificando Firestore:', error);
    }
    
    // Verificar Firebase Service
    if (!window.firebaseService) {
        console.error('❌ Firebase Service no está disponible');
        showVerificationError('Firebase Service no está inicializado');
        return;
    }
    
    console.log('✅ Firebase Service disponible');
    
    // Probar métodos del servicio
    const service = window.firebaseService;
    console.log('📋 Métodos disponibles:', {
        signUp: typeof service.signUp === 'function',
        signIn: typeof service.signIn === 'function',
        signOut: typeof service.signOut === 'function',
        getCurrentUser: typeof service.getCurrentUser === 'function',
        getErrorMessage: typeof service.getErrorMessage === 'function'
    });
    
    console.log('=== VERIFICACIÓN COMPLETADA ===');
    
    // Mostrar estado en la página
    showVerificationSuccess('Firebase está correctamente configurado');
});

function showVerificationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
        <strong>❌ Error de Configuración</strong><br>
        ${message}<br>
        <small>Revisa la consola para más detalles</small>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 10000);
}

function showVerificationSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    successDiv.innerHTML = `
        <strong>✅ Configuración Correcta</strong><br>
        ${message}<br>
        <small>Puedes cerrar esta notificación</small>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
} 