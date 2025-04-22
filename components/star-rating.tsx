"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className="p-1 focus:outline-none"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              scale: (hoverRating || rating) >= star ? 1.2 : 1,
              rotate: (hoverRating || rating) >= star ? [0, 15, 0] : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <Star
              className={`h-8 w-8 transition-all ${
                (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </motion.div>
        </motion.button>
      ))}
    </div>
  )
}
