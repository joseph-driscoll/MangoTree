"use client"

import { FileText, Download, Sparkles, Expand, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface GeneratedContentHeaderProps {
  contentTypesCount: number
  totalPieces: number
  allExpanded: boolean
  onToggleAll: () => void
  onOpenIndividualWizard?: (contentType: string) => void
}

export function GeneratedContentHeader({
  contentTypesCount,
  totalPieces,
  allExpanded,
  onToggleAll,
  onOpenIndividualWizard,
}: GeneratedContentHeaderProps) {
  return (
    <div className="bg-white border-b px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Generated Content</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {contentTypesCount} content types • {totalPieces} total pieces
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" onClick={onToggleAll} className="text-xs sm:text-sm">
            {allExpanded ? (
              <>
                <Minimize className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Collapse All
              </>
            ) : (
              <>
                <Expand className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Expand All
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export
          </Button>
          <Link href="/onboarding">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm w-full sm:w-auto">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Generate New Suite
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Quick Generate Individual Content</h3>
            <p className="text-xs text-gray-600">Create single pieces of content for specific needs</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { type: "website", label: "Website", icon: "🌐" },
              { type: "email", label: "Email", icon: "📧" },
              { type: "social", label: "Social", icon: "📱" },
              { type: "messages", label: "Messages", icon: "💬" },
              { type: "listings", label: "Listings", icon: "📋" },
              { type: "reviews", label: "Reviews", icon: "⭐" },
              { type: "blog", label: "Blog", icon: "📝" },
            ].map((contentType) => (
              <Button
                key={contentType.type}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (contentType.type === "website") {
                    onOpenIndividualWizard?.("website")
                  } else {
                    onOpenIndividualWizard?.(contentType.type)
                  }
                }}
                className="text-xs hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-colors"
              >
                <span className="mr-1">{contentType.icon}</span>
                {contentType.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
