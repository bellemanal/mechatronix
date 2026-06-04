import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export async function signUpWithEmail(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, {
    displayName,
    photoURL: null,
  })
  // Optionally send verification email
  // await sendEmailVerification(credential.user)
  return credential.user
}

// ─── Sign In ──────────────────────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  return credential.user
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function logOut() {
  await signOut(auth)
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// ─── Auth State Observer ──────────────────────────────────────────────────────
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

// ─── Error Message Mapper ─────────────────────────────────────────────────────
export function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled': 'This account has been disabled.',
  }
  return messages[code] || 'Something went wrong. Please try again.'
}
