"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Users, Utensils, MessageSquare, Settings, Database, BarChart, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AdminProtectedRoute } from "@/components/admin-protected-route"

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin felület</h1>
            <p className="text-muted-foreground mt-1">Kezelje az alkalmazás tartalmát és felhasználóit</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="bg-background sticky top-16 z-30 w-full pb-4 pt-1">
            <TabsList className="w-full h-auto flex flex-wrap gap-2 justify-start bg-transparent p-0">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                <BarChart className="h-4 w-4 mr-2" />
                <span>Áttekintés</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                <span>Felhasználók</span>
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                <Utensils className="h-4 w-4 mr-2" />
                <span>Helyek</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Értékelések</span>
              </TabsTrigger>
              <TabsTrigger
                value="test-data"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                <span>Teszt adatok</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Beállítások</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Felhasználók"
                value="24"
                description="Összes regisztrált felhasználó"
                icon={<Users className="h-4 w-4" />}
                link="/admin/users"
              />
              <DashboardCard
                title="Helyek"
                value="42"
                description="Összes hozzáadott hely"
                icon={<Utensils className="h-4 w-4" />}
                link="/admin/restaurants"
              />
              <DashboardCard
                title="Értékelések"
                value="156"
                description="Összes értékelés"
                icon={<MessageSquare className="h-4 w-4" />}
                link="/admin/reviews"
              />
              <DashboardCard
                title="Aktív felhasználók"
                value="18"
                description="Az elmúlt 7 napban"
                icon={<Users className="h-4 w-4" />}
                link="/admin/users"
              />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Legújabb értékelések</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Felhasználó {i}</p>
                            <span className="text-xs text-muted-foreground">2 órája</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            Nagyon jó hely, remek ételek és kiszolgálás...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/reviews" className="text-sm text-orange-600 hover:underline flex items-center">
                    Összes értékelés megtekintése
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legújabb helyek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Utensils className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Étterem {i}</p>
                            <span className="text-xs text-muted-foreground">1 napja</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">Budapest, Példa utca {i}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/restaurants" className="text-sm text-orange-600 hover:underline flex items-center">
                    Összes hely megtekintése
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="restaurants" className="mt-0">
            <AdminRestaurantsTab />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <AdminReviewsTab />
          </TabsContent>

          <TabsContent value="test-data" className="mt-0">
            <AdminTestDataTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminProtectedRoute>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  link,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  link: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-2">
        <Link href={link} className="text-xs text-orange-600 hover:underline flex items-center">
          Részletek
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}

