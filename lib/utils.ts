import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function getPriceLabel(priceTier: 1 | 2 | 3): string {
  switch (priceTier) {
    case 1:
      return "$"
    case 2:
      return "$$"
    case 3:
      return "$$$"
    default:
      return "$"
  }
}
