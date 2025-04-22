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

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "A jelszónak legalább 6 karakter hosszúnak kell lennie"
    }
    if (!/[A-Z]/.test(password)) {
      return "A jelszónak tartalmaznia kell legalább egy nagybetűt"
    }
    if (!/[a-z]/.test(password)) {
      return "A jelszónak tartalmaznia kell legalább egy kisbetűt"
    }
    if (!/[0-9]/.test(password)) {
      return "A jelszónak tartalmaznia kell legalább egy számot"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Jelszó validáció
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek")
      setIsLoading(false)
      return
    }

    try {
      await register(name, email, password)
      router.push("/")
    } catch (err: any) {
      if (err.message.includes("Password should be at least 6 characters")) {
        setError("A jelszónak legalább 6 karakter hosszúnak kell lennie")
      } else if (err.message.includes("User already registered")) {
        setError("Ez az e-mail cím már regisztrálva van")
      } else if (err.message.includes("Invalid email")) {
        setError("Érvénytelen e-mail cím")
      } else {
        setError("A regisztráció sikertelen. Kérjük, próbáld újra.")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Utensils className="h-10 w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Csatlakozz a Kocsmajegyhez</CardTitle>
          <CardDescription>Add meg adataidat a regisztrációhoz</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Név</Label>
              <Input id="name" name="name" placeholder="Kovács János" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="pelda@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6}
                placeholder="Legalább 6 karakter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6}
                placeholder="Írd be újra a jelszót"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regisztráció...
                </>
              ) : (
                "Regisztráció"
              )}
            </Button>
            <div className="text-center text-sm">
              Már van fiókod?{" "}
              <Link href="/login" className="text-orange-600 hover:underline dark:text-orange-500">
                Bejelentkezés
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
