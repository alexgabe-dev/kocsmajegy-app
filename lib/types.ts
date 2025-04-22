export interface Restaurant {
  id: string
  name: string
  address: string
  priceTier: number
  averageRating?: number | null
  photos?: string[]
  reviews?: Review[]
  createdAt: string
  userId: string
}

export interface Review {
  id: string
  restaurantId: string
  userId: string
  rating: number
  message: string
  dishes?: Dish[]
  photos?: string[]
  createdAt: string
}

export interface Dish {
  id: string
  reviewId: string
  name: string
  price: number | null
}

export interface Photo {
  id: string
  restaurantId?: string | null
  reviewId?: string | null
  url: string
  createdAt: string
  userId: string
}

export interface Favorite {
  id: string
  userId: string
  restaurantId: string
  createdAt: string
}

export interface Profile {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  isAdmin: boolean
  createdAt: string
}
