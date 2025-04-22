"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "../supabase"
import type { Database } from "../database.types"

type Photo = Database["public"]["Tables"]["photos"]["Row"]
type NewPhoto = Database["public"]["Tables"]["photos"]["Insert"]

// Fotó feltöltése
export async function uploadPhoto(file: File, userId: string, restaurantId?: string, reviewId?: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from("photos")
    .insert({
      url: publicUrl,
      user_id: userId,
      restaurant_id: restaurantId,
      review_id: reviewId
    })
    .select()
    .single()

  if (error) throw error

  if (restaurantId) {
    revalidatePath(`/restaurants/${restaurantId}`)
  }
  if (reviewId) {
    revalidatePath(`/reviews/${reviewId}`)
  }

  return data
}

export async function getPhotosByRestaurantId(restaurantId: string) {
  const { data, error } = await supabase
    .from("photos")
    .select(`
      *,
      profiles (name, avatar_url)
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPhotosByReviewId(reviewId: string) {
  const { data, error } = await supabase
    .from("photos")
    .select(`
      *,
      profiles (name, avatar_url)
    `)
    .eq("review_id", reviewId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Fotó törlése
export async function deletePhoto(id: string) {
  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("url, restaurant_id, review_id")
    .eq("id", id)
    .single()

  if (fetchError) throw fetchError

  const urlParts = photo.url.split('/')
  const filePath = urlParts.slice(urlParts.indexOf('photos')).join('/')

  const { error: deleteError } = await supabase.storage
    .from('photos')
    .remove([filePath])

  if (deleteError) throw deleteError

  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id)

  if (dbError) throw dbError

  if (photo.restaurant_id) {
    revalidatePath(`/restaurants/${photo.restaurant_id}`)
  }
  if (photo.review_id) {
    revalidatePath(`/reviews/${photo.review_id}`)
  }
}
