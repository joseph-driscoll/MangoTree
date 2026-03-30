"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Lightbulb } from "lucide-react"

export function OnboardingTooltip() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show tooltip after a short delay for first-time users
    const timer = setTimeout(() => {
      const hasSeenTooltip = localStorage.getItem("mango-tree-tooltip-seen")
      if (!hasSeenTooltip) {
        setIsVisible(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("mango-tree-tooltip-seen", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="border-2 border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">💡 Quick Tip!</h3>
              <p className="text-sm text-green-800 mb-3">
                Click any content block to edit it! You can customize everything to match your brand perfectly.
              </p>

              <Button size="sm" onClick={handleDismiss} className="bg-green-600 hover:bg-green-700 text-white">
                Got it!
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
