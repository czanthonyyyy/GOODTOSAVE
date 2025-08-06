const { auth } = require('../config/firebase-admin');
const databaseService = require('./database');

class AuthService {
  constructor() {
    this.auth = auth;
  }

  // Verificar token de autenticación
  async verifyToken(token) {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        role: decodedToken.role || 'user'
      };
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  // Crear usuario en Firebase Auth
  async createUser(userData) {
    try {
      const userRecord = await this.auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
        emailVerified: false
      });

      // Crear documento de usuario en Firestore
      const userDoc = await databaseService.createUser({
        uid: userRecord.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        accountType: userData.accountType,
        location: userData.location || null,
        role: 'user'
      });

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userDoc
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Obtener usuario por UID
  async getUserByUid(uid) {
    try {
      const userRecord = await this.auth.getUser(uid);
      const userDoc = await databaseService.getUserById(uid);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        ...userDoc
      };
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  }

  // Actualizar usuario
  async updateUser(uid, updateData) {
    try {
      // Actualizar en Firebase Auth
      const authUpdate = {};
      if (updateData.displayName) authUpdate.displayName = updateData.displayName;
      if (updateData.email) authUpdate.email = updateData.email;
      if (updateData.password) authUpdate.password = updateData.password;

      if (Object.keys(authUpdate).length > 0) {
        await this.auth.updateUser(uid, authUpdate);
      }

      // Actualizar en Firestore
      const firestoreUpdate = { ...updateData };
      delete firestoreUpdate.password; // No guardar contraseña en Firestore
      
      const updatedUser = await databaseService.updateUser(uid, firestoreUpdate);
      
      return {
        uid,
        ...updatedUser
      };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Eliminar usuario
  async deleteUser(uid) {
    try {
      // Eliminar de Firebase Auth
      await this.auth.deleteUser(uid);
      
      // Eliminar de Firestore
      await databaseService.deleteUser(uid);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Enviar email de verificación
  async sendEmailVerification(uid) {
    try {
      const actionCodeSettings = {
        url: process.env.EMAIL_VERIFICATION_URL || 'http://localhost:3000/auth.html',
        handleCodeInApp: true
      };
      
      await this.auth.generateEmailVerificationLink(uid, actionCodeSettings);
      return { success: true };
    } catch (error) {
      throw new Error(`Error sending verification email: ${error.message}`);
    }
  }

  // Enviar email de reset de contraseña
  async sendPasswordResetEmail(email) {
    try {
      const actionCodeSettings = {
        url: process.env.PASSWORD_RESET_URL || 'http://localhost:3000/auth.html',
        handleCodeInApp: true
      };
      
      await this.auth.generatePasswordResetLink(email, actionCodeSettings);
      return { success: true };
    } catch (error) {
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  }

  // Verificar email
  async verifyEmail(actionCode) {
    try {
      await this.auth.verifyEmail(actionCode);
      return { success: true };
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  // Confirmar reset de contraseña
  async confirmPasswordReset(actionCode, newPassword) {
    try {
      await this.auth.confirmPasswordReset(actionCode, newPassword);
      return { success: true };
    } catch (error) {
      throw new Error(`Error confirming password reset: ${error.message}`);
    }
  }

  // Middleware para verificar autenticación
  async authenticateUser(req, res, next) {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const user = await this.verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Middleware para verificar roles
  async requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }
}

module.exports = new AuthService(); 