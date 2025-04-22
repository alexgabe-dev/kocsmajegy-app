"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "../supabase"
import type { Database } from "../database.types"

type Review = Database["public"]["Tables"]["reviews"]["Row"]
type NewReview = Database["public"]["Tables"]["reviews"]["Insert"]
type Dish = Database["public"]["Tables"]["dishes"]["Row"]
type NewDish = Database["public"]["Tables"]["dishes"]["Insert"]

export async function getReviewsByRestaurantId(restaurantId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      dishes (*),
      photos (url),
      profiles (name, avatar_url)
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createReview(review: NewReview, dishes: NewDish[] = []) {
  const { data: newReview, error: reviewError } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single()

  if (reviewError) throw reviewError

  if (dishes.length > 0) {
    const dishesWithReviewId = dishes.map(dish => ({
      ...dish,
      review_id: newReview.id
    }))

    const { error: dishesError } = await supabase
      .from("dishes")
      .insert(dishesWithReviewId)

    if (dishesError) throw dishesError
  }

  // Étterem átlagos értékelésének frissítése
  await updateRestaurantAverageRating(review.restaurant_id)

  revalidatePath(`/restaurants/${review.restaurant_id}`)
  return newReview
}

export async function updateReview(id: string, review: Partial<Review>, dishes: Partial<Dish>[] = []) {
  const { data: updatedReview, error: reviewError } = await supabase
    .from("reviews")
    .update(review)
    .eq("id", id)
    .select()
    .single()

  if (reviewError) throw reviewError

  if (dishes.length > 0) {
    const { error: dishesError } = await supabase
      .from("dishes")
      .upsert(dishes)

    if (dishesError) throw dishesError
  }

  // Étterem átlagos értékelésének frissítése
  await updateRestaurantAverageRating(updatedReview.restaurant_id)

  revalidatePath(`/restaurants/${updatedReview.restaurant_id}`)
  return updatedReview
}

export async function deleteReview(id: string) {
  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("restaurant_id")
    .eq("id", id)
    .single()

  if (fetchError) throw fetchError

  const { error: deleteError } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)

  if (deleteError) throw deleteError

  // Étterem átlagos értékelésének frissítése
  await updateRestaurantAverageRating(review.restaurant_id)

  revalidatePath(`/restaurants/${review.restaurant_id}`)
}

async function updateRestaurantAverageRating(restaurantId: string) {
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("restaurant_id", restaurantId)

  if (reviewsError) throw reviewsError

  const averageRating = reviews?.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null

  const { error: updateError } = await supabase
    .from("restaurants")
    .update({ average_rating: averageRating })
    .eq("id", restaurantId)

  if (updateError) throw updateError
}
