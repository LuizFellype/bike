"use client"

import { useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ServiceOrderForm } from "@/components/service-orders/service-order-form"

import { useServiceOrder, WhereParams } from "@/hooks/use-service-orders"
import { ServiceOrder } from "@/lib/graphql-client"

export default function EditServiceOrderPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const queryParams = useMemo(() => {
    return { key: "id", value: id }
  }, [id])

  const { data: serviceOrder, isLoading: loading, error } = useServiceOrder(queryParams as WhereParams)

  useEffect(() => {
    if (!loading && !error && !serviceOrder) {
      router.push("/service-orders/create")
    }
  }, [serviceOrder, loading])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center">
        <h1 className="align-center text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
          Editar Service Order
        </h1>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ServiceOrderForm serviceOrder={serviceOrder as ServiceOrder} />
        </div>
      </main>
    </div>
  )
}
