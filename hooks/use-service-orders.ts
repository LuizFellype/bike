import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  apolloClient,
  GET_SERVICE_ORDERS,
  GET_SERVICE_ORDER_BY_WHERE,
  CREATE_SERVICE_ORDER,
  UPDATE_SERVICE_ORDER,
  DELETE_SERVICE_ORDER,
  ServiceOrderStatus,
  GET_DASHBOARD_SERVICE_ORDERS,
  queryList,
  queryDashboard,
} from "@/lib/graphql-client"
import type {
  ServiceOrder,
  ServiceOrderFilter,
  CreateServiceOrderInput,
  UpdateServiceOrderInput,
} from "@/lib/graphql-client"
import { ApolloQueryResult, OperationVariables, QueryOptions } from "@apollo/client"
import { normalizeServicesOrder } from "@/lib/data-normalizations"


const normalizeReading = normalizeServicesOrder(false)
const normalizeWriting = normalizeServicesOrder(true)

type ServiceOrdersPaginationResult = {
  serviceOrders: ServiceOrder[]
  totalCount: number
}
// Hook for fetching all service orders with optional filtering
export function useServiceOrders(filterParams: ServiceOrderFilter, isDashboard = false) {
  const limit = filterParams.limit
  const offset = !!limit ? (filterParams.page ? (filterParams.page - 1) * limit : 0) : 0

  const filter = {
    status: { _in: filterParams.status || [ServiceOrderStatus.WIP, ServiceOrderStatus.WAITING] },
    id: filterParams.id ? { _eq: filterParams.id } : undefined,
    phone: filterParams.phone ? { _eq: filterParams.phone } : undefined,
    created_at: (filterParams.dateFrom || filterParams.dateTo) ? { _gte: filterParams.dateFrom, _lte: filterParams.dateTo } : undefined,
  } as any

  const filterKey = { ...filter, limit, offset }

  const queryFnBuilder = (query: QueryOptions<OperationVariables, any>, handleResult: (arg0: ApolloQueryResult<any>) => any) => async () => {
    const result = await apolloClient.query(query)

    return handleResult(result)
  }

  const { query, handleResult } = isDashboard ? queryDashboard({ whereInput: filter }) : queryList({ whereInput: filter, limit, offset }) 

  return useQuery({
    queryKey: ["serviceOrders", filterKey],
    queryFn: queryFnBuilder(query, handleResult),
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

    let filteredByKey;
    allQueries.find((queryInfo) => {
      const fetchedQuery = queryInfo?.[1] as unknown as ServiceOrdersPaginationResult
      
      filteredByKey = fetchedQuery?.serviceOrders?.find(so => so[params.key] === Number(params.value))

      return !!filteredByKey
    })

    cachedItem = filteredByKey
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
