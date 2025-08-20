"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "./auth"

export interface Service {
  id: string
  description: string
  price: number
}

export interface ServiceOrder {
  id: string
  userId: string
  name: string
  phone: string
  date: string
  description: string
  services: Service[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface ServiceOrderResult {
  success: boolean
  error?: string
  serviceOrder?: ServiceOrder
}

export interface ServiceOrdersResult {
  success: boolean
  error?: string
  serviceOrders?: ServiceOrder[]
}

// Simulate database storage
let serviceOrders: ServiceOrder[] = []

export async function createServiceOrder(formData: FormData): Promise<ServiceOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const servicesData = formData.get("services") as string

  // Validation
  if (!name || !phone || !date) {
    return { success: false, error: "Name, phone, and date are required" }
  }

  let services: Service[] = []
  try {
    services = JSON.parse(servicesData || "[]")
  } catch {
    return { success: false, error: "Invalid services data" }
  }

  if (services.length === 0) {
    return { success: false, error: "At least one service is required" }
  }

  // Validate services
  const hasInvalidService = services.some((service) => !service.description.trim() || service.price <= 0)
  if (hasInvalidService) {
    return { success: false, error: "All services must have description and price greater than 0" }
  }

  const total = services.reduce((sum, service) => sum + service.price, 0)

  const newServiceOrder: ServiceOrder = {
    id: `SO-${Date.now()}`,
    userId: user.id,
    name,
    phone,
    date,
    description: description || "",
    services,
    total,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  serviceOrders.push(newServiceOrder)
  revalidatePath("/service-orders")

  return { success: true, serviceOrder: newServiceOrder }
}

export async function updateServiceOrder(id: string, formData: FormData): Promise<ServiceOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const existingOrder = serviceOrders.find((order) => order.id === id && order.userId === user.id)
  if (!existingOrder) {
    return { success: false, error: "Service order not found" }
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const servicesData = formData.get("services") as string

  // Validation
  if (!name || !phone || !date) {
    return { success: false, error: "Name, phone, and date are required" }
  }

  let services: Service[] = []
  try {
    services = JSON.parse(servicesData || "[]")
  } catch {
    return { success: false, error: "Invalid services data" }
  }

  if (services.length === 0) {
    return { success: false, error: "At least one service is required" }
  }

  // Validate services
  const hasInvalidService = services.some((service) => !service.description.trim() || service.price <= 0)
  if (hasInvalidService) {
    return { success: false, error: "All services must have description and price greater than 0" }
  }

  const total = services.reduce((sum, service) => sum + service.price, 0)

  const updatedOrder: ServiceOrder = {
    ...existingOrder,
    name,
    phone,
    date,
    description: description || "",
    services,
    total,
    updatedAt: new Date().toISOString(),
  }

  serviceOrders = serviceOrders.map((order) => (order.id === id ? updatedOrder : order))
  revalidatePath("/service-orders")
  revalidatePath(`/service-orders/${id}`)

  return { success: true, serviceOrder: updatedOrder }
}

export async function deleteServiceOrder(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const orderIndex = serviceOrders.findIndex((order) => order.id === id && order.userId === user.id)
  if (orderIndex === -1) {
    return { success: false, error: "Service order not found" }
  }

  serviceOrders.splice(orderIndex, 1)
  revalidatePath("/service-orders")

  return { success: true }
}

export async function getServiceOrders(): Promise<ServiceOrdersResult> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const userOrders = serviceOrders.filter((order) => order.userId === user.id)
  return { success: true, serviceOrders: userOrders }
}

export async function getServiceOrder(id: string): Promise<ServiceOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const order = serviceOrders.find((order) => order.id === id && order.userId === user.id)
  if (!order) {
    return { success: false, error: "Service order not found" }
  }

  return { success: true, serviceOrder: order }
}
