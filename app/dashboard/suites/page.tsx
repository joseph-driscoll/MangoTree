"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { DatabaseService } from "@/lib/database-service"
import { useAuth } from "@/components/auth/auth-provider"
import { ContentSuiteMasonry } from "@/components/content-gallery/content-suite-masonry"
import { MangoSpinner } from "@/components/ui/mango-spinner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { RefreshCw } from "lucide-react"
import { MultiStepWizard } from "@/components/onboarding/multi-step-wizard"

export default function SuitesPage() {
  const { user } = useAuth()
  const [contentData, setContentData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Use refs to track ongoing requests and prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (user?.id) {
      loadContent()
    }

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      loadingRef.current = false
    }
  }, [user?.id])

  const loadContent = async () => {
    if (!user?.id || loadingRef.current) return

    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()
      loadingRef.current = true

      setLoading(true)
      setError(null)

      const result = await DatabaseService.getUserGeneratedContent(user.id)

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      // Filter to only show suites (content that has suite_id and is not generated individually)
      const suiteContent = result.all.filter(
        (item: any) =>
          item.suite_id && !item.generated_individually && item.suite_name && item.suite_name !== "Individual",
      )

      setContentData(suiteContent)
    } catch (error) {
      // Don't show errors for aborted requests
      if (error instanceof Error && error.name === "AbortError") {
        return
      }

      console.error("Failed to load content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load content"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    loadContent()
  }

  const handleContentUpdate = async (contentId: string, pieceIndex: number, newContent: string) => {
    try {
      await DatabaseService.updateGeneratedContent(contentId, { content: newContent })
      await loadContent()
      toast.success("Content updated successfully!")
    } catch (error) {
      toast.error("Failed to update content")
    }
  }

  const handleModelUpdate = async (contentId: string, pieceIndex: number, newModel: string) => {
    // Model updates are handled by the regenerate API
    // Reload content to ensure all views are in sync
    await loadContent()
  }

  const handleStatusUpdate = async (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => {
    // Status updates are tracked locally via ContentTrailStorage
    // No need to reload data for status changes
  }

  const handleDeleteSuite = async (suiteId: string) => {
    try {
      await DatabaseService.deleteContentSuite(suiteId)
      await loadContent()
      toast.success("Suite deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete suite")
    }
  }

  const handleCreateSuite = () => {
    setIsWizardOpen(true)
  }

  const handleWizardClose = () => {
    setIsWizardOpen(false)
    // Reload content after wizard closes in case new content was generated
    loadContent()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MangoSpinner size="lg" />
          </div>
          <p className="text-gray-600 font-medium">Loading your content suites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
            <RefreshCw className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Suites</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={handleRetry}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Header - Mobile Responsive */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Content Suites</h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                      Explore your organized content collections and suites
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ContentSuiteMasonry
                  contentData={contentData}
                  onContentUpdate={handleContentUpdate}
                  onModelUpdate={handleModelUpdate}
                  onStatusUpdate={handleStatusUpdate}
                  onOpenIndividualWizard={() => {}}
                  onCreateSuite={handleCreateSuite}
                  onDeleteSuite={handleDeleteSuite}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* Multi-Step Wizard */}
      <MultiStepWizard isOpen={isWizardOpen} onClose={handleWizardClose} />
    </div>
  )
}
