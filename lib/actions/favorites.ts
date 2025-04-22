"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { Restaurant } from "@/lib/types"

// Kedvencek lekérése
export async function getFavorites(userId: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      restaurant_id,
      restaurants (
        id, 
        name, 
        address, 
        price_tier, 
        average_rating, 
        created_at, 
        user_id,
        photos (url)
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching favorites:", error)
    throw new Error("Nem sikerült lekérni a kedvenceket")
  }

  // Adatok átalakítása a frontend típusoknak megfelelően
  return data.map((favorite) => ({
    id: favorite.restaurants.id,
    name: favorite.restaurants.name,
    address: favorite.restaurants.address,
    priceTier: favorite.restaurants.price_tier,
    averageRating: favorite.restaurants.average_rating,
    photos: favorite.restaurants.photos?.map((photo) => photo.url) || [],
    createdAt: favorite.restaurants.created_at,
    userId: favorite.restaurants.user_id,
  }))
}

// Kedvenc hozzáadása
export async function addFavorite(userId: string, restaurantId: string): Promise<void> {
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    restaurant_id: restaurantId,
  })

  if (error) {
    // Ha már létezik, akkor nem dobunk hibát
    if (error.code === "23505") {
      // Unique violation
      return
    }
    console.error("Error adding favorite:", error)
    throw new Error("Nem sikerült hozzáadni a kedvencekhez")
  }

  revalidatePath("/favorites")
  revalidatePath(`/restaurants/${restaurantId}`)
}

// Kedvenc eltávolítása
export async function removeFavorite(userId: string, restaurantId: string): Promise<void> {
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("restaurant_id", restaurantId)

  if (error) {
    console.error("Error removing favorite:", error)
    throw new Error("Nem sikerült eltávolítani a kedvencekből")
  }

  revalidatePath("/favorites")
  revalidatePath(`/restaurants/${restaurantId}`)
}

// Ellenőrzés, hogy egy étterem kedvenc-e
export async function isFavorite(userId: string, restaurantId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("restaurant_id", restaurantId)
    .maybeSingle()

  if (error) {
    console.error("Error checking favorite status:", error)
    return false
  }

  return !!data
}
