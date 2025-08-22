import { ApolloClient, ApolloQueryResult, InMemoryCache, createHttpLink, gql } from "@apollo/client"
import { normalizeServicesOrderList } from "./data-normalizations"

// TODO: Replace with your actual GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  headers: {
    "x-hasura-admin-secret": process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_ADMIN_KEY || "",
  },

})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: "all",
    },
  },
})

// GraphQL Queries
export const queryList = (variables: any) => {
  const query = {
    query: GET_SERVICE_ORDERS,
    variables,
  }

  const handleResult = (result: ApolloQueryResult<any>) => {
    return {
      serviceOrders: normalizeServicesOrderList(result.data?.serviceOrders),
      totalCount: result.data?.serviceOrders_aggregate.aggregate.count,
      // totalAmount: result.data?.serviceOrders_aggregate.aggregate.sum.totalAmount,
    }
  }
  
  return { query, handleResult }
}

export const GET_SERVICE_ORDERS = gql`
  query GetServiceOrders($whereInput: serviceOrders_bool_exp, $limit: Int, $offset: Int) {
    serviceOrders(where: $whereInput, limit: $limit, offset: $offset) {
      id
      name
      phone
      description
      services_list
      totalAmount
      status
      created_at
      updated_at
    }
    serviceOrders_aggregate(where: $whereInput) {
      aggregate {
        count
      }
    }
  }
`

export const queryDashboard = (variables: any) => {
  const query = {
    query: GET_DASHBOARD_SERVICE_ORDERS,
    variables,
  }

  const handleResult = (result: ApolloQueryResult<any>) => {
    return {
      totalCount: result.data?.serviceOrders_aggregate.aggregate.count,
      totalAmount: result.data?.serviceOrders_aggregate.aggregate.sum.totalAmount,
    }
  }

  return { query, handleResult }
}
export const GET_DASHBOARD_SERVICE_ORDERS = gql`
  query GetServiceOrdersForDashboard($whereInput: serviceOrders_bool_exp) {
    serviceOrders_aggregate(where: $whereInput) {
      aggregate {
        count
        sum {
          totalAmount
        }
      }
      
    }
  }
`

export const GET_SERVICE_ORDER_BY_WHERE = gql`
  query GetServiceOrderByWhere($whereInput: serviceOrders_bool_exp) {
    serviceOrders(where: $whereInput) {
      id
      name
      phone
      description
      services_list
      totalAmount
      status
      created_at
      updated_at
    }
  }
`



// GraphQL Mutations

export const CREATE_SERVICE_ORDER = gql`
  mutation CreateServiceOrder($input: serviceOrders_insert_input!) {
    insert_serviceOrders_one(object: $input) {
      id
      name
      phone
      description
      services_list
      totalAmount
      status
      created_at
      updated_at
    }
  }
`

export const UPDATE_SERVICE_ORDER = gql`
  mutation UpdateServiceOrder($id: Int!, $input: serviceOrders_set_input!) {
    update_serviceOrders_by_pk(pk_columns: { id: $id }, _set: $input) {
        id
        name
        phone
        description
        services_list
        totalAmount
        status
        created_at
        updated_at
    }
  }
`
// { [property]: { _eq: <value> } }
export const DELETE_SERVICE_ORDER = gql`
  mutation DeleteServiceOrder($whereInput: serviceOrders_bool_exp!) {
    delete_serviceOrders(where: $whereInput) {
      returning {
        id
      }
    }
  }
`

// TypeScript types for GraphQL operations
export interface ServiceOrderService {
  description: string
  price: number
}

// create enum "waiting" | "wip" | "done"
export enum ServiceOrderStatus {
  WAITING = "waiting",
  WIP = "wip",
  DONE = "done",
}
export const ServiceOrderStatusLabel = {
  [ServiceOrderStatus.WAITING]: "Na fila",
  [ServiceOrderStatus.WIP]: "Em Progresso",
  [ServiceOrderStatus.DONE]: "Finalizada",
}

export interface ServiceOrder {
  id: string
  name: string
  phone: string
  description: string
  services?: ServiceOrderService[]
  services_list?: string
  totalAmount: number
  status: ServiceOrderStatus
  created_at: string
  updated_at: string
}

export interface ServiceOrderFilter {
  id?: string
  phone?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  page?: number
  status?: ServiceOrderStatus[]
}

export interface CreateServiceOrderInput {
  name: string
  phone: string
  description: string
  totalAmount: number
  services: ServiceOrderService[]
}


type OmitAndMakeRestOptional<T, K extends keyof T> = Partial<Omit<T, K>>;

export type UpdateServiceOrderInput = OmitAndMakeRestOptional<ServiceOrder, 'id' | 'created_at' | 'updated_at'>; 

