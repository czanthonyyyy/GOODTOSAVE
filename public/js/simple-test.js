// Script simple para verificar redirección
(function() {
  console.log('🔍 Simple Test Script Loaded');
  
  // Función para verificar usuario
  function checkUser() {
    const storedUser = localStorage.getItem('user');
    console.log('📋 Stored user:', storedUser);
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('👤 User data:', user);
        console.log('🏷️ Account type:', user.accountType);
        
        if (user.accountType === 'provider') {
          console.log('✅ User is provider');
          return 'provider';
        } else {
          console.log('✅ User is buyer');
          return 'buyer';
        }
      } catch (e) {
        console.error('❌ Error parsing user:', e);
        return null;
      }
    } else {
      console.log('❌ No user data found');
      return null;
    }
  }
  
  // Función para ir al dashboard
  function goToDashboard() {
    const userType = checkUser();
    
    if (userType === 'provider') {
      console.log('🚀 Going to provider dashboard...');
      window.location.href = '../pages/provider-dashboard.html';
    } else {
      console.log('🚀 Going to homepage...');
      window.location.href = '../pages/index.html';
    }
  }
  
  // Exponer funciones
  window.checkUser = checkUser;
  window.goToDashboard = goToDashboard;
  
  console.log('✅ Simple Test Ready');
  console.log('📝 Commands: checkUser(), goToDashboard()');
})();



