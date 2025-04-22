"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      // In a real app, you would update the user profile here
    }, 1500)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profilod</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profil információk</CardTitle>
              <CardDescription>Frissítsd fiókod adatait</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Név</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Frissítés...
                    </>
                  ) : (
                    "Profil frissítése"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fiók statisztikák</CardTitle>
              <CardDescription>Aktivitásod a Kocsmajegyben</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hozzáadott helyek</span>
                <span className="font-medium">3</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Írt értékelések</span>
                <span className="font-medium">7</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Feltöltött fényképek</span>
                <span className="font-medium">12</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kedvenc helyek</span>
                <span className="font-medium">1</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Összes költség</span>
                <span className="font-medium text-orange-600 dark:text-orange-500">74.250 Ft</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => logout()}
              >
                Kijelentkezés
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
