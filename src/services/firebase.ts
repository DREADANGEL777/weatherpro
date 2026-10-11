import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Without a key getAuth() throws on import and blanks the whole app.
export const auth = apiKey
  ? getAuth(
      initializeApp({
        apiKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      }),
    )
  : null

export const googleProvider = new GoogleAuthProvider()
