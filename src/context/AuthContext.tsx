import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"

import { auth, googleProvider } from "../services/firebase"

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase is not configured.")
      setLoading(false)

      return
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) return null

    try {
      const result = await signInWithPopup(auth, googleProvider)

      return result.user
    } catch (err) {
      console.error("Firebase sign-in failed:", err)

      return null
    }
  }, [])

  const signOut = useCallback(async () => {
    if (auth) await firebaseSignOut(auth)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signOut }),
    [user, loading, signInWithGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
