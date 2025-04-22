"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RestaurantForm } from "@/components/restaurant-form"
import { ProtectedRoute } from "@/components/protected-route"
import { getRestaurantById, updateRestaurant } from "@/lib/actions/restaurants"
import { uploadPhoto } from "@/lib/actions/photos"
import { useAuth } from "@/lib/auth-context"

export default function EditRestaurantPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(params.id)
        setRestaurant(data)
      } catch (err) {
        setError("Nem sikerült betölteni az éttermet")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRestaurant()
    }
  }, [params.id, user])

  const handleSubmit = async (data: {
    name: string
    address: string
    priceTier: number
    photos: File[]
  }) => {
    if (!user) {
      setError("Be kell jelentkezned a hely szerkesztéséhez")
      return
    }

    // Ellenőrizzük, hogy a felhasználó jogosult-e a szerkesztésre
    if (restaurant && restaurant.userId !== user.id && !user.isAdmin) {
      setError("Nincs jogosultságod a hely szerkesztéséhez")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Étterem frissítése
      await updateRestaurant(params.id, {
        name: data.name,
        address: data.address,
        priceTier: data.priceTier,
      })

      // Fotók feltöltése, ha vannak
      if (data.photos.length > 0) {
        const uploadPromises = data.photos.map((file) => uploadPhoto(file, user.id, params.id))
        await Promise.all(uploadPromises)
      }

      router.push(`/restaurants/${params.id}`)
    } catch (err: any) {
      console.error("Hiba a hely szerkesztésekor:", err)
      // Részletes hibaüzenet megjelenítése a felhasználónak
      setError(err.message || "Nem sikerült szerkeszteni a helyet. Kérjük, próbáld újra.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-muted rounded mb-6"></div>
            <div className="h-64 w-full bg-muted rounded-2xl mb-6"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!restaurant) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">A hely nem található</h1>
          <p className="mb-6">{error || "A keresett hely nem létezik."}</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hely szerkesztése</h1>
        <RestaurantForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
          initialData={{
            name: restaurant.name,
            address: restaurant.address,
            priceTier: restaurant.priceTier,
          }}
        />
      </div>
    </ProtectedRoute>
  )
}