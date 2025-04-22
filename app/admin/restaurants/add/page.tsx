"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AdminProtectedRoute } from "@/components/admin-protected-route"

export default function AddRestaurantPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin")
    }, 1500)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would upload these to a storage service
      // For now, we'll just create object URLs
      const newPhotos = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setPhotos([...photos, ...newPhotos])
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vissza
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Új hely hozzáadása</CardTitle>
              <CardDescription>Adjon hozzá egy új helyet az alkalmazáshoz</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hely neve</Label>
                  <Input id="name" placeholder="Hely neve" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Cím</Label>
                  <Textarea id="address" placeholder="Hely címe" required />
                </div>

                <div className="space-y-2">
                  <Label>Árkategória</Label>
                  <RadioGroup defaultValue="2" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="price-1" />
                      <Label htmlFor="price-1">$</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="price-2" />
                      <Label htmlFor="price-2">$$</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="price-3" />
                      <Label htmlFor="price-3">$$$</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Fényképek</Label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Hely fénykép ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="relative aspect-square flex items-center justify-center border-2 border-dashed rounded-md hover:border-primary cursor-pointer">
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
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                  Mégse
                </Button>
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
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
