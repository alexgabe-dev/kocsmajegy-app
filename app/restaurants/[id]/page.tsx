"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Star, Plus, Heart, Share2, MapPin, Calendar, Clock, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewForm } from "@/components/review-form"
import { ProtectedRoute } from "@/components/protected-route"
import { formatDate, getPriceLabel } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getRestaurantById, deleteRestaurant } from "@/lib/actions/restaurants"
import { addFavorite, removeFavorite, isFavorite } from "@/lib/actions/favorites"
import { useAuth } from "@/lib/auth-context"
import type { Restaurant } from "@/lib/types"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isFavoriteState, setIsFavoriteState] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const reviewFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(params.id)
        setRestaurant(data)

        // Ellenőrizzük, hogy kedvenc-e
        if (user) {
          const favorite = await isFavorite(user.id, params.id)
          setIsFavoriteState(favorite)
        }
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

  useEffect(() => {
    if (showReviewForm && reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [showReviewForm])

  const handleToggleFavorite = async () => {
    if (!user) return

    try {
      if (isFavoriteState) {
        await removeFavorite(user.id, params.id)
      } else {
        await addFavorite(user.id, params.id)
      }
      setIsFavoriteState(!isFavoriteState)
    } catch (err) {
      console.error("Hiba a kedvencek kezelésekor:", err)
    }
  }

  const handleDeleteRestaurant = async () => {
    if (!confirm("Biztosan törölni szeretnéd ezt a helyet?")) return

    setIsDeleting(true)
    try {
      await deleteRestaurant(params.id)
      router.push("/")
    } catch (err) {
      console.error("Hiba a törléskor:", err)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-muted rounded mb-6"></div>
            <div className="h-64 w-full bg-muted rounded-2xl mb-6"></div>
            <div className="h-8 w-3/4 bg-muted rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-muted rounded mb-6"></div>
            <div className="h-10 w-full bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-40 w-full bg-muted rounded"></div>
              <div className="h-40 w-full bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !restaurant) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">A hely nem található</h1>
          <p className="mb-6">{error || "A keresett hely nem létezik."}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vissza a főoldalra
            </Button>
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  const photos =
    restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos : ["/placeholder.svg?height=400&width=600"]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vissza
            </Button>
          </Link>
          <div className="ml-auto flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`rounded-full ${isFavoriteState ? "bg-red-50 dark:bg-red-950/30" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isFavoriteState ? "fill-red-500 text-red-500" : ""}`} />
                <span className="sr-only">
                  {isFavoriteState ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
                </span>
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Megosztás</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Megosztás üzenetben</DropdownMenuItem>
                <DropdownMenuItem>Megosztás e-mailben</DropdownMenuItem>
                <DropdownMenuItem>Link másolása</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(user?.isAdmin || user?.id === restaurant.userId) && (
              <div className="hidden md:flex gap-2">
                <Link href={`/restaurants/${restaurant.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Szerkesztés
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleDeleteRestaurant} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Törlés...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Törlés
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div
              className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photos[activeImageIndex] || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {photos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white/50"}`}
                      aria-label={`Kép ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                {getPriceLabel(restaurant.priceTier)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 mr-1.5" />
                  <span className="font-medium">
                    {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "Új"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({restaurant.reviews?.length || 0} értékelés)
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  <span>{restaurant.address}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>Hozzáadva: {formatDate(restaurant.createdAt)}</span>
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="reviews" className="mb-20 md:mb-0">
              <TabsList className="mb-4 w-full md:w-auto bg-muted/50 p-1 rounded-lg">
                <TabsTrigger
                  value="reviews"
                  className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                >
                  Értékelések
                </TabsTrigger>
                <TabsTrigger
                  value="dishes"
                  className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                >
                  Ételek
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                >
                  Fényképek
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                {!showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="mb-6 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 hidden md:flex"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Értékelés hozzáadása
                    </Button>
                  </motion.div>
                )}

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                      ref={reviewFormRef}
                    >
                      <Card className="border border-orange-200 dark:border-orange-900/50 shadow-md">
                        <CardContent className="pt-6">
                          <ReviewForm restaurantId={restaurant.id} onCancel={() => setShowReviewForm(false)} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {restaurant.reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-all border-transparent hover:border-orange-200 dark:hover:border-orange-900/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                {formatDate(review.createdAt)}
                              </div>
                            </div>

                            <p className="mb-4">{review.message}</p>

                            {review.dishes && review.dishes.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Kipróbált ételek:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {review.dishes.map((dish) => (
                                    <div
                                      key={dish.id}
                                      className="bg-muted px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                      {dish.name}
                                      {dish.price && (
                                        <span className="text-orange-600 dark:text-orange-500 font-medium ml-1">
                                          {dish.price} Ft
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {review.photos && review.photos.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {review.photos.map((photo, i) => (
                                  <div key={i} className="relative aspect-square rounded-md overflow-hidden">
                                    <Image
                                      src={photo || "/placeholder.svg"}
                                      alt={`Étel fotó ${i + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 bg-muted/30 rounded-lg"
                  >
                    <p className="text-muted-foreground">Még nincsenek értékelések. Legyél te az első értékelő!</p>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="dishes">
                {restaurant.reviews && restaurant.reviews.some((r) => r.dishes && r.dishes.length > 0) ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    {Array.from(
                      new Map(
                        restaurant.reviews.flatMap((r) => r.dishes || []).map((dish) => [dish.name, dish]),
                      ).values(),
                    ).map((dish, i) => (
                      <motion.div
                        key={dish.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-sm flex items-center justify-between transition-colors"
                      >
                        <span>{dish.name}</span>
                        {dish.price && (
                          <span className="text-orange-600 dark:text-orange-500 font-medium">{dish.price} Ft</span>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 bg-muted/30 rounded-lg"
                  >
                    <p className="text-muted-foreground">Még nincsenek ételek feljegyezve.</p>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="photos">
                {restaurant.photos && restaurant.photos.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {restaurant.photos.map((photo, i) => (
                      <motion.div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Hely fotó ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 bg-muted/30 rounded-lg"
                  >
                    <p className="text-muted-foreground">Még nincsenek feltöltött fényképek.</p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="sticky top-20 border-orange-200 dark:border-orange-900/50 shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Hely információ</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Cím</h4>
                      <p>{restaurant.address}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Árkategória</h4>
                      <p>{getPriceLabel(restaurant.priceTier)}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Hozzáadva</h4>
                      <p>{formatDate(restaurant.createdAt)}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Népszerű ételek</h4>
                    {restaurant.reviews && restaurant.reviews.some((r) => r.dishes && r.dishes.length > 0) ? (
                      <div className="space-y-2">
                        {Array.from(
                          new Map(
                            restaurant.reviews.flatMap((r) => r.dishes || []).map((dish) => [dish.name, dish]),
                          ).values(),
                        )
                          .slice(0, 3)
                          .map((dish) => (
                            <div key={dish.id} className="bg-muted px-3 py-1 rounded-full text-sm inline-block mr-2">
                              {dish.name}
                              {dish.price && (
                                <span className="text-orange-600 dark:text-orange-500 font-medium ml-1">
                                  {dish.price} Ft
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Még nincsenek ételek feljegyezve.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Mobile floating action button for adding review */}
        <div className="fixed bottom-24 right-4 md:hidden z-30">
          <AnimatePresence>
            {!showReviewForm && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="h-14 w-14 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 shadow-lg flex items-center justify-center"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  )
}
