import { ServiceOrderForm } from "@/components/service-orders/service-order-form"

export default function CreateServiceOrderPage() {
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ServiceOrderForm />
        </div>
      </main>
    </div>
  )
}
