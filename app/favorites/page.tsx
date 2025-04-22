"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ProtectedRoute } from "@/components/protected-route"
import { getFavorites } from "@/lib/actions/favorites"
import { useAuth } from "@/lib/auth-context"
import type { Restaurant } from "@/lib/types"

export default function FavoritesPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return

      try {
        const data = await getFavorites(user.id)
        setFavoriteRestaurants(data)
      } catch (err) {
        setError("Nem sikerült betölteni a kedvenceket")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchFavorites()
    } else {
      setIsLoading(false)
    }
  }, [user])

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Kedvenc helyek</h1>
          <Link href="/add">
            <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Hely hozzáadása</span>
              <span className="sm:hidden">Új hely</span>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Hiba történt</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Újrapróbálkozás
            </Button>
          </div>
        ) : favoriteRestaurants.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
              <Heart className="h-8 w-8 text-orange-600 dark:text-orange-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Még nincsenek kedvencek</h2>
            <p className="text-muted-foreground mb-6">Adj hozzá helyeket a kedvenceidhez a szív ikonra kattintva</p>
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
                Helyek böngészése
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favoriteRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </ProtectedRoute>
  )
}
