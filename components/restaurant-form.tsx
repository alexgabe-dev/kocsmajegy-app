"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, X, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RestaurantFormProps {
  onSubmit: (data: {
    name: string
    address: string
    priceTier: number
    photos: File[]
  }) => void
  isSubmitting?: boolean
  error?: string | null
  initialData?: {
    name: string
    address: string
    priceTier: number
  }
}

export function RestaurantForm({ onSubmit, isSubmitting = false, error = null, initialData }: RestaurantFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [priceTier, setPriceTier] = useState<number>(initialData?.priceTier || 2)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(error)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validáció
    if (!name.trim()) {
      setFormError("Kérjük, add meg a hely nevét")
      return
    }

    if (!address.trim()) {
      setFormError("Kérjük, add meg a hely címét")
      return
    }

    setFormError(null)
    onSubmit({
      name,
      address,
      priceTier,
      photos: photoFiles,
    })
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {formError && (
            <Alert
              variant="destructive"
              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Hely neve</Label>
            <Input
              id="name"
              placeholder="Add meg a hely nevét"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-orange-300 focus:ring-orange-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Cím</Label>
            <Textarea
              id="address"
              placeholder="Add meg a hely címét"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="focus:border-orange-300 focus:ring-orange-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Árkategória</Label>
            <RadioGroup
              value={priceTier.toString()}
              onValueChange={(value) => setPriceTier(Number.parseInt(value))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="price-1" />
                <Label htmlFor="price-1">$</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="price-2" />
                <Label htmlFor="price-2">$</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="price-3" />
                <Label htmlFor="price-3">$$</Label>
              </div>
            </RadioGroup>
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
                    alt={`Hely fénykép ${index + 1}`}
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
              <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
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
                  "Hely mentése"
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
