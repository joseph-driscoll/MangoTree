"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { GeneratedContentHeader } from "@/components/dashboard/generated-content-header"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sparkles, FileText, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { DatabaseService } from "@/lib/database-service"
import { EditContentDialog } from "@/components/dialogs/edit-content-dialog"
import { IndividualContentWizard } from "@/components/dialogs/individual-content-wizard"
import { ContentMasonry } from "@/components/content-gallery/content-masonry"
import { toast } from "sonner"
import Link from "next/link"
import { MobileMenuProvider } from "@/components/dashboard/mobile-menu-context"
import { MangoSpinner } from "@/components/ui/mango-spinner"
import { ClientOnlyWrapper } from "@/components/dashboard/client-only-wrapper"

interface GeneratedContent {
  id: string
  type: string
  content: any
  created_at: string
  prompt: string
  tone?: string
  audiences?: string[]
  voice?: string
  suite_id?: string
  suite_name?: string
  generated_individually?: boolean
  generated_by?: string
  regenerated?: boolean
  edited?: boolean
  subcategory?: string
}

interface ContentSuite {
  suite_id: string
  suite_name: string
  created_at: string
  content: GeneratedContent[]
}

// Gamification helpers with MangoTree theme
const getContentMilestone = (totalPieces: number) => {
  if (totalPieces >= 1000)
    return { icon: Sparkles, label: "Mango Master", color: "text-orange-600", bgColor: "bg-orange-100" }
  if (totalPieces >= 500)
    return { icon: Sparkles, label: "Content Champion", color: "text-green-600", bgColor: "bg-green-100" }
  if (totalPieces >= 100)
    return { icon: Sparkles, label: "Content Pro", color: "text-blue-600", bgColor: "bg-blue-100" }
  if (totalPieces >= 50)
    return { icon: Sparkles, label: "Growing Strong", color: "text-green-600", bgColor: "bg-green-100" }
  if (totalPieces >= 10)
    return { icon: Sparkles, label: "Sprouting", color: "text-orange-600", bgColor: "bg-orange-100" }
  return { icon: Sparkles, label: "Seedling", color: "text-gray-600", bgColor: "bg-gray-100" }
}

