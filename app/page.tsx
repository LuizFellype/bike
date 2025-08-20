"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Service Order Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Create Service Order</CardTitle>
            <CardDescription>Create a new service order with customer details and services</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/service-orders/create">
              <Button className="w-full">Create New SO</Button>
            </Link>
          </CardContent>
        </Card>

        {/* View Service Orders Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">View Service Orders</CardTitle>
            <CardDescription>Browse and manage existing service orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/service-orders">
              <Button variant="outline" className="w-full bg-transparent">
                View All SOs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your service orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total SOs:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Revenue:</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
