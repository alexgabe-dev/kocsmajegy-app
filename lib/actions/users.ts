"use server"

import { supabase } from "../supabase"
import type { Database } from "../database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"]

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      *,
      restaurants (
        id,
        name,
        address,
        price_tier,
        average_rating,
        photos (url)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function addFavorite(userId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      restaurant_id: restaurantId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFavorite(userId: string, restaurantId: string) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("restaurant_id", restaurantId)

  if (error) throw error
} 