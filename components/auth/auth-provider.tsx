"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { syncAuthUserToPublicUsers } from "@/lib/user-sync"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  syncUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Sync user in background
      if (session?.user) {
        syncAuthUserToPublicUsers().catch(() => {})
      }
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      setLoading(false)

      // Sync on sign in
      if (session?.user && event === "SIGNED_IN") {
        syncAuthUserToPublicUsers().catch(() => {})
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // 1. Create the account
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        // No confirmation link – you can re-enable later via dashboard if desired
        emailRedirectTo: undefined,
      },
    })

    if (signUpError) {
      throw signUpError
    }

    // 2. Immediately sign the user in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      throw signInError
    }
  }

  const signOut = async () => {
    try {
      // Clear user state immediately for better UX
      setUser(null)

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear localStorage auth items
      if (typeof window !== "undefined") {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("supabase") || key.includes("auth")) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch {
      // Still clear the user state even if there's an error
      setUser(null)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/simple-reset`,
    })
    if (error) {
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      throw error
    }
  }

  const syncUser = async () => {
    await syncAuthUserToPublicUsers()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
