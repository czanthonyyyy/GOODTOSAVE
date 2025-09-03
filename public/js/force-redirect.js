// Script para forzar redirección al dashboard
(function() {
  console.log('🚀 Force Redirect Script Loaded');
  
  // Función para ir al dashboard de proveedores
  function goToProviderDashboard() {
    console.log('🚀 Forcing redirect to provider dashboard...');
    window.location.href = '../pages/provider-dashboard.html';
  }
  
  // Función para verificar y redirigir
  function checkAndRedirect() {
    const storedUser = localStorage.getItem('user');
    console.log('📋 Checking user data...');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('👤 User:', user);
        console.log('🏷️ Account type:', user.accountType);
        
        if (user.accountType === 'provider') {
          console.log('✅ Provider detected, redirecting...');
          goToProviderDashboard();
        } else {
          console.log('❌ Not a provider, staying here');
        }
      } catch (e) {
        console.error('❌ Error:', e);
      }
    } else {
      console.log('❌ No user data found');
    }
  }
  
  // Función para simular clic en perfil
  function clickProfile() {
    console.log('🔍 Simulating profile click...');
    
    // Buscar el header auth
    const headerAuth = document.querySelector('app-header-auth');
    if (!headerAuth) {
      console.error('❌ Header auth not found');
      return;
    }
    
    const shadowRoot = headerAuth.shadowRoot;
    if (!shadowRoot) {
      console.error('❌ Shadow root not found');
      return;
    }
    
    // Buscar el botón de perfil
    const profileButton = shadowRoot.getElementById('menu-profile');
    if (!profileButton) {
      console.error('❌ Profile button not found');
      return;
    }
    
    console.log('✅ Found profile button, clicking...');
    profileButton.click();
  }
  
  // Exponer funciones
  window.goToProviderDashboard = goToProviderDashboard;
  window.checkAndRedirect = checkAndRedirect;
  window.clickProfile = clickProfile;
  
  console.log('✅ Force Redirect Ready');
  console.log('📝 Commands:');
  console.log('  - goToProviderDashboard()');
  console.log('  - checkAndRedirect()');
  console.log('  - clickProfile()');
  
  // Auto-ejecutar verificación
  setTimeout(() => {
    console.log('🔍 Auto-checking user...');
    checkAndRedirect();
  }, 2000);
})();



