"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Loader2, X, Plus, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { createReview } from "@/lib/actions/reviews"
import { uploadPhoto } from "@/lib/actions/photos"

interface ReviewFormProps {
  restaurantId: string
  onCancel: () => void
}

export function ReviewForm({ restaurantId, onCancel }: ReviewFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [dishes, setDishes] = useState<{ name: string; price: number | null }[]>([])
  const [currentDish, setCurrentDish] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("Be kell jelentkezned az értékelés küldéséhez")
      return
    }

    if (rating === 0) {
      setError("Kérjük, adj értékelést a helyről")
      return
    }

    if (!message.trim()) {
      setError("Kérjük, írj véleményt a helyről")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Értékelés létrehozása
      const reviewId = await createReview(restaurantId, user.id, rating, message, dishes)

      // Fotók feltöltése, ha vannak
      if (photoFiles.length > 0) {
        const uploadPromises = photoFiles.map((file) => uploadPhoto(file, user.id, undefined, reviewId))
        await Promise.all(uploadPromises)
      }

      onCancel()
    } catch (err) {
      console.error("Hiba az értékelés küldésekor:", err)
      setError("Nem sikerült elküldeni az értékelést. Kérjük, próbáld újra.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addDish = () => {
    if (currentDish.trim()) {
      setDishes([
        ...dishes,
        {
          name: currentDish.trim(),
          price: currentPrice ? Number.parseFloat(currentPrice) : null,
        },
      ])
      setCurrentDish("")
      setCurrentPrice("")
    }
  }

  const removeDish = (index: number) => {
    setDishes(dishes.filter((_, i) => i !== index))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setPhotoFiles([...photoFiles, ...newFiles])

      // Előnézeti URL-ek létrehozása
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls])
    }
  }

  const removePhoto = (index: number) => {
    // Előnézeti URL felszabadítása
    URL.revokeObjectURL(photoPreviewUrls[index])

    setPhotoFiles(photoFiles.filter((_, i) => i !== index))
    setPhotoPreviewUrls(photoPreviewUrls.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Értékelésed</Label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Vélemény</Label>
        <Textarea
          id="message"
          placeholder="Oszd meg élményeidet erről a helyről..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none focus:border-orange-300 focus:ring-orange-300"
        />
      </div>

      <div className="space-y-2">
        <Label>Kipróbált ételek</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <Input
              value={currentDish}
              onChange={(e) => setCurrentDish(e.target.value)}
              placeholder="Adj hozzá egy kipróbált ételt"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addDish()
                }
              }}
              className="focus:border-orange-300 focus:ring-orange-300"
            />
          </div>
          <div className="flex space-x-2">
            <Input
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="Ár (Ft)"
              type="text"
              inputMode="decimal"
              className="focus:border-orange-300 focus:ring-orange-300"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" onClick={addDish} variant="secondary" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {dishes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {dishes.map((dish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-muted flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              >
                {dish.name}
                {dish.price && (
                  <span className="text-orange-600 dark:text-orange-500 font-medium ml-1">{dish.price} Ft</span>
                )}
                <motion.button
                  type="button"
                  onClick={() => removeDish(index)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eltávolítás: {dish.name}</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Fényképek</Label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {photoPreviewUrls.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-md overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url || "/placeholder.svg"}
                alt={`Étel fotó ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <motion.button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fotó eltávolítása</span>
              </motion.button>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 1.05, borderColor: "rgb(249, 115, 22)" }}
            className="relative aspect-square flex items-center justify-center border-2 border-dashed rounded-md hover:border-primary cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
            <div className="flex flex-col items-center">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Fénykép hozzáadása</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Mégse
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mentés...
              </>
            ) : (
              "Értékelés küldése"
            )}
          </Button>
        </motion.div>
      </div>
    </form>
  )
}
