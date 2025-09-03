// Script de debugging para verificar el estado de la cuenta de proveedor
(function() {
  console.log('🔍 Debug Provider Script Loaded');
  
  // Función para verificar el estado completo del usuario
  async function debugUserStatus() {
    console.log('=== DEBUG USER STATUS ===');
    
    // 1. Verificar localStorage
    try {
      const storedUser = localStorage.getItem('user');
      console.log('📋 localStorage user:', storedUser);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('👤 Parsed user data:', user);
        console.log('🏷️ User accountType:', user.accountType);
        console.log('🆔 User UID:', user.uid);
      }
    } catch (e) {
      console.error('❌ Error reading localStorage:', e);
    }
    
    // 2. Verificar Firebase Auth
    try {
      if (window.firebaseServices && window.firebaseServices.auth) {
        const currentUser = window.firebaseServices.auth.currentUser;
        console.log('🔥 Firebase currentUser:', currentUser);
        
        if (currentUser) {
          console.log('🆔 Firebase UID:', currentUser.uid);
          console.log('📧 Firebase email:', currentUser.email);
          console.log('👤 Firebase displayName:', currentUser.displayName);
        }
      } else {
        console.warn('⚠️ Firebase services not available');
      }
    } catch (e) {
      console.error('❌ Error checking Firebase Auth:', e);
    }
    
    // 3. Verificar RolesHelper
    try {
      if (window.RolesHelper) {
        console.log('✅ RolesHelper available');
        
        // Intentar obtener el rol actual
        const currentRole = await window.RolesHelper.getCurrentUserRole();
        console.log('🎭 Current role from RolesHelper:', currentRole);
        
        // Si hay usuario en localStorage, intentar obtener su rol
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userRole = await window.RolesHelper.fetchUserRole(user.uid);
          console.log('🎭 User role from UID:', userRole);
        }
      } else {
        console.warn('⚠️ RolesHelper not available');
      }
    } catch (e) {
      console.error('❌ Error checking RolesHelper:', e);
    }
    
    // 4. Verificar datos en Firestore
    try {
      if (window.firebaseServices && window.firebaseServices.db) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userDoc = await window.firebaseServices.db.collection('users').doc(user.uid).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('📄 Firestore user data:', userData);
            console.log('🏷️ Firestore accountType:', userData.accountType);
            console.log('🎭 Firestore role:', userData.role);
          } else {
            console.warn('⚠️ User document not found in Firestore');
          }
        }
      } else {
        console.warn('⚠️ Firestore not available');
      }
    } catch (e) {
      console.error('❌ Error checking Firestore:', e);
    }
    
    console.log('=== END DEBUG ===');
  }
  
  // Función para simular clic en perfil
  function simulateProfileClick() {
    console.log('🔍 Simulating profile click...');
    
    // Buscar el botón de perfil
    const profileButton = document.querySelector('app-header-auth')?.shadowRoot?.getElementById('menu-profile');
    
    if (profileButton) {
      console.log('✅ Found profile button, clicking...');
      profileButton.click();
    } else {
      console.warn('⚠️ Profile button not found');
      
      // Intentar encontrar el botón de otra manera
      const headerAuth = document.querySelector('app-header-auth');
      if (headerAuth) {
        console.log('🔍 Header auth found, checking shadow root...');
        const shadowRoot = headerAuth.shadowRoot;
        if (shadowRoot) {
          const menuItems = shadowRoot.querySelectorAll('.menu-item');
          console.log('📋 Menu items found:', menuItems.length);
          menuItems.forEach((item, index) => {
            console.log(`📋 Menu item ${index}:`, item.textContent);
          });
        }
      }
    }
  }
  
  // Función para forzar redirección a dashboard de proveedores
  function forceRedirectToProviderDashboard() {
    console.log('🚀 Forcing redirect to provider dashboard...');
    window.location.href = '../pages/provider-dashboard.html';
  }
  
  // Exponer funciones globalmente
  window.debugUserStatus = debugUserStatus;
  window.simulateProfileClick = simulateProfileClick;
  window.forceRedirectToProviderDashboard = forceRedirectToProviderDashboard;
  
  // Ejecutar debug automáticamente después de un delay
  setTimeout(() => {
    console.log('🔍 Auto-running debug...');
    debugUserStatus();
  }, 2000);
  
  console.log('✅ Debug Provider Script Ready');
  console.log('📝 Available commands:');
  console.log('  - debugUserStatus()');
  console.log('  - simulateProfileClick()');
  console.log('  - forceRedirectToProviderDashboard()');
})();



