"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2 } from "lucide-react"
import { createServiceOrder, updateServiceOrder } from "@/lib/actions/service-orders"
import type { ServiceOrder, Service } from "@/lib/actions/service-orders"

interface ServerServiceOrderFormProps {
  serviceOrder?: ServiceOrder
}

export function ServerServiceOrderForm({ serviceOrder }: ServerServiceOrderFormProps) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([{ id: "1", description: "", price: 0 }])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load existing service order data if provided
  useEffect(() => {
    if (serviceOrder) {
      setServices(serviceOrder.services)
    }
  }, [serviceOrder])

  // Calculate total whenever services change
  useEffect(() => {
    const newTotal = services.reduce((sum, service) => sum + (service.price || 0), 0)
    setTotal(newTotal)
  }, [services])

  const handleServiceChange = (id: string, field: "description" | "price", value: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, [field]: field === "price" ? Number.parseFloat(value) || 0 : value }
          : service,
      ),
    )
  }

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      description: "",
      price: 0,
    }
    setServices((prev) => [...prev, newService])
  }

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices((prev) => prev.filter((service) => service.id !== id))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Add services data to form
      formData.append("services", JSON.stringify(services))

      let result
      if (serviceOrder?.id) {
        result = await updateServiceOrder(serviceOrder.id, formData)
      } else {
        result = await createServiceOrder(formData)
      }

      if (result.success) {
        router.push("/service-orders")
        router.refresh()
      } else {
        setError(result.error || "Failed to save service order")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (serviceOrder?.id) {
      router.push(`/service-orders/${serviceOrder.id}`)
    } else {
      setServices([{ id: "1", description: "", price: 0 }])
      setError("")
    }
  }

  const isEditMode = !!serviceOrder?.id

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-space-grotesk)]">
          {isEditMode ? "Edit Service Order" : "Create New Service Order"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={serviceOrder?.name || ""}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={serviceOrder?.phone || ""}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Service Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={serviceOrder?.date || new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={serviceOrder?.description || ""}
              placeholder="Enter service order description"
              rows={3}
            />
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Services</Label>
              <Button type="button" variant="outline" size="sm" onClick={addService}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <Card key={service.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`service-desc-${service.id}`}>Service Description</Label>
                      <Input
                        id={`service-desc-${service.id}`}
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                        placeholder="Enter service description"
                      />
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`service-price-${service.id}`}>Price ($)</Label>
                        <Input
                          id={`service-price-${service.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={service.price || ""}
                          onChange={(e) => handleServiceChange(service.id, "price", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      {services.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : isEditMode ? "Update Service Order" : "Save Service Order"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