export default function GeneratedContentPage() {
  const { user } = useAuth()
  const [contentData, setContentData] = useState<{
    suites: ContentSuite[]
    individual: GeneratedContent[]
    all: GeneratedContent[]
    hasMore: boolean
    total: number
  }>({ suites: [], individual: [], all: [], hasMore: false, total: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null)
  const [contentUpdates, setContentUpdates] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(200)
  const [individualWizardOpen, setIndividualWizardOpen] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Use refs to track ongoing requests and prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null)
  const loadingRef = useRef(false)

  const loadContent = useCallback(
    async (page = 0, append = false) => {
      if (!user || loadingRef.current) return

      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController()
        loadingRef.current = true

        if (!append) {
          setLoading(true)
          setError(null)
        } else {
          setLoadingMore(true)
        }

        const data = await DatabaseService.getUserGeneratedContent(
          user.id,
          undefined,
          itemsPerPage,
          page * itemsPerPage,
        )

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return
        }

        if (append) {
          setContentData((prev) => ({
            suites: [...prev.suites, ...data.suites],
            individual: [...prev.individual, ...data.individual],
            all: [...prev.all, ...data.all],
            hasMore: data.hasMore,
            total: prev.total + data.total,
          }))
        } else {
          setContentData(data)
        }

        setCurrentPage(page)
      } catch (error) {
        // Don't show errors for aborted requests
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        console.error("Failed to load content:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to load content"
        setError(errorMessage)
        toast.error(errorMessage)

        if (!append) {
          setContentData({ suites: [], individual: [], all: [], hasMore: false, total: 0 })
        }
      } finally {
        loadingRef.current = false
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [user, itemsPerPage],
  )

  useEffect(() => {
    if (user) {
      loadContent(0, false)
    }

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      loadingRef.current = false
    }
  }, [user, loadContent])

  const handleRetry = () => {
    setError(null)
    loadContent(0, false)
  }

  const loadMore = () => {
    if (contentData.hasMore && !loadingMore && !loadingRef.current) {
      loadContent(currentPage + 1, true)
    }
  }

  const handleContentUpdate = (contentId: string, pieceIndex: number, newContent: string) => {
    setContentUpdates((prev) => ({
      ...prev,
      [`${contentId}-${pieceIndex}`]: newContent,
    }))

    setContentData((prev) => ({
      ...prev,
      all: prev.all.map((item) => {
        if (item.id === contentId && Array.isArray(item.content)) {
          const updatedContent = [...item.content]
          if (updatedContent[pieceIndex]) {
            updatedContent[pieceIndex] = {
              ...updatedContent[pieceIndex],
              content: newContent,
            }
          }
          return { ...item, content: updatedContent, updated_at: new Date().toISOString() }
        }
        return item
      }),
      // Also update suites and individual arrays
      suites: prev.suites.map((suite) => ({
        ...suite,
        content: suite.content.map((subcat: any) => ({
          ...subcat,
          content: subcat.content.map((item: any) => {
            if (item.id === contentId && Array.isArray(item.content)) {
              const updatedContent = [...item.content]
              if (updatedContent[pieceIndex]) {
                updatedContent[pieceIndex] = {
                  ...updatedContent[pieceIndex],
                  content: newContent,
                }
              }
              return { ...item, content: updatedContent, updated_at: new Date().toISOString() }
            }
            return item
          }),
        })),
      })),
      individual: prev.individual.map((item) => {
        if (item.id === contentId && Array.isArray(item.content)) {
          const updatedContent = [...item.content]
          if (updatedContent[pieceIndex]) {
            updatedContent[pieceIndex] = {
              ...updatedContent[pieceIndex],
              content: newContent,
            }
          }
          return { ...item, content: updatedContent, updated_at: new Date().toISOString() }
        }
        return item
      }),
    }))
  }

  const handleModelUpdate = (contentId: string, pieceIndex: number, newModel: string) => {
    setContentData((prev) => ({
      ...prev,
      all: prev.all.map((item) => {
        if (item.id === contentId && Array.isArray(item.content)) {
          const updatedContent = [...item.content]
          if (updatedContent[pieceIndex]) {
            updatedContent[pieceIndex] = {
              ...updatedContent[pieceIndex],
              generated_by: newModel,
            }
          }
          return { ...item, content: updatedContent, generated_by: newModel, updated_at: new Date().toISOString() }
        }
        return item
      }),
      // Also update suites and individual arrays
      suites: prev.suites.map((suite) => ({
        ...suite,
        content: suite.content.map((subcat: any) => ({
          ...subcat,
          content: subcat.content.map((item: any) => {
            if (item.id === contentId && Array.isArray(item.content)) {
              const updatedContent = [...item.content]
              if (updatedContent[pieceIndex]) {
                updatedContent[pieceIndex] = {
                  ...updatedContent[pieceIndex],
                  generated_by: newModel,
                }
              }
              return { ...item, content: updatedContent, generated_by: newModel, updated_at: new Date().toISOString() }
            }
            return item
          }),
        })),
      })),
      individual: prev.individual.map((item) => {
        if (item.id === contentId && Array.isArray(item.content)) {
          const updatedContent = [...item.content]
          if (updatedContent[pieceIndex]) {
            updatedContent[pieceIndex] = {
              ...updatedContent[pieceIndex],
              generated_by: newModel,
            }
          }
          return { ...item, content: updatedContent, generated_by: newModel, updated_at: new Date().toISOString() }
        }
        return item
      }),
    }))
  }

  const handleOpenIndividualWizard = (contentType: string) => {
    setSelectedContentType(contentType)
    setIndividualWizardOpen(true)
  }

  const handleIndividualSuccess = () => {
    loadContent(0, false)
  }

  const handleStatusUpdate = (contentId: string, newStatus: string) => {
    setContentData((prev) => ({
      ...prev,
      all: prev.all.map((item) => {
        if (item.id === contentId) {
          return { ...item, status: newStatus, updated_at: new Date().toISOString() }
        }
        return item
      }),
      // Also update suites and individual arrays
      suites: prev.suites.map((suite) => ({
        ...suite,
        content: suite.content.map((subcat: any) => ({
          ...subcat,
          content: subcat.content.map((item: any) => {
            if (item.id === contentId) {
              return { ...item, status: newStatus, updated_at: new Date().toISOString() }
            }
            return item
          }),
        })),
      })),
      individual: prev.individual.map((item) => {
        if (item.id === contentId) {
          return { ...item, status: newStatus, updated_at: new Date().toISOString() }
        }
        return item
      }),
    }))
  }

  // Calculate stats for gamification
  const totalPieces = contentData.all.reduce(
    (sum, item) => sum + (Array.isArray(item.content) ? item.content.length : 1),
    0,
  )
  const milestone = getContentMilestone(totalPieces)
  const MilestoneIcon = milestone.icon

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MangoSpinner size="xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading your content orchard...</p>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Content</h3>
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
    <MobileMenuProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
          <DashboardSidebar />

          <div className="flex-1 w-full min-w-0 overflow-x-hidden">
            <MobileHeader />

            <div className="hidden lg:block">
              <GeneratedContentHeader
                contentTypesCount={new Set(contentData.all.map((item) => item.type)).size}
                totalPieces={totalPieces}
                allExpanded={false}
                onToggleAll={() => {}}
                onOpenIndividualWizard={handleOpenIndividualWizard}
              />
            </div>

            <ClientOnlyWrapper
              fallback={
                <div className="p-6 flex items-center justify-center w-full">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <MangoSpinner size="lg" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading content...</p>
                  </div>
                </div>
              }
            >
              <div className="p-3 sm:p-6 max-w-full overflow-x-hidden">
                {contentData.all.length === 0 ? (
                  <Card className="border-2 border-dashed border-orange-200 bg-orange-50/30">
                    <CardContent className="p-12 text-center">
                      <div className="p-6 bg-orange-100 rounded-full w-fit mx-auto mb-6">
                        <FileText className="h-16 w-16 text-orange-600" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Content Orchard Awaits</h3>
                      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Plant the seeds of great content! Start your first content suite and watch your library grow
                        like a flourishing mango tree.
                      </p>
                      <Link href="/onboarding">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                          <Sparkles className="h-5 w-5 mr-3" />
                          Plant Your First Content
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* MangoTree Achievement Bar */}
                    <Card className="border-l-4 border-orange-500 bg-white shadow-lg mb-6">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center space-x-4">
                            <div className={`p-4 ${milestone.bgColor} rounded-xl`}>
                              <MilestoneIcon className={`h-8 w-8 ${milestone.color}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{milestone.label}</h3>
                              <p className="text-gray-600">
                                {totalPieces} content pieces harvested •{" "}
                                {new Set(contentData.all.map((item) => item.type)).size} content types growing
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {Math.round((totalPieces / 1000) * 100)}%
                              </div>
                              <div className="text-xs text-gray-500">to Mango Master</div>
                            </div>
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((totalPieces / 1000) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Content Masonry */}
                    <ContentMasonry
                      contentData={contentData.all}
                      onContentUpdate={handleContentUpdate}
                      onModelUpdate={handleModelUpdate}
                      onStatusUpdate={handleStatusUpdate}
                      onOpenIndividualWizard={handleOpenIndividualWizard}
                    />

                    {/* Load More */}
                    {contentData.hasMore && (
                      <div className="flex justify-center py-12">
                        <Button
                          onClick={loadMore}
                          disabled={loadingMore || loadingRef.current}
                          variant="outline"
                          size="lg"
                          className="border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-4 text-base font-semibold transition-all duration-200 hover:scale-105"
                        >
                          {loadingMore ? (
                            <div className="flex items-center">
                              <MangoSpinner size="sm" className="mr-3" />
                              <span>Growing More Content...</span>
                            </div>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5 mr-3" />
                              Harvest More Content
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ClientOnlyWrapper>
          </div>

          {/* Edit Dialog */}
          {editingContent && (
            <EditContentDialog
              open={!!editingContent}
              onOpenChange={(open) => !open && setEditingContent(null)}
              content={editingContent}
              onUpdate={() => loadContent(0, false)}
            />
          )}

          {/* Individual Content Wizard */}
          <IndividualContentWizard
            open={individualWizardOpen}
            onOpenChange={setIndividualWizardOpen}
            contentType={selectedContentType}
            onSuccess={handleIndividualSuccess}
          />
        </div>
      </TooltipProvider>
    </MobileMenuProvider>
  )
}
