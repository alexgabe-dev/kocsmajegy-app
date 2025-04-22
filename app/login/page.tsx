"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      router.push("/")
    } catch (err: any) {
      if (err.message.includes("Invalid login credentials")) {
        setError("Hibás e-mail cím vagy jelszó")
      } else {
        setError("A bejelentkezés sikertelen. Kérjük, próbáld újra.")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8" suppressHydrationWarning>
      <Card className="w-full max-w-md" suppressHydrationWarning>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Utensils className="h-10 w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Üdvözöljük a Kocsmajegyben</CardTitle>
          <CardDescription>Add meg adataidat a bejelentkezéshez</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="pelda@email.com" 
                required 
                suppressHydrationWarning
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                suppressHydrationWarning
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md" suppressHydrationWarning>
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bejelentkezés...
                </>
              ) : (
                "Bejelentkezés"
              )}
            </Button>
            <div className="text-center text-sm">
              Még nincs fiókod?{" "}
              <Link href="/register" className="text-orange-600 hover:underline dark:text-orange-500">
                Regisztráció
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
