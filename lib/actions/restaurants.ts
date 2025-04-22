"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { Restaurant } from "@/lib/types"

// Éttermek lekérése
export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      id, 
      name, 
      address, 
      price_tier, 
      average_rating, 
      created_at, 
      user_id,
      photos (url)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching restaurants:", error)
    throw new Error("Nem sikerült lekérni az éttermeket")
  }

  // Adatok átalakítása a frontend típusoknak megfelelően
  return data.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    address: restaurant.address,
    priceTier: restaurant.price_tier,
    averageRating: restaurant.average_rating,
    photos: restaurant.photos?.map((photo) => photo.url) || [],
    createdAt: restaurant.created_at,
    userId: restaurant.user_id,
  }))
}

// Étterem lekérése ID alapján
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      id, 
      name, 
      address, 
      price_tier, 
      average_rating, 
      created_at, 
      user_id,
      photos (id, url),
      reviews (
        id, 
        rating, 
        message, 
        created_at, 
        user_id,
        dishes (id, name, price),
        photos (id, url)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // Nincs találat
    }
    console.error("Error fetching restaurant:", error)
    throw new Error("Nem sikerült lekérni az éttermet")
  }

  // Adatok átalakítása a frontend típusoknak megfelelően
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    priceTier: data.price_tier,
    averageRating: data.average_rating,
    photos: data.photos?.map((photo) => photo.url) || [],
    reviews:
      data.reviews?.map((review) => ({
        id: review.id,
        restaurantId: id,
        userId: review.user_id,
        rating: review.rating,
        message: review.message,
        dishes:
          review.dishes?.map((dish) => ({
            id: dish.id,
            reviewId: review.id,
            name: dish.name,
            price: dish.price,
          })) || [],
        photos: review.photos?.map((photo) => photo.url) || [],
        createdAt: review.created_at,
      })) || [],
    createdAt: data.created_at,
    userId: data.user_id,
  }
}

// Új étterem létrehozása
export async function createRestaurant(
  name: string,
  address: string,
  priceTier: number,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      name,
      address,
      price_tier: priceTier,
      user_id: userId,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating restaurant:", error)
    throw new Error("Nem sikerült létrehozni az éttermet")
  }

  revalidatePath("/")
  return data.id
}

// Étterem frissítése
export async function updateRestaurant(
  id: string,
  updates: {
    name?: string
    address?: string
    priceTier?: number
  },
): Promise<void> {
  const { error } = await supabase
    .from("restaurants")
    .update({
      name: updates.name,
      address: updates.address,
      price_tier: updates.priceTier,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating restaurant:", error)
    throw new Error("Nem sikerült frissíteni az éttermet")
  }

  revalidatePath(`/restaurants/${id}`)
  revalidatePath("/")
}

// Étterem törlése
export async function deleteRestaurant(id: string): Promise<void> {
  const { error } = await supabase.from("restaurants").delete().eq("id", id)

  if (error) {
    console.error("Error deleting restaurant:", error)
    throw new Error("Nem sikerült törölni az éttermet")
  }

  revalidatePath("/")
}
