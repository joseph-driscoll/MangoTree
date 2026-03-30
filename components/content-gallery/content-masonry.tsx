"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search,
  Grid3X3,
  List,
  Copy,
  Check,
  Globe,
  Mail,
  Share2,
  MessageCircle,
  MapPin,
  Star,
  BookOpen,
  Edit3,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { availableModels, type ModelConfig } from "@/lib/ai-service"
import { ContentTrailStorage } from "@/lib/content-trail-storage"
import { ContentTrailViewer } from "../results/content-trail-viewer"
import { MangoSpinner } from "@/components/ui/mango-spinner"

interface ContentPiece {
  id: string
  label: string
  content: string
  type: string
  category: string
  subcategory: string
  created_at: string
  suite_name?: string
  tone?: string
  audience?: string
  voice?: string
  generated_by?: string
  originalPrompt?: string
  pieceIndex?: number
  parentId?: string
  _updateKey?: string
}

interface ContentMasonryProps {
  contentData: any[]
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  onOpenIndividualWizard: (contentType: string) => void
}

const categoryIcons = {
  website: Globe,
  email: Mail,
  social: Share2,
  messages: MessageCircle,
  listings: MapPin,
  reviews: Star,
  blog: BookOpen,
}

const categoryColors = {
  website: "bg-blue-500",
  email: "bg-green-500",
  social: "bg-purple-500",
  messages: "bg-orange-500",
  listings: "bg-red-500",
  reviews: "bg-yellow-500",
  blog: "bg-indigo-500",
}

const contentTypeConfig = {
  website: { label: "Website Content", color: "blue" },
  email: { label: "Email Marketing", color: "green" },
  social: { label: "Social Media", color: "purple" },
  messages: { label: "Customer Messages", color: "orange" },
  listings: { label: "Product Listings", color: "red" },
  reviews: { label: "Review Responses", color: "yellow" },
  blog: { label: "Blog Content", color: "indigo" },
}

