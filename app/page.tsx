"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ProtectedRoute } from "@/components/protected-route"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getRestaurants } from "@/lib/actions/restaurants"
import type { Restaurant } from "@/lib/types"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "rating">("newest")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants()
        setRestaurants(data)
      } catch (err) {
        setError("Nem sikerült betölteni az éttermeket")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Rendezés
  const sortedRestaurants = [...restaurants]
  if (sortBy === "newest") {
    sortedRestaurants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy === "rating") {
    sortedRestaurants.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Kocsmajegyed</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Rendezés</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>Legújabb</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>Legjobb értékelés</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/add">
              <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Hely hozzáadása</span>
                <span className="sm:hidden">Új hely</span>
              </Button>
            </Link>
          </div>
        </div>

        {!mounted || isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : sortedRestaurants.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Még nincsenek helyek</h2>
            <p className="text-muted-foreground mb-6">Kezdd el hozzáadni kedvenc helyeidet!</p>
            <Link href="/add">
              <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add hozzá az első helyet
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
              {sortedRestaurants.map((restaurant, index) => (
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
