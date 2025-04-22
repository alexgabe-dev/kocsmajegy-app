"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

// Értékelés létrehozása
export async function createReview(
  restaurantId: string,
  userId: string,
  rating: number,
  message: string,
  dishes?: { name: string; price: number | null }[],
): Promise<string> {
  // Tranzakció kezdése
  const { data: reviewData, error: reviewError } = await supabase
    .from("reviews")
    .insert({
      restaurant_id: restaurantId,
      user_id: userId,
      rating,
      message,
    })
    .select("id")
    .single()

  if (reviewError) {
    console.error("Error creating review:", reviewError)
    throw new Error("Nem sikerült létrehozni az értékelést")
  }

  const reviewId = reviewData.id

  // Ételek hozzáadása, ha vannak
  if (dishes && dishes.length > 0) {
    const dishRecords = dishes.map((dish) => ({
      review_id: reviewId,
      name: dish.name,
      price: dish.price,
    }))

    const { error: dishesError } = await supabase.from("dishes").insert(dishRecords)

    if (dishesError) {
      console.error("Error adding dishes:", dishesError)
      // Nem dobunk hibát, mert az értékelés már létrejött
    }
  }

  // Étterem átlagos értékelésének frissítése
  await updateRestaurantAverageRating(restaurantId)

  revalidatePath(`/restaurants/${restaurantId}`)
  return reviewId
}

// Értékelés törlése
export async function deleteReview(id: string, restaurantId: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    console.error("Error deleting review:", error)
    throw new Error("Nem sikerült törölni az értékelést")
  }

  // Étterem átlagos értékelésének frissítése
  await updateRestaurantAverageRating(restaurantId)

  revalidatePath(`/restaurants/${restaurantId}`)
}

// Étterem átlagos értékelésének frissítése
async function updateRestaurantAverageRating(restaurantId: string): Promise<void> {
  // Lekérjük az összes értékelést az étteremhez
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("restaurant_id", restaurantId)

  if (reviewsError) {
    console.error("Error fetching reviews for rating update:", reviewsError)
    return
  }

  // Kiszámoljuk az átlagos értékelést
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null

  // Frissítjük az étterem átlagos értékelését
  const { error: updateError } = await supabase
    .from("restaurants")
    .update({ average_rating: averageRating })
    .eq("id", restaurantId)

  if (updateError) {
    console.error("Error updating restaurant average rating:", updateError)
  }
}
