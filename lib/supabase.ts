import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { handleSupabaseError } from "./utils/error-handling"

// Környezeti változók ellenőrzése
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Supabase kliens létrehozása
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Adatbázis műveletek segédfüggvényei
export const supabaseQuery = async <T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T> => {
  const { data, error } = await query
  if (error) throw handleSupabaseError(error)
  if (!data) throw new Error("No data returned from query")
  return data
}
