"use client"

import { Button } from "@/components/ui/button"
import { Plus, List } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
            Service Order Management
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/service-orders/create">
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create SO
            </Button>
          </Link>
          <Link href="/service-orders">
            <Button variant="outline" size="sm">
              <List className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
