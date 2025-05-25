import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyC6PTbwjl62uezvy5vbftYLKWyMBouraZg",
  authDomain: "micro-ai-compliance.firebaseapp.com",
  projectId: "micro-ai-compliance",
  storageBucket: "micro-ai-compliance.firebasestorage.app",
  messagingSenderId: "486111397812",
  appId: "1:486111397812:web:5d4597f94141394b8654e1",
  measurementId: "G-4TPG7G6VPY"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Analytics only in browser environment
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && getAnalytics(app))
}