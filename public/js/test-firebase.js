/**
 * Test Script para Firebase
 * Prueba todas las funcionalidades de Firebase
 */

class FirebaseTester {
  constructor() {
    this.testResults = [];
  }

  /**
   * Ejecuta todas las pruebas
   */
  async runAllTests() {
    console.log('🧪 INICIANDO PRUEBAS DE FIREBASE');
    
    await this.testFirebaseSDK();
    await this.testFirebaseServices();
    await this.testAuthentication();
    await this.testFirestore();
    await this.testStorage();
    
    this.showResults();
  }

  /**
   * Prueba que Firebase SDK esté cargado
   */
  async testFirebaseSDK() {
    console.log('📦 Probando Firebase SDK...');
    
    if (typeof firebase === 'undefined') {
      this.addResult('Firebase SDK', false, 'Firebase SDK no está cargado');
      return;
    }
    
    if (!firebase.apps || firebase.apps.length === 0) {
      this.addResult('Firebase SDK', false, 'Firebase no está inicializado');
      return;
    }
    
    this.addResult('Firebase SDK', true, 'Firebase SDK cargado correctamente');
  }

  /**
   * Prueba que los servicios de Firebase estén disponibles
   */
  async testFirebaseServices() {
    console.log('🔧 Probando servicios de Firebase...');
    
    if (!window.firebaseServices) {
      this.addResult('Firebase Services', false, 'Servicios de Firebase no disponibles');
      return;
    }
    
    const { auth, db, storage } = window.firebaseServices;
    
    if (!auth) {
      this.addResult('Firebase Auth', false, 'Firebase Auth no disponible');
    } else {
      this.addResult('Firebase Auth', true, 'Firebase Auth disponible');
    }
    
    if (!db) {
      this.addResult('Firestore', false, 'Firestore no disponible');
    } else {
      this.addResult('Firestore', true, 'Firestore disponible');
    }
    
    if (!storage) {
      this.addResult('Firebase Storage', false, 'Firebase Storage no disponible');
    } else {
      this.addResult('Firebase Storage', true, 'Firebase Storage disponible');
    }
  }

  /**
   * Prueba la autenticación
   */
  async testAuthentication() {
    console.log('🔐 Probando autenticación...');
    
    if (!window.firebaseService) {
      this.addResult('Firebase Service', false, 'Firebase Service no disponible');
      return;
    }
    
    const service = window.firebaseService;
    
    // Probar métodos de autenticación
    const methods = ['signUp', 'signIn', 'signOut', 'getCurrentUser', 'getErrorMessage'];
    let allMethodsAvailable = true;
    
    methods.forEach(method => {
      if (typeof service[method] !== 'function') {
        this.addResult(`Método ${method}`, false, `Método ${method} no disponible`);
        allMethodsAvailable = false;
      }
    });
    
    if (allMethodsAvailable) {
      this.addResult('Métodos de Auth', true, 'Todos los métodos de autenticación disponibles');
    }
    
    // Probar usuario actual
    try {
      const currentUser = await service.getCurrentUser();
      if (currentUser) {
        this.addResult('Usuario Actual', true, `Usuario autenticado: ${currentUser.email}`);
      } else {
        this.addResult('Usuario Actual', true, 'No hay usuario autenticado');
      }
    } catch (error) {
      this.addResult('Usuario Actual', false, `Error: ${error.message}`);
    }
  }

