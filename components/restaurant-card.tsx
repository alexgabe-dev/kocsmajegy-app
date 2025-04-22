"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate, getPriceLabel } from "@/lib/utils"
import type { Restaurant } from "@/lib/types"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden h-full transition-all hover:shadow-md border-transparent hover:border-orange-200 dark:hover:border-orange-900">
          <div className="relative aspect-video">
            {restaurant.photos && restaurant.photos.length > 0 ? (
              <Image
                src={restaurant.photos[0] || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            ) : (
              <Image src="/placeholder.svg?height=200&width=400" alt="Hely helyőrző" fill className="object-cover" />
            )}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
              {getPriceLabel(restaurant.priceTier)}
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{restaurant.name}</h3>

            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{restaurant.address}</span>
            </div>

            <div className="flex items-center">
              <div className="flex items-center bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">
                  {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "Új"}
                </span>
                <span className="text-xs text-muted-foreground ml-1">({restaurant.reviews?.length || 0})</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            Hozzáadva {formatDate(restaurant.createdAt)}
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
