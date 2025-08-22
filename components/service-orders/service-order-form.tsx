"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useCreateServiceOrder, useUpdateServiceOrder } from "@/hooks/use-service-orders"
import type { ServiceOrder, ServiceOrderService } from "@/lib/graphql-client"
import { toast } from "@/hooks/use-toast"

interface ServiceOrderFormProps {
  serviceOrder?: ServiceOrder
  onSave?: () => void
  onCancel?: () => void
}

export function ServiceOrderForm({ serviceOrder, onSave, onCancel }: ServiceOrderFormProps) {
  const todayDate = new Date().toISOString().split("T")[0]
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [services, setServices] = useState<ServiceOrderService[]>([{ description: "", price: 0 }])

  const createMutation = useCreateServiceOrder()
  const updateMutation = useUpdateServiceOrder()

  const isEditing = !!serviceOrder
  
  useEffect(() => {
    if (serviceOrder) {
      setName(serviceOrder.name)
      setPhone(serviceOrder.phone)
      setDescription(serviceOrder.description)
      setServices((serviceOrder?.services ?? []).length > 0 ? serviceOrder.services! : [{ description: "", price: 0 }])
    }
  }, [serviceOrder])

  const addService = () => {
    setServices([...services, { description: "", price: 0 }])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index))
    }
  }

  const updateService = (index: number, field: keyof ServiceOrderService, value: string | number) => {
    const updatedServices = services.map((service, i) => (i === index ? { ...service, [field]: value } : service))
    setServices(updatedServices)
  }

  const totalAmount = services.reduce((sum, service) => sum + (service.price || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimServices = services.filter((service) => service.description.trim() !== "")
    const serviceOrderData = {
      name,
      phone,
      description,
      services: trimServices,
      totalAmount: trimServices.reduce((sum, service) => sum + (service.price || 0), 0),
    }

    try {
      if (isEditing && serviceOrder) {
        await updateMutation.mutateAsync({
          id: serviceOrder.id,
          input: serviceOrderData,
        })
        toast({ 
          title: `OS (#${serviceOrder?.id}) atualizada com Sucesso!`, 
        })  
      } else {
        const newServiceOrder = await createMutation.mutateAsync(serviceOrderData)

        toast({ 
          title: `OS (#${newServiceOrder?.id}) criada com Sucesso!`, 
          description: "Agora pode gerenciá-la na pagina de Listas de OS." 
        })  
      }

      onSave?.()
    } catch (error) {
      console.error("Error saving service order:", error)
      toast({
        variant: "destructive",
        title: "Error ao criar Ordem de Serviço!",
        description: (error as Error)?.message || "Error desconhecido. Contate o suporte.",
      })
    }
  }

  const handleCancel = () => {
    setName("")
    setPhone("")
    // setDate(new Date().toISOString().split("T")[0])
    setDescription("")
    setServices([{ description: "", price: 0 }])
    onCancel?.()
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col">
      <CardHeader className="flex-row items-center flex-1 justify-between">
        <CardTitle className="text-2xl font-bold text-slate-900">
          {isEditing ? "Edit Service Order" : "Create Service Order"}
        </CardTitle>
        <span>{todayDate}</span>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Services</Label>
              <Button
                type="button"
                onClick={addService}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </div>

            {services.map((service, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`service-desc-${index}`}>Description</Label>
                  <Input
                    id={`service-desc-${index}`}
                    value={service.description}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                    placeholder="Service description"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor={`service-price-${index}`}>Price</Label>
                  <Input
                    id={`service-price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={service.price || ""}
                    onChange={(e) => updateService(index, "price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                {services.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeService(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-700">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