function AdminUsersTab() {
  const mockUsers = [
    { id: "1", name: "Kovács János", email: "kovacs@example.com", isAdmin: false, createdAt: "2023-05-15" },
    { id: "2", name: "Nagy Éva", email: "nagy.eva@example.com", isAdmin: false, createdAt: "2023-06-22" },
    { id: "3", name: "Admin Felhasználó", email: "admin@example.com", isAdmin: true, createdAt: "2023-04-10" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Felhasználók kezelése</h2>
        <Link href="/admin/users/add">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Új felhasználó
          </Button>
        </Link>
      </div>

      <div className="overflow-auto rounded-lg border shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Név</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Email</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Szerepkör</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Regisztrált</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.isAdmin ? "Admin" : "Felhasználó"}</td>
                <td className="px-4 py-3">{user.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Szerkesztés
                    </Button>
                    <Button variant="destructive" size="sm">
                      Törlés
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminRestaurantsTab() {
  const mockRestaurants = [
    { id: "1", name: "Pasta Paradise", address: "123 Main St, Foodville", rating: 4.5, status: "Aktív" },
    { id: "2", name: "Burger Bistro", address: "456 Oak Ave, Meattown", rating: 4.2, status: "Aktív" },
    { id: "3", name: "Sushi Sensation", address: "789 Cherry Blvd, Fishville", rating: 4.8, status: "Aktív" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Helyek kezelése</h2>
        <Link href="/admin/restaurants/add">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Új hely
          </Button>
        </Link>
      </div>

      <div className="overflow-auto rounded-lg border shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Név</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Cím</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Értékelés</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Állapot</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {mockRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">{restaurant.name}</td>
                <td className="px-4 py-3">{restaurant.address}</td>
                <td className="px-4 py-3">{restaurant.rating}</td>
                <td className="px-4 py-3">{restaurant.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Szerkesztés
                    </Button>
                    <Button variant="destructive" size="sm">
                      Törlés
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminReviewsTab() {
  const mockReviews = [
    {
      id: "101",
      restaurant: "Pasta Paradise",
      user: "Kovács János",
      rating: 5,
      date: "2023-10-15",
      content: "Amazing pasta! The carbonara was perfect and the service was excellent.",
    },
    {
      id: "201",
      restaurant: "Burger Bistro",
      user: "Nagy Éva",
      rating: 4,
      date: "2023-11-05",
      content: "Great food but a bit noisy on weekends. Will definitely come back for the lasagna!",
    },
    {
      id: "301",
      restaurant: "Sushi Sensation",
      user: "Tóth Péter",
      rating: 5,
      date: "2023-12-01",
      content: "The freshest sushi I've ever had! The omakase experience was worth every penny.",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Értékelések kezelése</h2>
      </div>

      <div className="grid gap-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hely: {review.restaurant}</p>
                    <div className="flex items-center">
                      <p className="text-sm">Értékelés: {review.rating}/5</p>
                    </div>
                  </div>
                  <p className="text-sm">{review.content}</p>
                </div>
                <div className="flex flex-wrap gap-2 self-start">
                  <Button variant="outline" size="sm">
                    Megtekintés
                  </Button>
                  <Button variant="destructive" size="sm">
                    Törlés
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdminTestDataTab() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleGenerateTestData = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      // In a real app, you would generate test data here
    }, 1500)
  }

  const handleClearTestData = () => {
    setIsClearing(true)
    // Simulate API call
    setTimeout(() => {
      setIsClearing(false)
      // In a real app, you would clear test data here
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Teszt adatok kezelése</h2>
        <p className="text-muted-foreground mb-4">
          Itt generálhat teszt adatokat az alkalmazás teszteléséhez, vagy törölheti a meglévő teszt adatokat.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teszt adatok generálása</CardTitle>
            <CardDescription>
              Generáljon véletlenszerű felhasználókat, helyeket és értékeléseket az alkalmazás teszteléséhez.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Felhasználók száma</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Helyek száma</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Értékelések száma</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Adatok típusa</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="realistic">Valósághű</option>
                  <option value="random">Teljesen véletlenszerű</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={handleGenerateTestData}
              disabled={isGenerating}
            >
              {isGenerating ? "Generálás..." : "Teszt adatok generálása"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adatok törlése</CardTitle>
            <CardDescription>Törölje a teszt adatokat vagy az összes adatot az alkalmazásból.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Törlendő adatok</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="test">Csak teszt adatok</option>
                <option value="all">Minden adat</option>
              </select>
            </div>
            <div className="pt-4">
              <div className="rounded-md bg-destructive/10 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">Figyelmeztetés</h3>
                    <div className="mt-2 text-sm text-destructive/80">
                      <p>Ez a művelet nem visszavonható. Az összes kiválasztott adat véglegesen törlődik.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-destructive hover:bg-destructive/90"
              onClick={handleClearTestData}
              disabled={isClearing}
            >
              {isClearing ? "Törlés folyamatban..." : "Adatok törlése"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function AdminSettingsTab() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      // In a real app, you would save settings here
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Rendszerbeállítások</h2>
        <p className="text-muted-foreground mb-4">Állítsa be az alkalmazás működését és megjelenését.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Általános beállítások</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alkalmazás neve</label>
              <input
                type="text"
                defaultValue="Kocsmajegy"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alapértelmezett nyelv</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="hu">Magyar</option>
                <option value="en">Angol</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Regisztráció</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allow-registration"
                className="h-4 w-4 rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="allow-registration" className="text-sm">
                Új felhasználók regisztrációjának engedélyezése
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Mentés..." : "Beállítások mentése"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fejlesztői beállítások</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hibakeresési mód</label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="debug-mode" className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="debug-mode" className="text-sm">
                Hibakeresési mód engedélyezése
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">API kulcs újragenerálása</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                value={process.env.TEST_KEY}
                readOnly
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Újragenerálás
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Adatbázis műveletek</label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Adatbázis mentése
              </Button>
              <Button variant="outline" size="sm">
                Adatbázis visszaállítása
              </Button>
              <Button variant="destructive" size="sm">
                Adatbázis újraindítása
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
