/**
 * Cache Clear Script
 * Limpia la caché de Firebase y fuerza la recarga
 */

// Función para limpiar caché de Firebase
function clearFirebaseCache() {
  console.log('🧹 Limpiando caché de Firebase...');
  
  // Limpiar localStorage relacionado con Firebase
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('firebase') || key.includes('firestore') || key.includes('auth'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('🗑️ Removido de localStorage:', key);
  });
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  console.log('🗑️ SessionStorage limpiado');
  
  // Limpiar IndexedDB de Firebase
  if ('indexedDB' in window) {
    const request = indexedDB.deleteDatabase('firebaseLocalStorage');
    request.onsuccess = () => {
      console.log('🗑️ IndexedDB de Firebase limpiado');
    };
    request.onerror = () => {
      console.log('⚠️ No se pudo limpiar IndexedDB');
    };
  }
  
  // Limpiar caché de Firestore
  if (window.firebase && window.firebase.firestore) {
    try {
      const db = window.firebase.firestore();
      db.clearPersistence()
        .then(() => {
          console.log('🗑️ Persistencia de Firestore limpiada');
        })
        .catch((error) => {
          console.log('⚠️ Error limpiando persistencia:', error);
        });
    } catch (error) {
      console.log('⚠️ Error accediendo a Firestore:', error);
    }
  }
  
  console.log('✅ Caché de Firebase limpiado');
}

// Función para recargar Firebase
function reloadFirebase() {
  console.log('🔄 Recargando Firebase...');
  
  // Remover scripts de Firebase existentes
  const firebaseScripts = document.querySelectorAll('script[src*="firebase"]');
  firebaseScripts.forEach(script => {
    script.remove();
    console.log('🗑️ Script removido:', script.src);
  });
  
  // Limpiar variables globales
  if (window.firebase) {
    delete window.firebase;
  }
  if (window.firebaseServices) {
    delete window.firebaseServices;
  }
  if (window.firebaseService) {
    delete window.firebaseService;
  }
  
  console.log('🗑️ Variables globales de Firebase limpiadas');
  
  // Recargar scripts de Firebase
  loadFirebaseScripts();
}

// Función para cargar scripts de Firebase
function loadFirebaseScripts() {
  console.log('📦 Cargando scripts de Firebase...');
  
  const scripts = [
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage-compat.js'
  ];
  
  let loadedScripts = 0;
  
  scripts.forEach((src, index) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedScripts++;
      console.log(`✅ Script cargado: ${src}`);
      
      if (loadedScripts === scripts.length) {
        console.log('🎉 Todos los scripts de Firebase cargados');
        // Cargar configuración después de que todos los scripts estén listos
        loadFirebaseConfig();
      }
    };
    script.onerror = () => {
      console.error(`❌ Error cargando script: ${src}`);
    };
    document.head.appendChild(script);
  });
}

// Función para cargar configuración de Firebase
function loadFirebaseConfig() {
  console.log('⚙️ Cargando configuración de Firebase...');
  
  const script = document.createElement('script');
  script.src = 'js/firebase-config.js';
  script.onload = () => {
    console.log('✅ Configuración de Firebase cargada');
    // Cargar servicio de Firebase
    loadFirebaseService();
  };
  script.onerror = () => {
    console.error('❌ Error cargando configuración de Firebase');
  };
  document.head.appendChild(script);
}

// Función para cargar servicio de Firebase
function loadFirebaseService() {
  console.log('🔧 Cargando servicio de Firebase...');
  
  const script = document.createElement('script');
  script.src = 'js/firebase-service.js';
  script.onload = () => {
    console.log('✅ Servicio de Firebase cargado');
    console.log('🎉 Firebase completamente recargado');
    
    // Ejecutar verificación después de un breve delay
    setTimeout(() => {
      if (window.firebaseService) {
        console.log('✅ Firebase Service disponible después de recarga');
      } else {
        console.error('❌ Firebase Service no disponible después de recarga');
      }
    }, 1000);
  };
  script.onerror = () => {
    console.error('❌ Error cargando servicio de Firebase');
  };
  document.head.appendChild(script);
}

// Función principal para limpiar y recargar
function clearAndReloadFirebase() {
  console.log('🚀 Iniciando limpieza y recarga de Firebase...');
  
  // Limpiar caché
  clearFirebaseCache();
  
  // Esperar un momento y luego recargar
  setTimeout(() => {
    reloadFirebase();
  }, 500);
}

// Exponer funciones globalmente
window.clearFirebaseCache = clearFirebaseCache;
window.reloadFirebase = reloadFirebase;
window.clearAndReloadFirebase = clearAndReloadFirebase;

// Auto-ejecutar si estamos en la página de auth
if (window.location.pathname.includes('auth.html')) {
  console.log('🔄 Auto-limpieza de Firebase en página de auth...');
  setTimeout(() => {
    clearAndReloadFirebase();
  }, 1000);
} 