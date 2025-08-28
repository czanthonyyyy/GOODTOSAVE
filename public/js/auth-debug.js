/**
 * Auth Debug Helper
 * Utilidades para debugging del sistema de autenticación
 */

class AuthDebug {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
    }

    log(message, type = 'info', data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type,
            message,
            data
        };

        this.logs.push(logEntry);
        
        // Mantener solo los últimos logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Log a consola con colores
        const colors = {
            info: 'color: #0066cc',
            success: 'color: #00cc00',
            warning: 'color: #ff9900',
            error: 'color: #cc0000'
        };

        console.log(`%c[Auth Debug] ${message}`, colors[type] || colors.info);
        if (data) {
            console.log(data);
        }
    }

    checkFirebaseStatus() {
        this.log('Verificando estado de Firebase...', 'info');
        
        const status = {
            firebase: typeof firebase !== 'undefined',
            firebaseServices: !!window.firebaseServices,
            firebaseAuthService: !!window.firebaseAuthService,
            auth: !!window.firebaseServices?.auth,
            db: !!window.firebaseServices?.db
        };

        this.log('Estado de Firebase:', 'info', status);
        return status;
    }

    checkAuthService() {
        this.log('Verificando servicio de autenticación...', 'info');
        
        if (!window.firebaseAuthService) {
            this.log('firebaseAuthService no está disponible', 'error');
            return false;
        }

        const service = window.firebaseAuthService;
        const status = {
            initialized: service.initialized,
            auth: !!service.auth,
            db: !!service.db,
            currentUser: !!service.getCurrentUser()
        };

        this.log('Estado del servicio de autenticación:', 'info', status);
        return status;
    }

    testSignIn(email, password) {
        this.log(`Probando inicio de sesión con: ${email}`, 'info');
        
        return new Promise(async (resolve) => {
            try {
                const startTime = Date.now();
                const user = await window.firebaseAuthService.signIn(email, password);
                const endTime = Date.now();
                
                this.log('Inicio de sesión exitoso', 'success', {
                    user: user.uid,
                    email: user.email,
                    duration: `${endTime - startTime}ms`
                });
                
                resolve({ success: true, user, duration: endTime - startTime });
            } catch (error) {
                this.log('Error en inicio de sesión', 'error', {
                    code: error.code,
                    message: error.message
                });
                
                resolve({ success: false, error });
            }
        });
    }

    getLogs() {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
        this.log('Logs limpiados', 'info');
    }

    exportLogs() {
        const dataStr = JSON.stringify(this.logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `auth-debug-${new Date().toISOString().slice(0, 19)}.json`;
        link.click();
    }
}

// Crear instancia global
window.AuthDebug = new AuthDebug();

// Auto-check al cargar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.AuthDebug.checkFirebaseStatus();
        window.AuthDebug.checkAuthService();
    }, 1000);
});

// Exponer funciones útiles globalmente
window.debugAuth = {
    checkStatus: () => window.AuthDebug.checkFirebaseStatus(),
    checkService: () => window.AuthDebug.checkAuthService(),
    testSignIn: (email, password) => window.AuthDebug.testSignIn(email, password),
    getLogs: () => window.AuthDebug.getLogs(),
    clearLogs: () => window.AuthDebug.clearLogs(),
    exportLogs: () => window.AuthDebug.exportLogs()
};
