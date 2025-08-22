"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useServiceOrders, useDeleteServiceOrder, useUpdateServiceOrder } from "@/hooks/use-service-orders"
import { ServiceOrder, ServiceOrderStatus, ServiceOrderStatusLabel, type ServiceOrderFilter } from "@/lib/graphql-client"
import Link from "next/link"
import { statusConfig, StatusFilter, StatusToggleController } from "../ui/status-filter"
import { toast } from "@/hooks/use-toast"

const getDaysFromNow = (daysDiff: number) => {
  const today = new Date()
  const lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() + daysDiff)

  return lastWeek.toISOString().split("T")[0] // format as YYYY-MM-DD
}

const DEFAULT_PAGINATION = {
  limit: 15,
  page: 1,
}

const getInitialStates = () => {
  return {
    ...DEFAULT_PAGINATION,
    dateFrom: getDaysFromNow(-7),
    dateTo: getDaysFromNow(1),
    status: [ServiceOrderStatus.WAITING, ServiceOrderStatus.WIP],
  }
}
export function ServiceOrderList() {
  const [filters, setFilters] = useState<ServiceOrderFilter>(getInitialStates)

  const [status, setStatus] = useState(filters.status!)
  const [searchId, setSearchId] = useState("")
  const [searchPhone, setSearchPhone] = useState("")
  const [dateFrom, setDateFrom] = useState(filters.dateFrom)
  const [dateTo, setDateTo] = useState(filters.dateTo)

  const { data, isLoading, error } = useServiceOrders(filters)
  const { serviceOrders = [], totalCount } = data || {}

  const deleteMutation = useDeleteServiceOrder(filters)
  const updateMutation = useUpdateServiceOrder()

  const handleSearch = () => {
    const newFilters: ServiceOrderFilter = { page: filters.page, limit: filters.limit }
    if (searchId.trim()) newFilters.id = searchId.trim()
    if (searchPhone.trim()) newFilters.phone = searchPhone.trim()
    if (dateFrom) newFilters.dateFrom = dateFrom
    if (dateTo) newFilters.dateTo = dateTo
    if (status) newFilters.status = status

    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setSearchId("")
    setSearchPhone("")
    setDateFrom("")
    setDateTo("")
    setFilters(DEFAULT_PAGINATION)
  }

  const handleStatusToggle = async (id: ServiceOrder['id'], updatedStatus: ServiceOrder['status']) => {
    try {
      await updateMutation.mutateAsync({
        id: id,
        input: { status: updatedStatus },
      })
      toast({
        title: `OS (#${id}) está em ${ServiceOrderStatusLabel[updatedStatus]}!`,
      })
    } catch (error) {
      console.error("Error updating service order status:", error)
      toast({
        variant: "destructive",
        title: `Error ao atualizar Ordem de Serviço #${id}!`,
        description: (error as Error)?.message || "Error desconhecido. Contate o suporte.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service order?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error deleting service order:", error)
      }
    }
  }

  // TODO: improve loading placeholder usign skeleton instead
  const loadingView = (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-lg text-slate-600">Carregando...</div>
    </div>
  )

  const errorView = !isLoading && error && (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-lg text-red-600">Error ao carregar lista de OS: {error?.message}</div>
    </div>
  )


  const serviceOrdersView = serviceOrders?.length === 0 ? (
    <Card>
      <CardContent className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-lg text-slate-600 mb-2">0 Ordem de Serviços</div>
        </div>
      </CardContent>
    </Card>
  ) : (
    serviceOrders?.map((order) => (
      <Card key={order.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2 items-center">
              <h3 className="text-lg font-semibold text-slate-900">SO #{order.id}</h3>
              <p className="text-slate-600"> - {order.name}</p>
            </div>

            <StatusToggleController task={order} onMoveTask={handleStatusToggle} >
              <Badge variant="secondary" className={`${statusConfig[order.status].color} absolute top-[-12px] left-[20%]`} aria-selected>
                {statusConfig[order.status].label}
              </Badge>
            </StatusToggleController>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 justify-between">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-slate-500">Cell:</span>
              <p className="text-slate-900">{order.phone}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-slate-500">Date:</span>
              <p className="text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-slate-500">Services:</span>
              <p className="text-slate-900">{order.services?.length} service(s)</p>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="bg-purple-100 text-blue-800 text-md ml-2">
                R$ {order.totalAmount.toFixed(2)}
              </Badge>
            </div>
          </div>

          {order.description && (
            <div className="mb-4">
              <span className="text-sm font-medium text-slate-500">Description:</span>
              <p className="text-slate-900 text-sm">{order.description}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Link href={`/service-orders/edit/${order.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                View/Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(order.id)}
              disabled={deleteMutation.isPending}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    ))
  )

  const { page } = filters
  const totalPages = Math.ceil(totalCount / filters.limit)

  const changePage = (incrementToPage: number) => () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: prevFilters.page + incrementToPage,
    }));
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Filter Service Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-id">SO ID</Label>
              <Input
                id="search-id"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by ID"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-phone">Phone</Label>
              <Input
                id="search-phone"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Search by phone"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

          </div>
          <div className="flex justify-between items-center mt-4">
            <StatusFilter selectedStatuses={status} onStatusChange={setStatus} />

            <div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Service Orders List */}
      <div className="grid gap-4">
        {errorView}

        {isLoading ? loadingView : serviceOrdersView}


        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={changePage(-1)}
            disabled={page === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-3 w-3" />
            Anterior

          </Button>

          <span className="text-sm text-muted-foreground">
            Pag. {page} de {totalPages}. (Total: {totalCount} items)
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={changePage(1)}
            disabled={page === totalPages}
            className="gap-1"
          >
            Próxima
            <ChevronRight className="h-3 w-3" />

          </Button>


        </div>
      </div>
    </div>
  )
}
