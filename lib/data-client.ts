// TODO: Replace localStorage operations with actual API calls to database
export interface ServiceOrder {
  id: string
  name: string
  phone: string
  date: string
  description: string
  services: Service[]
  total: number
  created_at: string
  updated_at: string
}

export interface Service {
  description: string
  price: number
}

//export const dataClient = {
  // Service Orders
  const getServiceOrders = async (): Promise<ServiceOrder[]> => {
    // TODO: Replace with actual API call to database
    const orders = localStorage.getItem("serviceOrders")
    return orders ? JSON.parse(orders) : []
  }

  const getServiceOrderById = async (id: string): Promise<ServiceOrder | null> => {
    // TODO: Replace with actual API call to database
    const orders = await getServiceOrders()
    return orders.find((order) => order.id === id) || null
  }

  const createServiceOrder = async (order: Omit<ServiceOrder, "id" | "created_at" | "updated_at">): Promise<ServiceOrder> => {
    console.log('order', order)
      // TODO: Replace with actual API call to database
    const newOrder = { ...order, id: crypto.randomUUID() }
    const orders = await getServiceOrders()
    const updatedOrders = [...orders, newOrder]
    localStorage.setItem("serviceOrders", JSON.stringify(updatedOrders))
    return newOrder
  }

  const updateServiceOrder = async (order: ServiceOrder): Promise<ServiceOrder> => {
    // TODO: Replace with actual API call to database
    const orders = await getServiceOrders()
    const updatedOrders = orders.map((o) => (o.id === order.id ? order : o))
    localStorage.setItem("serviceOrders", JSON.stringify(updatedOrders))
    return order
  }

  const deleteServiceOrder = async (id: string): Promise<void> => {
    // TODO: Replace with actual API call to database
    const orders = await getServiceOrders()
    const updatedOrders = orders.filter((order) => order.id !== id)
    localStorage.setItem("serviceOrders", JSON.stringify(updatedOrders))
  }
//}


export const dataClient = {
  getServiceOrders,
  getServiceOrderById,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder
}
