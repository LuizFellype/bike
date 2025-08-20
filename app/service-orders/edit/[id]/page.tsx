"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ServiceOrderForm } from "@/components/service-orders/service-order-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useServiceOrder, WhereParams } from "@/hooks/use-service-orders"

interface Service {
  id: string
  description: string
  price: number
}

interface ServiceOrder {
  id: string
  name: string
  phone: string
  date: string
  description: string
  services: Service[]
  total: number
}

export default function EditServiceOrderPage() {
  // const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)

  // const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const queryParams = useMemo(() => {
    return { key: "id", value: id }
  }, [id])

  const { data: serviceOrder, isLoading: loading } = useServiceOrder(queryParams as WhereParams)

  // useEffect(() => {
  //   // Load service order from localStorage
  //   const orders = JSON.parse(localStorage.getItem("serviceOrders") || "[]")
  //   const order = orders.find((o: ServiceOrder) => o.id === id)

  //   if (order) {
  //     // setServiceOrder(order)
  //   }
  //   setLoading(false)
  // }, [router, id])


  const handleCancel = () => {
    router.push(`/service-orders/${id}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!serviceOrder) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href="/service-orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Service Orders
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold mb-2">Service Order Not Found</h2>
            <p className="text-muted-foreground mb-4">The service order you're trying to edit doesn't exist.</p>
            <Link href="/service-orders">
              <Button>Back to Service Orders</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/service-orders/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              Edit Service Order
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ServiceOrderForm serviceOrder={serviceOrder as ServiceOrder} onCancel={handleCancel} />
        </div>
      </main>
    </div>
  )
}
