"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

// Fotó feltöltése
export async function uploadPhoto(
  file: File,
  userId: string,
  restaurantId?: string,
  reviewId?: string,
): Promise<string> {
  // Egyedi fájlnév generálása
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  const filePath = `${userId}/${fileName}`

  // Feltöltés a Supabase Storage-ba
  const { data: uploadData, error: uploadError } = await supabase.storage.from("photos").upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading photo:", uploadError)
    throw new Error("Nem sikerült feltölteni a képet")
  }

  // Publikus URL lekérése
  const { data: urlData } = supabase.storage.from("photos").getPublicUrl(filePath)

  const publicUrl = urlData.publicUrl

  // Fotó rekord létrehozása az adatbázisban
  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .insert({
      restaurant_id: restaurantId || null,
      review_id: reviewId || null,
      url: publicUrl,
      user_id: userId,
    })
    .select("id")
    .single()

  if (photoError) {
    console.error("Error creating photo record:", photoError)
    throw new Error("Nem sikerült létrehozni a fotó rekordot")
  }

  if (restaurantId) {
    revalidatePath(`/restaurants/${restaurantId}`)
  }

  return photoData.id
}

// Fotó törlése
export async function deletePhoto(id: string, restaurantId?: string): Promise<void> {
  // Először lekérjük a fotó adatait, hogy megkapjuk az URL-t
  const { data: photo, error: fetchError } = await supabase.from("photos").select("url").eq("id", id).single()

  if (fetchError) {
    console.error("Error fetching photo:", fetchError)
    throw new Error("Nem sikerült lekérni a fotót")
  }

  // Kinyerjük a fájl elérési útját az URL-ből
  const url = new URL(photo.url)
  const filePath = url.pathname.split("/").pop()

  if (filePath) {
    // Töröljük a fájlt a Storage-ból
    const { error: storageError } = await supabase.storage.from("photos").remove([filePath])

    if (storageError) {
      console.error("Error deleting photo from storage:", storageError)
      // Folytatjuk a rekord törlésével, még ha a fájl törlése nem is sikerült
    }
  }

  // Töröljük a rekordot az adatbázisból
  const { error: deleteError } = await supabase.from("photos").delete().eq("id", id)

  if (deleteError) {
    console.error("Error deleting photo record:", deleteError)
    throw new Error("Nem sikerült törölni a fotó rekordot")
  }

  if (restaurantId) {
    revalidatePath(`/restaurants/${restaurantId}`)
  }
}
