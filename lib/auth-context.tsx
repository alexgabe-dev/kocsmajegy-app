"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

type User = {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  avatarUrl?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  supabase: ReturnType<typeof createBrowserClient<Database>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseClient] = useState(() =>
    createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
  )

  useEffect(() => {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()

      if (session?.user) {
        // Profil adatok lekérése
        const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata.name,
          isAdmin: profile?.is_admin || false,
          avatarUrl: profile?.avatar_url,
        })
      }

      setIsLoading(false)
    }

    checkUser()

    // Feliratkozás az auth változásokra
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Profil adatok lekérése
        const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata.name,
          isAdmin: profile?.is_admin || false,
          avatarUrl: profile?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseClient])

  const login = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      throw error
    }

    // Profil létrehozása
    if (data.user) {
      await supabaseClient.from("profiles").insert({
        id: data.user.id,
        name,
        email,
        is_admin: email.includes("admin"),
      })
    }
  }

  const logout = async () => {
    await supabaseClient.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, supabase: supabaseClient }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
