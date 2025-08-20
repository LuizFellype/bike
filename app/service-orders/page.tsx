import { ServiceOrderList } from "@/components/service-orders/service-order-list"

export default function ServiceOrdersPage() {

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ServiceOrderList />
      </main>
    </div>
  )
}
