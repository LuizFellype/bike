import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  apolloClient,
  GET_SERVICE_ORDERS,
  GET_SERVICE_ORDER_BY_WHERE,
  CREATE_SERVICE_ORDER,
  UPDATE_SERVICE_ORDER,
  DELETE_SERVICE_ORDER,
  ServiceOrderStatus,
} from "@/lib/graphql-client"
import type {
  ServiceOrder,
  ServiceOrderFilter,
  CreateServiceOrderInput,
  UpdateServiceOrderInput,
} from "@/lib/graphql-client"

const normalizeServicesOrderList = (servicesOrderList: ServiceOrder[], isWriting = false) => {
  return servicesOrderList.map(normalizeServicesOrder(isWriting))
}

const normalizeServicesOrder = (isWriting = false) => (serviceOrder: ServiceOrder): ServiceOrder => {
  if (isWriting) {
    const { services, ...so } = serviceOrder
    return { ...so, services_list: JSON.stringify(services || []) }
  }

  const { services_list, ...so } = serviceOrder
  return { ...so, services: JSON.parse(services_list || "[]") }
}

const normalizeReading = normalizeServicesOrder(false)
const normalizeWriting = normalizeServicesOrder(true)



// Hook for fetching all service orders with optional filtering
export function useServiceOrders(filterParams: ServiceOrderFilter = {}) {
  const filter = { 
    status: { _in: filterParams.status || [ServiceOrderStatus.WIP, ServiceOrderStatus.WAITING] },
    id: filterParams.id ? { _eq: filterParams.id } : undefined,
    phone: filterParams.phone ? { _eq: filterParams.phone } : undefined,
    created_at: (filterParams.dateFrom || filterParams.dateTo) ? { _gte: filterParams.dateFrom, _lte: filterParams.dateTo } : undefined 
  } as any
  
  return useQuery({
    queryKey: ["serviceOrders", filter],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_SERVICE_ORDERS,
        variables: { filter },
      })

      return normalizeServicesOrderList(result.data.serviceOrders)
    },

    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export type WhereParams = { key: keyof ServiceOrder, value: string | number }

const normalizeWhereInput = ({ key, value }: WhereParams) => {
  return { [key]: { _eq: Number(value) } }
}

export function useServiceOrder(params: WhereParams) {
  const queryClient = useQueryClient();

  let cachedItem = queryClient.getQueryData(['serviceOrder', params.value]);

  if (!cachedItem) {
    const allQueries = queryClient
      .getQueriesData({
        queryKey: ["serviceOrders"],
      })

    const filteredCachedSO = allQueries.reduce((acc, queryInfo) => {
      const fetchedQuery = queryInfo?.[1] as unknown as ServiceOrder[]
      const filteredByKey = fetchedQuery?.filter(so => so[params.key] === Number(params.value))

      if (!filteredByKey) return acc

      return [...acc, ...filteredByKey]
    }, [] as ServiceOrder[])

    if (filteredCachedSO[0]) {
      cachedItem = filteredCachedSO[0]
    }
  }

  const whereInput = normalizeWhereInput(params)
  const initial = cachedItem ? { initialData: cachedItem } : {}

  return useQuery({
    queryKey: ["serviceOrder", params.value],
    queryFn: async () => {
      // TODO: Replace with actual GraphQL query
      const result = await apolloClient.query({
        query: GET_SERVICE_ORDER_BY_WHERE,
        variables: { whereInput },
      })
      
      return normalizeReading(result.data.serviceOrders[0]) as ServiceOrder
    },
    enabled: !!params.value,
    ...initial
  })
}


// Hook for creating a new service order
export function useCreateServiceOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateServiceOrderInput) => {
      const input = normalizeWriting(params as ServiceOrder)

      const result = await apolloClient.mutate({
        mutation: CREATE_SERVICE_ORDER,
        variables: { input },
      })
      
      return normalizeReading(result.data.insert_serviceOrders_one)
    },
    onSuccess: (newServiceOrder) => {
      // Invalidate and refetch service orders list
      queryClient.invalidateQueries({ queryKey: ["serviceOrders"] })
      // wouldbe better to just update the cache to avoid unecessary refetch later
      // queryClient.setQueryData(['serviceOrders'], (currentData?: ServiceOrder[]) => {
      //   return [...(currentData || []), newServiceOrder];
      // });
    },
  })
}

// Hook for updating an existing service order
export function useUpdateServiceOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input: params }: { id: string; input: UpdateServiceOrderInput }) => {
      const input = normalizeWriting(params as ServiceOrder)

      const result = await apolloClient.mutate({
        mutation: UPDATE_SERVICE_ORDER,
        variables: { id, input },
      })

      return normalizeReading(result.data.update_serviceOrders_by_pk as ServiceOrder)
    },
    onSuccess: (data) => {
      // Invalidate and refetch service orders list and specific service order
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["serviceOrders"] })
        queryClient.invalidateQueries({ queryKey: ["serviceOrder", data.id] })
      }
    },
  })
}

// Hook for deleting a service order
export function useDeleteServiceOrder(filter?: ServiceOrderFilter) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const whereInput = normalizeWhereInput({ key: 'id', value: id })

      const result = await apolloClient.mutate({
        mutation: DELETE_SERVICE_ORDER,
        variables: { whereInput },
      })
      return result.data.deleteServiceOrder
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['serviceOrders', filter], (oldData?: ServiceOrder[]) => {
        const newData = oldData ? oldData.filter(item => item.id !== variables) : []

        return newData;
      });
    },
  })
}
