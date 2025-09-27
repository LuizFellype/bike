"use client"

import { Button } from "@/components/ui/button"
import { Plus, List } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation';


export function Header() {
  const pathname = usePathname();
  const isViewPage = pathname.includes('/view');
  if (isViewPage) {
    return null
  }
  
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)] text-center">
            Gerenciamento de Ordem de Serviços
          </h1>
        </Link>

        <nav className="flex items-center justify-around w-full gap-4 sm:w-auto">
          <Link href="/service-orders/create">
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Criar OS
            </Button>
          </Link>
          <Link href="/service-orders">
            <Button variant="outline" size="sm">
              <List className="h-4 w-4 mr-2" />
              Gerenciar
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
