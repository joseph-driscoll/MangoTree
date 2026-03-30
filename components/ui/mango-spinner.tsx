import { cn } from "@/lib/utils"

interface MangoSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  overlay?: boolean
}

export function MangoSpinner({ size = "md", className, overlay = false }: MangoSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const spinner = (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer ring - Orange */}
      <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>

      {/* Inner ring - Green */}
      <div className="absolute inset-2 rounded-full border-3 border-green-200"></div>
      <div
        className="absolute inset-2 rounded-full border-3 border-transparent border-t-green-600 animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
      ></div>

      {/* Center dot */}
      <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">{spinner}</div>
          <p className="text-gray-600 font-medium">Loading your content...</p>
        </div>
      </div>
    )
  }

  return spinner
}
