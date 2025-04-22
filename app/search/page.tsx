"use client"

import { useState, useEffect } from "react"
import { SearchIcon, X, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ProtectedRoute } from "@/components/protected-route"
import { restaurants } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState<number[]>([])
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
  }

  const clearFilters = () => {
    setPriceFilter([])
    setRatingFilter(0)
  }

  const togglePriceFilter = (price: number) => {
    if (priceFilter.includes(price)) {
      setPriceFilter(priceFilter.filter((p) => p !== price))
    } else {
      setPriceFilter([...priceFilter, price])
    }
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Search filter
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.reviews?.some((review) =>
        review.dishes?.some((dish) => dish.toLowerCase().includes(searchQuery.toLowerCase())),
      )

    // Price filter
    const matchesPrice = priceFilter.length === 0 || priceFilter.includes(restaurant.priceTier)

    // Rating filter
    const matchesRating = ratingFilter === 0 || (restaurant.averageRating || 0) >= ratingFilter

    return matchesSearch && matchesPrice && matchesRating
  })

  const hasActiveFilters = priceFilter.length > 0 || ratingFilter > 0

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Helyek keresése</h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Keresés név, hely vagy étel alapján..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={hasActiveFilters ? "border-orange-500" : ""}>
                <Filter className={`h-4 w-4 mr-2 ${hasActiveFilters ? "text-orange-500" : ""}`} />
                Szűrők
                {hasActiveFilters && (
                  <span className="ml-1 text-xs bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {priceFilter.length + (ratingFilter > 0 ? 1 : 0)}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Szűrők</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                Árkategória
              </DropdownMenuLabel>
              <div className="px-2 py-1.5 flex gap-2">
                {[1, 2, 3].map((price) => (
                  <Button
                    key={price}
                    variant={priceFilter.includes(price) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriceFilter(price)}
                    className={priceFilter.includes(price) ? "bg-orange-600" : ""}
                  >
                    {price === 1 ? "$" : price === 2 ? "$$" : "$$$"}
                  </Button>
                ))}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                Minimum értékelés
              </DropdownMenuLabel>
              <div className="px-2 py-1.5 flex gap-2">
                {[0, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={ratingFilter === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRatingFilter(rating)}
                    className={ratingFilter === rating ? "bg-orange-600" : ""}
                  >
                    {rating === 0 ? "Mind" : `${rating}+`}
                  </Button>
                ))}
              </div>

              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={clearFilters}>
                      Szűrők törlése
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRestaurants.map((restaurant, index) => (
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
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nem található hely</h2>
            <p className="text-muted-foreground">Próbáld módosítani a keresést vagy a szűrőket</p>
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  )
}