  /**
   * Prueba Firestore
   */
  async testFirestore() {
    console.log('🗄️ Probando Firestore...');
    
    if (!window.firebaseServices || !window.firebaseServices.db) {
      this.addResult('Conexión Firestore', false, 'Firestore no disponible');
      return;
    }
    
    try {
      const db = window.firebaseServices.db;
      
      // Probar lectura de una colección de prueba
      const testDoc = await db.collection('test').doc('connection-test').get();
      this.addResult('Conexión Firestore', true, 'Conexión a Firestore exitosa');
      
      // Probar escritura (solo si estamos en modo de desarrollo)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        try {
          await db.collection('test').doc('write-test').set({
            timestamp: new Date(),
            test: true
          });
          this.addResult('Escritura Firestore', true, 'Escritura en Firestore exitosa');
        } catch (error) {
          this.addResult('Escritura Firestore', false, `Error de escritura: ${error.message}`);
        }
      }
    } catch (error) {
      this.addResult('Conexión Firestore', false, `Error de conexión: ${error.message}`);
    }
  }

  /**
   * Prueba Firebase Storage
   */
  async testStorage() {
    console.log('📁 Probando Firebase Storage...');
    
    if (!window.firebaseServices || !window.firebaseServices.storage) {
      this.addResult('Firebase Storage', false, 'Firebase Storage no disponible');
      return;
    }
    
    try {
      const storage = window.firebaseServices.storage;
      const storageRef = storage.ref();
      
      // Probar acceso al storage
      const testRef = storageRef.child('test/connection-test.txt');
      this.addResult('Firebase Storage', true, 'Firebase Storage disponible');
    } catch (error) {
      this.addResult('Firebase Storage', false, `Error: ${error.message}`);
    }
  }

  /**
   * Agrega un resultado de prueba
   */
  addResult(test, passed, message) {
    this.testResults.push({
      test,
      passed,
      message,
      timestamp: new Date()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${test}: ${message}`);
  }

  /**
   * Muestra los resultados finales
   */
  showResults() {
    console.log('\n📊 RESULTADOS DE LAS PRUEBAS:');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log(`Pruebas pasadas: ${passed}/${total} (${percentage}%)`);
    console.log('');
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
    });
    
    console.log('\n' + '='.repeat(50));
    
    if (percentage === 100) {
      console.log('🎉 ¡Todas las pruebas pasaron! Firebase está configurado correctamente.');
    } else if (percentage >= 80) {
      console.log('⚠️ La mayoría de las pruebas pasaron. Revisa los errores.');
    } else {
      console.log('❌ Muchas pruebas fallaron. Revisa la configuración de Firebase.');
    }
    
    // Mostrar resultados en la página
    this.showResultsInPage();
  }

  /**
   * Muestra los resultados en la página
   */
  showResultsInPage() {
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);
    
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'firebase-test-results';
    resultsDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #333;
      border-radius: 10px;
      padding: 20px;
      max-width: 500px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    const title = document.createElement('h3');
    title.textContent = '🧪 Resultados de Pruebas Firebase';
    title.style.marginBottom = '15px';
    title.style.color = '#333';
    
    const summary = document.createElement('p');
    summary.innerHTML = `<strong>Pruebas pasadas:</strong> ${passed}/${total} (${percentage}%)`;
    summary.style.marginBottom = '15px';
    
    const resultsList = document.createElement('ul');
    resultsList.style.listStyle = 'none';
    resultsList.style.padding = '0';
    
    this.testResults.forEach(result => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.style.padding = '5px';
      li.style.borderRadius = '3px';
      li.style.backgroundColor = result.passed ? '#e8f5e8' : '#ffe8e8';
      
      const status = result.passed ? '✅' : '❌';
      li.innerHTML = `<strong>${status} ${result.test}:</strong> ${result.message}`;
      
      resultsList.appendChild(li);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cerrar';
    closeBtn.style.cssText = `
      margin-top: 15px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => resultsDiv.remove();
    
    resultsDiv.appendChild(title);
    resultsDiv.appendChild(summary);
    resultsDiv.appendChild(resultsList);
    resultsDiv.appendChild(closeBtn);
    
    document.body.appendChild(resultsDiv);
  }
}

// Ejecutar pruebas cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar en la página de auth
  if (window.location.pathname.includes('auth.html')) {
    setTimeout(() => {
      const tester = new FirebaseTester();
      tester.runAllTests();
    }, 2000); // Esperar 2 segundos para que Firebase se cargue
  }
});

// Exponer para uso manual
window.FirebaseTester = FirebaseTester; 