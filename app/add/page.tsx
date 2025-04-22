"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RestaurantForm } from "@/components/restaurant-form"
import { ProtectedRoute } from "@/components/protected-route"
import { createRestaurant } from "@/lib/actions/restaurants"
import { uploadPhoto } from "@/lib/actions/photos"
import { useAuth } from "@/lib/auth-context"

export default function AddRestaurantPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: {
    name: string
    address: string
    priceTier: number
    photos: File[]
  }) => {
    if (!user) {
      setError("Be kell jelentkezned a hely hozzáadásához")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Étterem létrehozása
      const restaurantId = await createRestaurant(data.name, data.address, data.priceTier, user.id)

      // Fotók feltöltése, ha vannak
      if (data.photos.length > 0) {
        const uploadPromises = data.photos.map((file) => uploadPhoto(file, user.id, restaurantId))
        await Promise.all(uploadPromises)
      }

      router.push(`/restaurants/${restaurantId}`)
    } catch (err) {
      console.error("Hiba a hely hozzáadásakor:", err)
      setError("Nem sikerült hozzáadni a helyet. Kérjük, próbáld újra.")
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Új hely hozzáadása</h1>
        <RestaurantForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
      </div>
    </ProtectedRoute>
  )
}
