import { ServiceOrder } from "./graphql-client"

export const normalizeServicesOrder = (isWriting = false) => (serviceOrder: ServiceOrder): ServiceOrder => {
  if (isWriting) {
    const { services, ...so } = serviceOrder
    return { ...so, services_list: JSON.stringify(services || []) }
  }

  const { services_list, ...so } = serviceOrder
  return { ...so, services: JSON.parse(services_list || "[]") }
}


export const normalizeServicesOrderList = (servicesOrderList: ServiceOrder[], isWriting = false) => {
  return servicesOrderList.map(normalizeServicesOrder(isWriting))
}