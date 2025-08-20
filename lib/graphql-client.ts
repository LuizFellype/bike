import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client"

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

// GraphQL Queries and Mutations
export const GET_SERVICE_ORDERS = gql`
  query GetServiceOrders {
    serviceOrders {
      id
      name
      phone
      description
      services_list
      totalAmount
      created_at
      updated_at
    }
  }
`

// { [property]: { _eq: <value> } }
export const GET_SERVICE_ORDER_BY_WHERE = gql`
  query GetServiceOrderByWhere($whereInput: serviceOrders_bool_exp) {
    serviceOrders(where: $whereInput) {
      id
      name
      phone
      description
      services_list
      totalAmount
      created_at
      updated_at
    }
  }
`

export const CREATE_SERVICE_ORDER = gql`
  mutation CreateServiceOrder($input: serviceOrders_insert_input!) {
    insert_serviceOrders_one(object: $input) {
      id
      name
      phone
      description
      services_list
      totalAmount
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

export interface ServiceOrder {
  id: string
  name: string
  phone: string
  description: string
  services?: ServiceOrderService[]
  services_list?: string
  totalAmount: number
  created_at: string
  updated_at: string
}

export interface ServiceOrderFilter {
  id?: string
  phone?: string
  dateFrom?: string
  dateTo?: string
}

export interface CreateServiceOrderInput {
  name: string
  phone: string
  description: string
  totalAmount: number
  services: ServiceOrderService[]
}


export interface UpdateServiceOrderInput {
  name?: string
  phone?: string
  description?: string
  services?: ServiceOrderService[]
}
