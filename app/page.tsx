"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useServiceOrders } from "@/hooks/use-service-orders"
import { ServiceOrderStatus } from "@/lib/graphql-client"
import Link from "next/link"


const getFirstDayOfCurrentMonth = () => {
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().split("T")[0] // Return in YYYY-MM-DD format
}

// create function to normalize currency BRL
const normalizeCurrencyBRL = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function HomePage() {
  const { data, isLoading, error } = useServiceOrders({ status: [ServiceOrderStatus.DONE], dateFrom: getFirstDayOfCurrentMonth() }, true)

  const { totalAmount = 0, totalCount = 0 } = data || {}

  const errorView = error && (
    <div className="text-red-500">Erro ao carregar estatísticas: {error.message}</div>)

  const loadingView = isLoading && (
    <div className="text-gray-500">Carregando Informações...</div>
  )


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Service Order Card */}
        <Card className="hover:shadow-lg transition-shadow flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Criar Ordem Serviços</CardTitle>
            <CardDescription>Formulário para Criar OS</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/service-orders/create">
              <Button className="w-full">Criar nova OS</Button>
            </Link>
          </CardContent>
        </Card>

        {/* View Service Orders Card */}
        <Card className="hover:shadow-lg transition-shadow flex flex-col justify-between">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center gap-2">Gerenciar Ordem Serviços</CardTitle>
            <CardDescription>Filtar, alterar e selecionar para editar ordem de serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/service-orders">
              <Button variant="outline" className="w-full bg-transparent">
                Vizualizar OSs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Estatísticas rápidas</CardTitle>
            <CardDescription>Visão geral das Ordem de Serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-center">
                <span className="text-md text-muted-foreground">No Mês (OS Finalizadas):</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="font-medium">{totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Recebido:</span>
                <span className="font-medium">{normalizeCurrencyBRL(totalAmount ?? 0)}</span>
              </div> 
            </div>
          </CardContent>
        </Card>

        {loadingView}

        {errorView}
      </div>
    </div>
  )
}