export function ContentMasonry({
  contentData,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  onOpenIndividualWizard,
}: ContentMasonryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "type" | "category">("newest")
  const [expandedPiece, setExpandedPiece] = useState<ContentPiece | null>(null)

  // Each DB row is already a single content piece
  const allContentPieces = useMemo(() => {
    return contentData.map((item) => ({
      id: item.id,
      parentId: item.id,
      pieceIndex: 0,
      label: item.title || item.subcategory || "Content",
      content: item.content,
      type: item.subcategory || "general",
      category: item.content_type || item.type || "website",
      subcategory: item.subcategory || "general",
      created_at: item.created_at,
      suite_name: item.suite_name,
      tone: item.tone,
      audience: item.audience,
      voice: item.voice,
      generated_by: item.generated_by,
      originalPrompt: item.prompt,
      _updateKey: `${item.content}-${item.generated_by}-${item.updated_at || item.created_at}`,
    }))
  }, [contentData])

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = allContentPieces

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (piece) =>
          piece.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          piece.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          piece.suite_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((piece) => piece.category === selectedCategory)
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((piece) => piece.type === selectedType)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "type":
          return a.type.localeCompare(b.type)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  }, [allContentPieces, searchQuery, selectedCategory, selectedType, sortBy])

  // Get unique categories and types for filters
  const categories = useMemo(() => {
    const cats = [...new Set(allContentPieces.map((p) => p.category))]
    return cats.map((cat) => ({
      value: cat,
      label:
        contentTypeConfig[cat as keyof typeof contentTypeConfig]?.label || cat.charAt(0).toUpperCase() + cat.slice(1),
    }))
  }, [allContentPieces])

  const types = useMemo(() => {
    const typeSet = [...new Set(allContentPieces.map((p) => p.type))]
    return typeSet.map((type) => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
  }, [allContentPieces])

  const updateExpandedPiece = (updatedPiece: ContentPiece) => {
    if (expandedPiece && expandedPiece.id === updatedPiece.id) {
      setExpandedPiece(updatedPiece)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Control Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your content orchard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-orange-400 rounded-xl"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-orange-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-orange-400 focus:outline-none"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:border-orange-400 focus:outline-none text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="type">By Type</option>
                <option value="category">By Category</option>
              </select>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <Button
                  variant={viewMode === "masonry" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className={`h-8 px-3 rounded-lg ${viewMode === "masonry" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 px-3 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats and Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              Showing {filteredContent.length} of {allContentPieces.length} content pieces
            </span>
          </div>
        </div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          {viewMode === "masonry" ? (
            <motion.div
              key="masonry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Group content by suite */}
              {(() => {
                // Group content by suite
                const suiteGroups = new Map<string, ContentPiece[]>()
                const individualPieces: ContentPiece[] = []

                filteredContent.forEach((piece) => {
                  if (piece.suite_name && piece.suite_name !== "Individual") {
                    const key = `${piece.parentId}-${piece.suite_name}`
                    if (!suiteGroups.has(key)) {
                      suiteGroups.set(key, [])
                    }
                    suiteGroups.get(key)!.push(piece)
                  } else {
                    individualPieces.push(piece)
                  }
                })

                return (
                  <>
                    {/* Suite Groups */}
                    {Array.from(suiteGroups.entries()).map(([suiteKey, pieces], groupIndex) => (
                      <SuiteGroup
                        key={suiteKey}
                        suiteName={pieces[0].suite_name!}
                        pieces={pieces}
                        groupIndex={groupIndex}
                        onContentUpdate={onContentUpdate}
                        onModelUpdate={onModelUpdate}
                        onStatusUpdate={onStatusUpdate}
                        setExpandedPiece={setExpandedPiece}
                      />
                    ))}

                    {/* Individual Content */}
                    {individualPieces.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-px bg-gray-200 flex-1" />
                          <h3 className="text-lg font-semibold text-gray-700 px-4">Individual Content</h3>
                          <div className="h-px bg-gray-200 flex-1" />
                        </div>
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                          {individualPieces.map((piece, index) => (
                            <motion.div
                              key={piece.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className="break-inside-avoid mb-6"
                            >
                              <ContentCard
                                piece={piece}
                                onContentUpdate={onContentUpdate}
                                onModelUpdate={onModelUpdate}
                                onStatusUpdate={onStatusUpdate}
                                setExpandedPiece={setExpandedPiece}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredContent.map((piece, index) => (
                <motion.div
                  key={piece.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <ContentListItem
                    piece={piece}
                    onContentUpdate={onContentUpdate}
                    onModelUpdate={onModelUpdate}
                    onStatusUpdate={onStatusUpdate}
                    setExpandedPiece={setExpandedPiece}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredContent.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="p-6 bg-orange-50 rounded-full w-fit mx-auto mb-4">
              <Search className="h-12 w-12 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </motion.div>
        )}

        {/* Expanded Content Overlay */}
        <AnimatePresence>
          {expandedPiece && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={() => setExpandedPiece(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ExpandedContentCard
                  piece={expandedPiece}
                  onClose={() => setExpandedPiece(null)}
                  onContentUpdate={onContentUpdate}
                  onModelUpdate={onModelUpdate}
                  onStatusUpdate={onStatusUpdate}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

// Individual content card for masonry view with full functionality
export function ContentCard({
  piece,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  setExpandedPiece,
}: {
  piece: ContentPiece
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  setExpandedPiece?: (piece: ContentPiece) => void
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(isCopied)
  const [currentGeneratedBy, setCurrentGeneratedBy] = useState(piece.generated_by)

  // Add this useEffect in ContentCard component after the existing state declarations
  useEffect(() => {
    setCurrentGeneratedBy(piece.generated_by)
  }, [piece.generated_by])

  // Also update the piece content when it changes
  useEffect(() => {
    // Update the piece object when content or model changes
    if (piece.content !== piece.content || piece.generated_by !== currentGeneratedBy) {
      // This will trigger re-renders when the parent data changes
    }
  }, [piece.content, piece.generated_by, currentGeneratedBy])

  const CategoryIcon = categoryIcons[piece.category as keyof typeof categoryIcons]

  // Trail summary for status indicators
  const [trailSummary, setTrailSummary] = useState(() =>
    ContentTrailStorage.getTrailSummary(piece.parentId || "", piece.pieceIndex),
  )

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card expansion
    try {
      await navigator.clipboard.writeText(piece.content)
      setIsCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleQuickRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card expansion

    if (!piece.id) {
      toast.error("Cannot regenerate content without ID")
      return
    }

    setIsRegenerating(true)

    try {
      const requestBody: Record<string, unknown> = {
        contentId: piece.id,
        type: piece.category,
        prompt: piece.originalPrompt || piece.content,
        subcategory: piece.subcategory,
        tone: piece.tone,
        audience: piece.audience,
        voice: piece.voice,
        selectedModel: availableModels[0],
      }

      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = JSON.parse(raw)
      } catch {
        /* non-JSON */
      }

      if (!response.ok || !result?.success) {
        const message = result?.error || `Server responded with ${response.status}`
        throw new Error(message)
      }

      let newContent = null
      if (result.newPieces?.length > 0) {
        newContent = result.newPieces[0].content
      }

      if (newContent) {
        setCurrentGeneratedBy(result.newModel || availableModels[0].label)
        onContentUpdate(piece.id, 0, newContent)
        onModelUpdate(piece.id, 0, result.newModel || availableModels[0].label)
        onStatusUpdate(piece.id, 0, true, false)
        toast.success(`Content regenerated with ${result.newModel || availableModels[0].label}!`)
      } else {
        throw new Error("No new content in response")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate content")
    } finally {
      setIsRegenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderContent = () => {
    if (piece.type === "headline" || piece.type === "title") {
      return <h4 className="font-bold text-lg text-gray-900 leading-tight">{piece.content}</h4>
    } else if (piece.type === "subject") {
      return <p className="font-semibold text-gray-900">{piece.content}</p>
    } else if (piece.type === "bullets") {
      return (
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg font-mono whitespace-pre-line">
          {piece.content}
        </div>
      )
    } else if (piece.type === "hashtags") {
      return <p className="text-blue-600 font-medium">{piece.content}</p>
    } else {
      return <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{piece.content}</p>
    }
  }

  // Update the model display to prioritize piece-specific model
  const displayModel = piece.generated_by || currentGeneratedBy

  const getStatusIndicators = () => {
    const arr = []
    if (trailSummary.hasRegenerations) arr.push("Regenerated")
    if (trailSummary.hasEdits) arr.push("Edited")
    if (trailSummary.actionCount > 1) arr.push(`${trailSummary.actionCount} changes`)
    return arr
  }
  const statusIndicators = getStatusIndicators()

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white overflow-hidden cursor-pointer"
      onClick={() => setExpandedPiece && setExpandedPiece(piece)}
    >
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={`p-1.5 rounded-lg ${categoryColors[piece.category as keyof typeof categoryColors]} bg-opacity-10`}
            >
              <CategoryIcon
                className={`h-4 w-4 text-${contentTypeConfig[piece.category as keyof typeof contentTypeConfig]?.color || "gray"}-600`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{piece.label}</h3>
              <p className="text-xs text-gray-500">{piece.suite_name || "Individual"}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Quick regenerate */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleQuickRegenerate}
                  disabled={isRegenerating}
                  className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                >
                  {isRegenerating ? <MangoSpinner className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick regenerate</p>
              </TooltipContent>
            </Tooltip>

            {/* Copy */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                >
                  {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy content</p>
              </TooltipContent>
            </Tooltip>

            {/* Trail viewer */}
            {piece.parentId && (
              <div onClick={(e) => e.stopPropagation()}>
                <ContentTrailViewer contentId={piece.parentId} pieceIndex={piece.pieceIndex} label={piece.label} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
            {piece.type}
          </Badge>
          <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
            {piece.subcategory}
          </Badge>
          <span className="text-xs text-gray-400 ml-auto">{formatDate(piece.created_at)}</span>
        </div>

        {/* Status indicators */}
        {statusIndicators.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
              {statusIndicators.join(" • ")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {renderContent()}

          {displayModel && (
            <div className="pt-2 border-t border-gray-50">
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{displayModel}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// List item for list view with full functionality
function ContentListItem({
  piece,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  setExpandedPiece,
}: {
  piece: ContentPiece
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  setExpandedPiece?: (piece: ContentPiece) => void
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [currentGeneratedBy, setCurrentGeneratedBy] = useState(piece.generated_by)

  // Add this useEffect in ContentListItem component after the existing state declarations
  useEffect(() => {
    setCurrentGeneratedBy(piece.generated_by)
  }, [piece.generated_by])

  const CategoryIcon = categoryIcons[piece.category as keyof typeof categoryIcons]

  // Trail summary for status indicators
  const [trailSummary, setTrailSummary] = useState(() =>
    ContentTrailStorage.getTrailSummary(piece.parentId || "", piece.pieceIndex),
  )

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card expansion
    try {
      await navigator.clipboard.writeText(piece.content)
      setIsCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleQuickRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card expansion

    if (!piece.id) {
      toast.error("Cannot regenerate content without ID")
      return
    }

    setIsRegenerating(true)

    try {
      const requestBody: Record<string, unknown> = {
        contentId: piece.id,
        type: piece.category,
        prompt: piece.originalPrompt || piece.content,
        subcategory: piece.subcategory,
        tone: piece.tone,
        audience: piece.audience,
        voice: piece.voice,
        selectedModel: availableModels[0],
      }

      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = JSON.parse(raw)
      } catch {
        /* non-JSON */
      }

      if (!response.ok || !result?.success) {
        const message = result?.error || `Server responded with ${response.status}`
        throw new Error(message)
      }

      let newContent = null
      if (result.newPieces?.length > 0) {
        newContent = result.newPieces[0].content
      }

      if (newContent) {
        setCurrentGeneratedBy(result.newModel || availableModels[0].label)
        onContentUpdate(piece.id, 0, newContent)
        onModelUpdate(piece.id, 0, result.newModel || availableModels[0].label)
        onStatusUpdate(piece.id, 0, true, false)
        toast.success(`Content regenerated with ${result.newModel || availableModels[0].label}!`)
      } else {
        throw new Error("No new content in response")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate content")
    } finally {
      setIsRegenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderContent = () => {
    if (piece.type === "headline" || piece.type === "title") {
      return <h4 className="font-bold text-base text-gray-900">{piece.content}</h4>
    } else if (piece.type === "bullets") {
      return <div className="bg-gray-50 p-3 rounded-lg font-mono whitespace-pre-line text-xs">{piece.content}</div>
    } else {
      return <p className="line-clamp-3 text-sm text-gray-700 leading-relaxed">{piece.content}</p>
    }
  }

  const getStatusIndicators = () => {
    const arr = []
    if (trailSummary.hasRegenerations) arr.push("Regenerated")
    if (trailSummary.hasEdits) arr.push("Edited")
    if (trailSummary.actionCount > 1) arr.push(`${trailSummary.actionCount} changes`)
    return arr
  }
  const statusIndicators = getStatusIndicators()

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white cursor-pointer"
      onClick={() => setExpandedPiece && setExpandedPiece(piece)}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-2 rounded-xl ${categoryColors[piece.category as keyof typeof categoryColors]} bg-opacity-10 flex-shrink-0`}
          >
            <CategoryIcon
              className={`h-5 w-5 text-${contentTypeConfig[piece.category as keyof typeof contentTypeConfig]?.color || "gray"}-600`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{piece.label}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                    {piece.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                    {piece.subcategory}
                  </Badge>
                  <span className="text-xs text-gray-500">{piece.suite_name || "Individual"}</span>
                  <span className="text-xs text-gray-400">• {formatDate(piece.created_at)}</span>
                </div>
                {statusIndicators.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                      {statusIndicators.join(" • ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Quick regenerate */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuickRegenerate}
                      disabled={isRegenerating}
                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                    >
                      {isRegenerating ? <MangoSpinner className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quick regenerate</p>
                  </TooltipContent>
                </Tooltip>

                {/* Copy */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy content</p>
                  </TooltipContent>
                </Tooltip>

                {/* Trail viewer */}
                {piece.parentId && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ContentTrailViewer contentId={piece.parentId} pieceIndex={piece.pieceIndex} label={piece.label} />
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-700 text-sm leading-relaxed">{renderContent()}</div>

            {currentGeneratedBy && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{currentGeneratedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Expanded Content Card Component - Full screen overlay with mobile responsiveness
export function ExpandedContentCard({
  piece,
  onClose,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
}: {
  piece: ContentPiece
  onClose: () => void
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(piece.content)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [newPrompt, setNewPrompt] = useState(piece.originalPrompt || "")
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(availableModels[0])
  const [currentGeneratedBy, setCurrentGeneratedBy] = useState(piece.generated_by)

  const CategoryIcon = categoryIcons[piece.category as keyof typeof categoryIcons]

  // Trail summary for status indicators
  const [trailSummary, setTrailSummary] = useState(() =>
    ContentTrailStorage.getTrailSummary(piece.parentId || "", piece.pieceIndex),
  )

  // Update the existing useEffect in ExpandedContentCard to:
  useEffect(() => {
    setEditedContent(piece.content)
    setCurrentGeneratedBy(piece.generated_by)
    // Update the piece reference to trigger parent updates
  }, [piece.content, piece.generated_by, piece])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
      setIsCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleSave = async () => {
    if (!piece.parentId || typeof piece.pieceIndex !== "number") {
      setIsEditing(false)
      onContentUpdate(piece.parentId || "", piece.pieceIndex || 0, editedContent)
      toast.success("Content updated!")
      return
    }

    if (editedContent === piece.content) {
      setIsEditing(false)
      return
    }

    try {
      const response = await fetch(`/api/content/${piece.parentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceIndex: piece.pieceIndex,
          content: editedContent,
        }),
      })

      if (!response.ok) throw new Error(`Save failed: ${response.status}`)

      const result = await response.json()

      if (result.success) {
        ContentTrailStorage.addTrailItem(piece.parentId, piece.pieceIndex, "edited", {
          previousContent: piece.content,
          newContent: editedContent,
        })
        setTrailSummary(ContentTrailStorage.getTrailSummary(piece.parentId, piece.pieceIndex))
        setIsEditing(false)
        toast.success("Content saved!")
        onContentUpdate(piece.parentId, piece.pieceIndex, editedContent)
        onStatusUpdate(piece.parentId, piece.pieceIndex, trailSummary.hasRegenerations, true)
      } else {
        toast.error("Failed to save content")
      }
    } catch (error) {
      toast.error("Failed to save content")
    }
  }

  const handleRegenerate = async (customPrompt?: string) => {
    if (!piece.parentId || typeof piece.pieceIndex !== "number") {
      toast.error("Cannot regenerate content without ID")
      return
    }

    setIsRegenerating(true)
    setShowRegenerateDialog(false)

    try {
      const requestBody: Record<string, unknown> = {
        contentId: piece.parentId,
        type: piece.category,
        prompt: piece.originalPrompt || "Regenerate content",
        pieceIndex: piece.pieceIndex,
        selectedModel,
      }
      if (customPrompt) requestBody.newPrompt = customPrompt
      if (piece.subcategory) requestBody.subcategory = piece.subcategory
      if (piece.tone) requestBody.tone = piece.tone
      if (piece.audience) requestBody.audience = piece.audience
      if (piece.voice) requestBody.voice = piece.voice

      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = JSON.parse(raw)
      } catch {
        /* non-JSON */
      }

      if (!response.ok || !result?.success) {
        const message = result?.error || `Server responded with ${response.status}`
        throw new Error(message)
      }

      let newContent = null
      if (result.updatedPieces && typeof piece.pieceIndex === "number") {
        const updatedPiece = result.updatedPieces[piece.pieceIndex]
        if (updatedPiece?.content) newContent = updatedPiece.content
      } else if (result.newPieces && typeof piece.pieceIndex === "number") {
        const newPiece = result.newPieces[piece.pieceIndex]
        if (newPiece?.content) newContent = newPiece.content
      } else if (result.newPieces?.length) {
        const newPiece = result.newPieces[0]
        if (newPiece?.content) newContent = newPiece.content
      }

      if (newContent) {
        ContentTrailStorage.addTrailItem(piece.parentId, piece.pieceIndex, "regenerated", {
          model: selectedModel.label,
          previousContent: editedContent,
        })
        setTrailSummary(ContentTrailStorage.getTrailSummary(piece.parentId, piece.pieceIndex))
        setEditedContent(newContent)
        onContentUpdate(piece.parentId, piece.pieceIndex, newContent)

        // Update the model name - ONLY for this specific piece
        const newModelName = result.newModel || result.updatedModel || selectedModel.label
        setCurrentGeneratedBy(newModelName)
        // Only call onModelUpdate for THIS piece, not affecting others
        onModelUpdate(piece.parentId, piece.pieceIndex, newModelName)

        onStatusUpdate(piece.parentId, piece.pieceIndex, true, trailSummary.hasEdits)
        toast.success(`Content regenerated with ${selectedModel.label}!`)
      } else {
        throw new Error("No new content in response")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate content")
    } finally {
      setIsRegenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderContent = () => {
    const isErrorContent = editedContent?.includes?.("Error:") || editedContent?.includes?.("Unable to generate")

    if (isErrorContent) {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <p className="text-red-700 text-sm sm:text-base font-medium mb-4">{editedContent}</p>
            <Button
              onClick={() => handleRegenerate()}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Regenerating
            </Button>
          </div>
        </div>
      )
    }

    if (isEditing) {
      if (piece.type === "headline" || piece.type === "subject" || piece.type === "title") {
        return (
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="text-lg sm:text-xl border-2 border-gray-200 focus:border-orange-400 rounded-xl bg-white font-bold"
          />
        )
      } else {
        return (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[150px] sm:min-h-[200px] text-base sm:text-lg border-2 border-gray-200 focus:border-orange-400 rounded-xl bg-white resize-none leading-relaxed"
          />
        )
      }
    }

    if (piece.type === "headline" || piece.type === "title") {
      return <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 leading-tight">{editedContent}</h1>
    } else if (piece.type === "subject") {
      return <h2 className="font-semibold text-xl sm:text-2xl text-gray-900">{editedContent}</h2>
    } else if (piece.type === "bullets") {
      return (
        <div className="text-base sm:text-lg text-gray-700 bg-gray-50 p-4 sm:p-6 rounded-xl font-mono whitespace-pre-line leading-relaxed">
          {editedContent}
        </div>
      )
    } else if (piece.type === "hashtags") {
      return <p className="text-blue-600 font-medium text-lg sm:text-xl">{editedContent}</p>
    } else {
      return <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{editedContent}</p>
    }
  }

  const getStatusIndicators = () => {
    const arr = []
    if (trailSummary.hasRegenerations) arr.push("Regenerated")
    if (trailSummary.hasEdits) arr.push("Edited")
    if (trailSummary.actionCount > 1) arr.push(`${trailSummary.actionCount} changes`)
    return arr
  }
  const statusIndicators = getStatusIndicators()

  return (
    <>
      <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[90vh]">
        {/* Header - Mobile Responsive */}
        <div className="p-4 sm:p-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div
                className={`p-2 sm:p-3 rounded-xl ${categoryColors[piece.category as keyof typeof categoryColors]} bg-opacity-10`}
              >
                <CategoryIcon
                  className={`h-6 w-6 sm:h-8 sm:w-8 text-${contentTypeConfig[piece.category as keyof typeof contentTypeConfig]?.color || "gray"}-600`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-1 sm:mb-2 truncate">{piece.label}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{piece.suite_name || "Individual"}</p>
              </div>
            </div>

            {/* Action buttons - Mobile responsive grid */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              {/* Quick regenerate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRegenerate()}
                    disabled={isRegenerating}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 hover:bg-green-50 hover:text-green-600"
                  >
                    {isRegenerating ? (
                      <MangoSpinner className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick regenerate</p>
                </TooltipContent>
              </Tooltip>

              {/* Custom regenerate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRegenerateDialog(true)}
                    disabled={isRegenerating}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Custom regenerate</p>
                </TooltipContent>
              </Tooltip>

              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 hover:bg-green-50 hover:text-green-600"
                  >
                    {isCopied ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Copy className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy content</p>
                </TooltipContent>
              </Tooltip>

              {/* Edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Edit3 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit content</p>
                </TooltipContent>
              </Tooltip>

              {/* Trail viewer */}
              {piece.parentId && (
                <ContentTrailViewer contentId={piece.parentId} pieceIndex={piece.pieceIndex} label={piece.label} />
              )}

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 sm:h-12 sm:w-12 p-0 hover:bg-gray-100"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs sm:text-sm bg-gray-50 border-gray-200 px-2 sm:px-3 py-1">
              {piece.type}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs sm:text-sm bg-orange-50 border-orange-200 text-orange-700 px-2 sm:px-3 py-1"
            >
              {piece.subcategory}
            </Badge>
            <span className="text-xs sm:text-sm text-gray-400">{formatDate(piece.created_at)}</span>
          </div>

          {statusIndicators.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-orange-600 font-medium bg-orange-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                {statusIndicators.join(" • ")}
              </span>
            </div>
          )}
        </div>

        {/* Content - Mobile responsive */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            {renderContent()}

            {isEditing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-100">
                <Button
                  size="lg"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 sm:px-8 py-3 font-medium text-base sm:text-lg w-full sm:w-auto"
                >
                  Save Changes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedContent(piece.content)
                  }}
                  className="border-gray-300 hover:bg-gray-50 rounded-xl px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            )}

            {currentGeneratedBy && (
              <div className="pt-4 sm:pt-6 border-t border-gray-100">
                <span className="text-xs sm:text-sm text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                  {currentGeneratedBy}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Regenerate Dialog - Mobile responsive */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">Regenerate Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">
                Custom Prompt (optional)
              </Label>
              <Textarea
                id="prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Enter a custom prompt to guide the regeneration..."
                className="mt-2 border-2 border-gray-200 focus:border-orange-400 rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                AI Model
              </Label>
              <select
                id="model"
                value={selectedModel.label}
                onChange={(e) => {
                  const sel = availableModels.find((m) => m.label === e.target.value)
                  if (sel) setSelectedModel(sel)
                }}
                className="w-full p-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl mt-2 bg-white text-sm sm:text-base"
              >
                {availableModels.map((model) => (
                  <option key={model.label} value={model.label}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-orange-50 p-3 sm:p-4 rounded-xl border border-orange-200">
              <p className="text-xs sm:text-sm text-orange-700">
                <strong>Note:</strong> This will only update the model for this specific content piece.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => handleRegenerate(newPrompt)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 sm:px-6 py-2 font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate with {selectedModel.label}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRegenerateDialog(false)}
                className="border-gray-300 hover:bg-gray-50 rounded-xl px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Suite Group Component - keeps related content together
function SuiteGroup({
  suiteName,
  pieces,
  groupIndex,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  setExpandedPiece,
}: {
  suiteName: string
  pieces: ContentPiece[]
  groupIndex: number
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  setExpandedPiece?: (piece: ContentPiece) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Get suite stats and content types
  const categoryCount = new Set(pieces.map((p) => p.category)).size
  const totalPieces = pieces.length
  const createdDate = pieces[0]?.created_at

  // Use subcategory as the main title (like "Hero", "Features", etc.)
  const subcategory = pieces[0]?.subcategory || "Content"
  const displayTitle = subcategory.charAt(0).toUpperCase() + subcategory.slice(1)

  // Get unique content types within this suite
  const contentTypes = [...new Set(pieces.map((p) => p.type))]
    .sort()
    .map((type) => type.charAt(0).toUpperCase() + type.slice(1))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: groupIndex * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Suite Header */}
      <div
        className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Sparkles className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{displayTitle}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {contentTypes.slice(0, 4).map((type, index) => (
                  <Badge key={type} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                    {type}
                  </Badge>
                ))}
                {contentTypes.length > 4 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                    +{contentTypes.length - 4} more
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {totalPieces} pieces • {categoryCount} categories • Created {formatDate(createdDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              Suite
            </Badge>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Suite Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50/30">
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {pieces.map((piece, index) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="break-inside-avoid mb-6"
                  >
                    <ContentCard
                      piece={piece}
                      onContentUpdate={onContentUpdate}
                      onModelUpdate={onModelUpdate}
                      onStatusUpdate={onStatusUpdate}
                      setExpandedPiece={setExpandedPiece}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
