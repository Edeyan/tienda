import {
  getAuth,
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { auth } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Role } from '../types';
import { syncFirebase } from './firestoreSync';

import { gmailService } from './gmailService';

let googleSignInInProgress = false;

const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado. Inicia sesión o usa otro correo.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 8 caracteres.';
    case 'auth/invalid-email':
      return 'El formato del correo electrónico es inválido.';
    case 'auth/operation-not-allowed':
      return 'El registro por correo está desactivado en Firebase. Activa Email/Password en Firebase Console > Authentication > Sign-in method.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication no está configurado para este proyecto.';
    case 'auth/network-request-failed':
      return 'No hay conexión con Firebase. Verifica tu conexión a internet e inténtalo de nuevo.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.';
    case 'auth/email-not-verified':
      return 'Debes verificar tu correo electrónico antes de iniciar sesión.';
    default:
      if (code === 'auth/internal-error' || code === 'auth/network-request-failed') {
        return 'No se pudo conectar con el servicio de autenticación. Inténtalo de nuevo.';
      }
      return fallback;
  }
};

export const firebaseAuthService = {
  createUserAsAdmin: async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    const secondaryApp = initializeApp(firebaseConfig, `admin-user-${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);
    try {
      let result;
      try {
        result = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
      } catch (error) {
        const code = typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : '';
        if (code !== 'auth/email-already-in-use') {
          throw error;
        }
        // A previous attempt may have created Authentication but failed before
        // writing the Firestore profile. Reuse that account to repair it.
        result = await signInWithEmailAndPassword(secondaryAuth, email.trim(), password);
      }
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
      }
      return { success: true, user: result.user };
    } catch (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error, 'No se pudo crear el usuario en Firebase Authentication.')
      };
    } finally {
      await signOut(secondaryAuth);
    }
  },

  // Sign in with Google Popup
  signInWithGoogle: async (): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    if (googleSignInInProgress) {
      return { success: false, error: 'Ya hay una ventana de Google abierta. Completa ese proceso o ciérrala para intentarlo de nuevo.' };
    }

    googleSignInInProgress = true;
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        
        gmailService.setAccessToken(credential.accessToken);
      }
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn('Firebase Google Sign-In error:', error);
      // Handle known Firebase Auth errors
      let msg = 'Error al iniciar sesión con Google.';
      if (error.code === 'auth/popup-closed-by-user') {
        msg = 'La ventana de autenticación fue cerrada.';
      } else if (error.code === 'auth/popup-blocked') {
        msg = 'El navegador bloqueó la ventana emergente. Por favor permite popups.';
      } else if (error.code === 'auth/unauthorized-domain') {
        msg = 'Dominio no autorizado en Firebase Auth. Usa el login directo o agrega el dominio en Firebase Console.';
      } else {
        msg = getAuthErrorMessage(error, msg);
      }
      return { success: false, error: msg };
    } finally {
      googleSignInInProgress = false;
    }
  },

  // Sign in with Email & Password
  signInWithEmail: async (email: string, password: string): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
        await signOut(auth);
        return {
          success: false,
          error: 'Tu correo no está verificado. Te enviamos un nuevo enlace de verificación.'
        };
      }
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn('Firebase Email Sign-In error:', error);
      let msg = 'Error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'Correo electrónico o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'El formato del correo electrónico es inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Demasiados intentos fallidos. Intenta más tarde.';
      } else if (error.code === 'auth/user-disabled') {
        msg = 'Esta cuenta está desactivada. Contacta al administrador.';
      } else {
        msg = getAuthErrorMessage(error, msg);
      }
      return { success: false, error: msg };
    }
  },

  sendPasswordReset: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error, 'No se pudo enviar el enlace para restablecer la contraseña.')
      };
    }
  },

  // Register with Email & Password
  registerWithEmail: async (
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      await sendEmailVerification(result.user);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn('Firebase Email Register error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error, 'No se pudo crear la cuenta en Firebase.')
      };
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Firebase sign out error:', error);
    }
  },

  // Auth state listener
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};
