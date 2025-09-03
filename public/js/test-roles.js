/**
 * Script de Prueba del Sistema de Roles
 * Para verificar que todo funciona correctamente
 */
(function() {
  console.log('🧪 Testing Roles System...');
  
  // Función para probar el sistema completo
  async function testRolesSystem() {
    console.log('=== TESTING ROLES SYSTEM ===');
    
    // 1. Verificar que RolesHelper esté disponible
    if (!window.RolesHelper) {
      console.error('❌ RolesHelper not available');
      return;
    }
    console.log('✅ RolesHelper is available');
    
    // 2. Verificar autenticación
    const isAuth = await window.RolesHelper.isAuthenticated();
    console.log('🔐 User authenticated:', isAuth);
    
    if (!isAuth) {
      console.warn('⚠️ User not authenticated, cannot test further');
      return;
    }
    
    // 3. Obtener información del usuario
    const userInfo = await window.RolesHelper.getCurrentUserInfo();
    console.log('👤 User info:', userInfo);
    
    // 4. Obtener rol actual
    const currentRole = await window.RolesHelper.getCurrentUserRole();
    console.log('🎭 Current role:', currentRole);
    
    // 5. Verificar consistencia
    if (userInfo && userInfo.role === currentRole) {
      console.log('✅ Role consistency: OK');
    } else {
      console.warn('⚠️ Role inconsistency detected');
    }
    
    // 6. Probar normalización de roles
    const testRoles = ['provider', 'seller', 'vendor', 'buyer', 'customer', 'unknown'];
    console.log('🧪 Testing role normalization:');
    testRoles.forEach(role => {
      const normalized = window.RolesHelper.normalizeRole(role);
      console.log(`  ${role} -> ${normalized}`);
    });
    
    // 7. Simular redirección
    console.log('🔄 Testing redirections:');
    if (currentRole === 'provider') {
      console.log('  Provider should go to: ../pages/provider-dashboard.html');
    } else {
      console.log('  Buyer should go to: ../pages/index.html');
    }
    
    console.log('=== END TEST ===');
  }
  
  // Función para simular clic en perfil
  function testProfileClick() {
    console.log('🔍 Testing profile click...');
    
    // Buscar el botón de perfil
    const headerAuth = document.querySelector('app-header-auth');
    if (!headerAuth) {
      console.error('❌ app-header-auth not found');
      return;
    }
    
    const shadowRoot = headerAuth.shadowRoot;
    if (!shadowRoot) {
      console.error('❌ Shadow root not found');
      return;
    }
    
    const profileButton = shadowRoot.getElementById('menu-profile');
    if (!profileButton) {
      console.error('❌ Profile button not found');
      return;
    }
    
    console.log('✅ Found profile button, clicking...');
    profileButton.click();
  }
  
  // Función para forzar redirección
  function forceRedirect() {
    console.log('🚀 Force redirecting...');
    
    // Obtener rol y redirigir
    window.RolesHelper.getCurrentUserRole().then(role => {
      console.log('🎭 Current role:', role);
      
      if (role === 'provider') {
        console.log('🔄 Redirecting to provider dashboard...');
        window.location.href = '../pages/provider-dashboard.html';
      } else {
        console.log('🔄 Redirecting to homepage...');
        window.location.href = '../pages/index.html';
      }
    }).catch(e => {
      console.error('❌ Error getting role:', e);
      console.log('🔄 Redirecting to homepage as fallback...');
      window.location.href = '../pages/index.html';
    });
  }
  
  // Función para limpiar cache y probar de nuevo
  function clearCacheAndTest() {
    console.log('🧹 Clearing cache and testing again...');
    window.RolesHelper.clearRoleCache();
    setTimeout(testRolesSystem, 1000);
  }
  
  // Exponer funciones globalmente
  window.testRolesSystem = testRolesSystem;
  window.testProfileClick = testProfileClick;
  window.forceRedirect = forceRedirect;
  window.clearCacheAndTest = clearCacheAndTest;
  
  // Ejecutar test automáticamente después de un delay
  setTimeout(() => {
    console.log('🧪 Auto-running roles test...');
    testRolesSystem();
  }, 3000);
  
  console.log('✅ Roles Test Script Ready');
  console.log('📝 Available commands:');
  console.log('  - testRolesSystem()');
  console.log('  - testProfileClick()');
  console.log('  - forceRedirect()');
  console.log('  - clearCacheAndTest()');
})();



