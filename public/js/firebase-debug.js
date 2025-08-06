/**
 * Firebase Debug Script
 * Diagnóstica problemas de configuración de Firebase
 */

class FirebaseDebugger {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  /**
   * Ejecuta diagnóstico completo
   */
  async runDiagnostic() {
    console.log('🔍 INICIANDO DIAGNÓSTICO DE FIREBASE');
    console.log('='.repeat(50));

    await this.checkFirebaseSDK();
    await this.checkConfiguration();
    await this.checkServices();
    await this.checkProjectConnection();
    await this.checkAuthentication();
    await this.checkFirestore();
    await this.checkStorage();

    this.showResults();
  }

  /**
   * Verifica que Firebase SDK esté cargado
   */
  async checkFirebaseSDK() {
    console.log('📦 Verificando Firebase SDK...');

    if (typeof firebase === 'undefined') {
      this.addIssue('Firebase SDK', 'Firebase SDK no está cargado');
      return;
    }

    if (!firebase.apps || firebase.apps.length === 0) {
      this.addIssue('Firebase SDK', 'Firebase no está inicializado');
      return;
    }

    const app = firebase.app();
    console.log('✅ Firebase SDK cargado');
    console.log('   - App name:', app.name);
    console.log('   - App options:', app.options);
    
    this.addSuccess('Firebase SDK', 'Firebase SDK cargado correctamente');
  }

  /**
   * Verifica la configuración
   */
  async checkConfiguration() {
    console.log('⚙️ Verificando configuración...');

    if (!window.firebaseServices) {
      this.addIssue('Configuración', 'Servicios de Firebase no disponibles');
      return;
    }

    const { auth, db, storage } = window.firebaseServices;
    
    if (!auth) {
      this.addIssue('Auth Service', 'Firebase Auth no disponible');
    } else {
      this.addSuccess('Auth Service', 'Firebase Auth disponible');
    }

    if (!db) {
      this.addIssue('Firestore Service', 'Firestore no disponible');
    } else {
      this.addSuccess('Firestore Service', 'Firestore disponible');
    }

    if (!storage) {
      this.addIssue('Storage Service', 'Firebase Storage no disponible');
    } else {
      this.addSuccess('Storage Service', 'Firebase Storage disponible');
    }
  }

  /**
   * Verifica conexión al proyecto
   */
  async checkProjectConnection() {
    console.log('🌐 Verificando conexión al proyecto...');

    if (!window.firebaseServices || !window.firebaseServices.db) {
      this.addIssue('Conexión', 'Firestore no disponible para verificar conexión');
      return;
    }

    const db = window.firebaseServices.db;
    const app = db.app;
    
    console.log('   - Project ID:', app.options.projectId);
    console.log('   - Database ID:', app.options.databaseId);
    console.log('   - Auth Domain:', app.options.authDomain);

    // Verificar que el projectId sea correcto
    if (app.options.projectId !== 'proto-gts') {
      this.addIssue('Project ID', `Project ID incorrecto: ${app.options.projectId} (debería ser 'proto-gts')`);
    } else {
      this.addSuccess('Project ID', `Project ID correcto: ${app.options.projectId}`);
    }
  }

  /**
   * Verifica autenticación
   */
  async checkAuthentication() {
    console.log('🔐 Verificando autenticación...');

    if (!window.firebaseService) {
      this.addIssue('Firebase Service', 'Firebase Service no disponible');
      return;
    }

    const service = window.firebaseService;
    const methods = ['signUp', 'signIn', 'signOut', 'getCurrentUser', 'getErrorMessage'];

    let allMethodsAvailable = true;
    methods.forEach(method => {
      if (typeof service[method] !== 'function') {
        this.addIssue(`Método ${method}`, `Método ${method} no disponible`);
        allMethodsAvailable = false;
      }
    });

    if (allMethodsAvailable) {
      this.addSuccess('Métodos de Auth', 'Todos los métodos de autenticación disponibles');
    }

    // Verificar usuario actual
    try {
      const currentUser = await service.getCurrentUser();
      if (currentUser) {
        this.addSuccess('Usuario Actual', `Usuario autenticado: ${currentUser.email}`);
      } else {
        this.addSuccess('Usuario Actual', 'No hay usuario autenticado');
      }
    } catch (error) {
      this.addIssue('Usuario Actual', `Error: ${error.message}`);
    }
  }

  /**
   * Verifica Firestore
   */
  async checkFirestore() {
    console.log('🗄️ Verificando Firestore...');

    if (!window.firebaseServices || !window.firebaseServices.db) {
      this.addIssue('Firestore', 'Firestore no disponible');
      return;
    }

    try {
      const db = window.firebaseServices.db;
      
      // Verificar configuración de Firestore
      console.log('   - Firestore settings:', {
        projectId: db.app.options.projectId,
        databaseId: db.app.options.databaseId
      });

      // Probar conexión con una lectura simple
      const testDoc = await db.collection('test').doc('connection-test').get();
      this.addSuccess('Conexión Firestore', 'Conexión a Firestore exitosa');
      
    } catch (error) {
      console.error('❌ Error de Firestore:', error);
      
      if (error.code === 'unavailable') {
        this.addIssue('Conexión Firestore', 'Firestore no disponible - verifica tu conexión a internet y las reglas de seguridad');
      } else if (error.code === 'permission-denied') {
        this.addIssue('Permisos Firestore', 'Acceso denegado - verifica las reglas de seguridad de Firestore');
      } else {
        this.addIssue('Conexión Firestore', `Error: ${error.message}`);
      }
    }
  }

