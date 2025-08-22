"use client"
import { ArrowLeft, ArrowRight, Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { ServiceOrder, ServiceOrderStatus, ServiceOrderStatusLabel } from "@/lib/graphql-client"
import { ReactNode } from "react"


interface StatusFilterProps {
  selectedStatuses: ServiceOrderStatus[]
  onStatusChange: (statuses: ServiceOrderStatus[]) => void
  className?: string
}

const statusConfig = {
  waiting: {
    label: ServiceOrderStatusLabel[ServiceOrderStatus.WAITING],
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    buttonColor:
      "hover:bg-yellow-50 hover:text-yellow-300 data-[selected=true]:bg-yellow-100 data-[selected=true]:text-yellow-800 dark:hover:bg-yellow-900/10 dark:data-[selected=true]:bg-yellow-900/20 dark:data-[selected=true]:text-yellow-400",
  },
  wip: {
    label: ServiceOrderStatusLabel[ServiceOrderStatus.WIP],
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    buttonColor:
      "hover:bg-blue-50 hover:text-blue-300 data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-800 dark:hover:bg-blue-900/10 dark:data-[selected=true]:bg-blue-900/20 dark:data-[selected=true]:text-blue-400",
  },
  done: {
    label: ServiceOrderStatusLabel[ServiceOrderStatus.DONE],
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    buttonColor:
      "hover:bg-green-50 hover:text-green-300 data-[selected=true]:bg-green-100 data-[selected=true]:text-green-800 dark:hover:bg-green-900/10 dark:data-[selected=true]:bg-green-900/20 dark:data-[selected=true]:text-green-400",
  },
} as const

export function StatusFilter({ selectedStatuses, onStatusChange, className }: StatusFilterProps) {
  const handleStatusToggle = (status: ServiceOrderStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    onStatusChange(newStatuses)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Status:</span>
        </div>

        {/* Status toggle buttons */}
        <div className="flex gap-1">
          {(Object.keys(statusConfig) as ServiceOrderStatus[]).map((status) => {
            const isSelected = selectedStatuses.includes(status)
            return (
              <Button
                key={status}
                variant="outline"
                size="sm"
                data-selected={isSelected}
                onClick={() => handleStatusToggle(status)}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-colors",
                  "border-2 border-transparent",
                  statusConfig[status].buttonColor,
                  isSelected && "border-current shadow-sm",
                )}
              >
                <div className={cn("w-2 h-2 rounded-full mr-2", statusConfig[status].color.split(" ")[0])} />
                {statusConfig[status].label}
              </Button>
            )
          })}
        </div>

      </div>


    </div>
  )
}

export { statusConfig }


const getNextStatus = (currentStatus: ServiceOrderStatus): ServiceOrderStatus | null => {
  switch (currentStatus) {
    case ServiceOrderStatus.WAITING:
      return ServiceOrderStatus.WIP
    case ServiceOrderStatus.WIP:
      return ServiceOrderStatus.DONE
    case ServiceOrderStatus.DONE:
      return null
    default:
      return null
  }
}

const getPreviousStatus = (currentStatus: ServiceOrderStatus): ServiceOrderStatus | null => {
  switch (currentStatus) {
    case ServiceOrderStatus.WIP:
      return ServiceOrderStatus.WAITING
    case ServiceOrderStatus.DONE:
      return ServiceOrderStatus.WIP
    case ServiceOrderStatus.WAITING:
      return null
    default:
      return null
  }
}
export type StatusToggleControllerProps = { 
  onMoveTask: (id: ServiceOrder['id'], updatedStatus: ServiceOrderStatus) => void
  task: ServiceOrder
  children: ReactNode;
}

export const StatusToggleController = ({ onMoveTask, task, children }: StatusToggleControllerProps) => {
  const { id, status } = task

  const previousStatus = getPreviousStatus(status)
  const nextStatus = getNextStatus(status)

  return <div className="flex gap-2 relative">
    {previousStatus && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onMoveTask(id, previousStatus)}
        className="gap-1 text-xs"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar
      </Button>
    )}

    {children}

    {nextStatus && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onMoveTask(id, nextStatus)}
        className="gap-1 text-xs"
      >
        {status === "wip" ? (
          <>
            <Check className="h-3 w-3" />
            Finalizar
          </>
        ) : (
          <>
            <ArrowRight className="h-3 w-3" />
            Começar
          </>
        )}
      </Button>
    )}
  </div>
}