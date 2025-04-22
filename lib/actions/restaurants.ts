"use server"

import { revalidatePath } from "next/cache"
import { supabase, supabaseQuery } from "../supabase"
import type { Database } from "../database.types"

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"]
type NewRestaurant = Database["public"]["Tables"]["restaurants"]["Insert"]

// Éttermek lekérése
export async function getRestaurants() {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        *,
        photos (url)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Hiba az éttermek lekérésekor:", error)
      return []
    }
    return data || []  
  } catch (err) {
    console.error("Váratlan hiba az éttermek lekérésekor:", err)
    return []
  }
}

// Étterem lekérése ID alapján
export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      *,
      photos (url),
      reviews (
        id,
        rating,
        message,
        created_at,
        user_id,
        dishes (name, price),
        photos (url)
      )
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// Új étterem létrehozása
export async function createRestaurant(restaurantData: { name: string; address: string; price_tier: number }, userId: string) {
  try {
    // Alapvető adatvalidáció
    if (!restaurantData.name || !restaurantData.address || !userId) {
      throw new Error('Hiányzó kötelező adatok')
    }

    const newRestaurant = {
      name: restaurantData.name.trim(),
      address: restaurantData.address.trim(),
      price_tier: restaurantData.price_tier,
      userid: userId
    }

    const { data, error } = await supabase
      .from("restaurants")
      .insert(newRestaurant)
      .select()
      .single()

    if (error) {
      console.error('Hiba az étterem létrehozásakor:', {
        error,
        inputData: newRestaurant
      })
      throw new Error(`Adatbázis hiba: ${error.message}`)
    }
    
    if (!data || !data.id) {
      throw new Error("Nem sikerült létrehozni az éttermet: hiányzó adatok")
    }
    
    revalidatePath("/")
    return data.id
  } catch (err) {
    console.error("Váratlan hiba az étterem létrehozásakor:", err)
    throw err
  }
}

// Étterem frissítése
export async function updateRestaurant(id: string, restaurant: Partial<Restaurant>) {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .update(restaurant)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Hiba az étterem frissítésekor:", error)
      throw new Error(error.message || "Nem sikerült frissíteni az éttermet")
    }
    
    if (!data) {
      throw new Error("Nem sikerült frissíteni az éttermet: hiányzó adatok")
    }
    
    revalidatePath(`/restaurants/${id}`)
    revalidatePath("/")
    return data
  } catch (err) {
    console.error("Váratlan hiba az étterem frissítésekor:", err)
    throw err
  }
}

// Étterem törlése
export async function deleteRestaurant(id: string) {
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", id)

  if (error) throw error
  revalidatePath("/")
}
