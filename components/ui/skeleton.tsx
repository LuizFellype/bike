import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority" 
import React from "react"


const skeletonVariants = cva("animate-pulse rounded-md bg-muted", {
  variants: {
    variant: {
      default: "bg-muted",
      card: "bg-card border border-border",
      text: "bg-muted/60",
      avatar: "rounded-full bg-muted",
      button: "bg-muted rounded-md",
    },
    size: {
      xs: "h-3",
      sm: "h-4",
      md: "h-5",
      lg: "h-6",
      xl: "h-8",
      "2xl": "h-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})


const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, variant, size, ...props }, ref) => {
  return <div className={cn(skeletonVariants({ variant, size, className }))} ref={ref} {...props} />
})


export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

const SkeletonText = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} variant="text" className={cn("w-full", className)} {...props} />
  ),
)
const SkeletonButton = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} variant="button" className={cn("w-20 h-9", className)} {...props} />
  ),
)

const SkeletonSOCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border border-border p-6 space-y-4 bg-card", className)} {...props}>
      {children || (
        <>
          <div className="flex items-center space-x-4">
            <div className="space-y-2 flex-1">
              <SkeletonText size="xl" className="w-1/3" />
              {/* <SkeletonText size="sm" className="w-3/4" /> */}
            </div>
            <SkeletonButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 justify-between items-center">
            <SkeletonText size="md" className="w-2/3" />
            <div className="flex justify-center"><SkeletonText size="md" className="w-2/3" /></div>
            <SkeletonText size="md" className="w-1/2" />
            <div className="flex justify-center"><SkeletonText size="xl" className="w-1/2" /></div>
          </div>

          <SkeletonText size="xl" className="w-full" />
          <div className="flex items-center gap-2">
            <SkeletonButton className="w-1/3" />
            <SkeletonButton />
          </div>
        </>
      )}
    </div>
  ),
)

export { Skeleton, SkeletonSOCard }