  /**
   * Verifica Storage
   */
  async checkStorage() {
    console.log('📁 Verificando Firebase Storage...');

    if (!window.firebaseServices || !window.firebaseServices.storage) {
      this.addIssue('Storage', 'Firebase Storage no disponible');
      return;
    }

    try {
      const storage = window.firebaseServices.storage;
      const storageRef = storage.ref();
      
      this.addSuccess('Firebase Storage', 'Firebase Storage disponible');
    } catch (error) {
      this.addIssue('Firebase Storage', `Error: ${error.message}`);
    }
  }

  /**
   * Verifica servicios
   */
  async checkServices() {
    console.log('🔧 Verificando servicios...');

    if (!window.firebaseServices) {
      this.addIssue('Servicios', 'Servicios de Firebase no disponibles');
      return;
    }

    const { auth, db, storage } = window.firebaseServices;
    
    if (auth && db && storage) {
      this.addSuccess('Servicios', 'Todos los servicios de Firebase disponibles');
    } else {
      const missing = [];
      if (!auth) missing.push('Auth');
      if (!db) missing.push('Firestore');
      if (!storage) missing.push('Storage');
      
      this.addIssue('Servicios', `Servicios faltantes: ${missing.join(', ')}`);
    }
  }

  /**
   * Agrega un problema
   */
  addIssue(category, message) {
    this.issues.push({ category, message, timestamp: new Date() });
    console.log(`❌ ${category}: ${message}`);
  }

  /**
   * Agrega una advertencia
   */
  addWarning(category, message) {
    this.warnings.push({ category, message, timestamp: new Date() });
    console.log(`⚠️ ${category}: ${message}`);
  }

  /**
   * Agrega un éxito
   */
  addSuccess(category, message) {
    this.successes.push({ category, message, timestamp: new Date() });
    console.log(`✅ ${category}: ${message}`);
  }

  /**
   * Muestra resultados
   */
  showResults() {
    console.log('\n📊 RESULTADOS DEL DIAGNÓSTICO:');
    console.log('='.repeat(50));

    const total = this.issues.length + this.warnings.length + this.successes.length;
    const issues = this.issues.length;
    const warnings = this.warnings.length;
    const successes = this.successes.length;

    console.log(`Total de verificaciones: ${total}`);
    console.log(`✅ Éxitos: ${successes}`);
    console.log(`⚠️ Advertencias: ${warnings}`);
    console.log(`❌ Problemas: ${issues}`);

    if (issues > 0) {
      console.log('\n❌ PROBLEMAS ENCONTRADOS:');
      this.issues.forEach(issue => {
        console.log(`   - ${issue.category}: ${issue.message}`);
      });
    }

    if (warnings > 0) {
      console.log('\n⚠️ ADVERTENCIAS:');
      this.warnings.forEach(warning => {
        console.log(`   - ${warning.category}: ${warning.message}`);
      });
    }

    if (successes > 0) {
      console.log('\n✅ VERIFICACIONES EXITOSAS:');
      this.successes.forEach(success => {
        console.log(`   - ${success.category}: ${success.message}`);
      });
    }

    console.log('\n' + '='.repeat(50));

    // Mostrar recomendaciones
    this.showRecommendations();
  }

  /**
   * Muestra recomendaciones
   */
  showRecommendations() {
    console.log('\n💡 RECOMENDACIONES:');

    const hasProjectIdIssue = this.issues.some(issue => 
      issue.category.includes('Project ID') || issue.message.includes('projectId')
    );

    const hasFirestoreIssue = this.issues.some(issue => 
      issue.category.includes('Firestore') || issue.message.includes('Firestore')
    );

    if (hasProjectIdIssue) {
      console.log('🔧 Para problemas de Project ID:');
      console.log('   1. Limpia la caché del navegador (Ctrl+Shift+Delete)');
      console.log('   2. Recarga la página con Ctrl+F5');
      console.log('   3. Verifica que firebase-config.js tenga el projectId correcto');
    }

    if (hasFirestoreIssue) {
      console.log('🔧 Para problemas de Firestore:');
      console.log('   1. Verifica que Firestore esté habilitado en Firebase Console');
      console.log('   2. Verifica las reglas de seguridad de Firestore');
      console.log('   3. Asegúrate de tener conexión a internet');
    }

    if (this.issues.length === 0) {
      console.log('🎉 ¡Todo parece estar funcionando correctamente!');
    }
  }
}

// Ejecutar diagnóstico cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar en la página de auth
  if (window.location.pathname.includes('auth.html')) {
    setTimeout(() => {
      const debugger = new FirebaseDebugger();
      debugger.runDiagnostic();
    }, 2000); // Esperar 2 segundos para que Firebase se cargue
  }
});

// Exponer para uso manual
window.FirebaseDebugger = FirebaseDebugger; 