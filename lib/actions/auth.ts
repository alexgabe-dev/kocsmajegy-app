"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

// Supabase kliens létrehozása a szerveren
export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge: number; sameSite: string }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path: string }) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    },
  )
}

// Felhasználó regisztrálása
export async function registerUser(name: string, email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  // Felhasználó létrehozása
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (authError) {
    console.error("Error registering user:", authError)
    throw new Error("Nem sikerült regisztrálni a felhasználót")
  }

  // Profil létrehozása
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name,
      email,
      is_admin: email.includes("admin"),
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // Nem dobunk hibát, mert a felhasználó már létrejött
    }
  }

  redirect("/login")
}

// Felhasználó bejelentkeztetése
export async function loginUser(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error logging in:", error)
    throw new Error("Érvénytelen e-mail vagy jelszó")
  }

  redirect("/")
}

// Felhasználó kijelentkeztetése
export async function logoutUser() {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error logging out:", error)
    throw new Error("Nem sikerült kijelentkezni")
  }

  redirect("/login")
}

// Aktuális felhasználó lekérése
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Profil adatok lekérése
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata.name,
    isAdmin: profile?.is_admin || false,
    avatarUrl: profile?.avatar_url,
  }
}
