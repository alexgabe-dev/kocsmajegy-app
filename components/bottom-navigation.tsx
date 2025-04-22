"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, Heart, User, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function BottomNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Don't show on login/register pages or admin pages
  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-background/95 backdrop-blur-md border-t px-4 py-3 flex items-center justify-around shadow-lg">
            <NavItem href="/" icon={<Home />} label="Főoldal" isActive={pathname === "/"} />
            <NavItem href="/search" icon={<Search />} label="Keresés" isActive={pathname === "/search"} />

            <div className="relative -mt-10">
              <Link href="/add">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button className="h-16 w-16 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 shadow-lg flex items-center justify-center">
                    <PlusCircle className="h-8 w-8" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            <NavItem href="/favorites" icon={<Heart />} label="Kedvencek" isActive={pathname === "/favorites"} />

            <NavItem
              href={user?.isAdmin ? "/admin" : "/profile"}
              icon={user?.isAdmin ? <Shield /> : <User />}
              label={user?.isAdmin ? "Admin" : "Profil"}
              isActive={pathname === "/profile" || pathname === "/admin"}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "p-2 rounded-full transition-colors",
          isActive
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500"
            : "text-muted-foreground",
        )}
      >
        {icon}
      </motion.div>
      <span
        className={cn(
          "text-xs mt-1",
          isActive ? "text-orange-600 dark:text-orange-500 font-medium" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </Link>
  )
}
