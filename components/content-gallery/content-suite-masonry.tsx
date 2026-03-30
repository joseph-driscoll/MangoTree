"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Search,
  Grid3X3,
  List,
  Globe,
  Mail,
  Share2,
  MessageCircle,
  MapPin,
  Star,
  BookOpen,
  Sparkles,
  Calendar,
  Layers,
  Users,
  Trash2,
} from "lucide-react"
import { ContentCard } from "./content-masonry"

interface ContentPiece {
  id: string
  label: string
  content: string
  type: string
  category: string
  subcategory: string
  created_at: string
  suite_name?: string
  suite_id?: string
  tone?: string
  audience?: string
  voice?: string
  generated_by?: string
  originalPrompt?: string
  pieceIndex?: number
  parentId?: string
}

interface ContentSuiteMasonryProps {
  contentData: any[]
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  onOpenIndividualWizard: (contentType: string) => void
  onCreateSuite: () => void
  onDeleteSuite?: (suiteId: string) => void
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

export function ContentSuiteMasonry({
  contentData,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  onOpenIndividualWizard,
  onCreateSuite,
  onDeleteSuite,
}: ContentSuiteMasonryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest")
  const [expandedPiece, setExpandedPiece] = useState<ContentPiece | null>(null)

  // Group content by suites - each row in DB is already a single piece
  const suiteGroups = useMemo(() => {
    const groups = new Map<string, any>()

    contentData.forEach((item) => {
      if (item.suite_id && item.suite_name && item.suite_name !== "Individual") {
        const suiteKey = item.suite_id

        if (!groups.has(suiteKey)) {
          groups.set(suiteKey, {
            suite_id: item.suite_id,
            suite_name: item.suite_name,
            subcategory: item.subcategory || "general",
            created_at: item.created_at,
            pieces: [],
            categories: new Set(),
            types: new Set(),
          })
        }

        const suite = groups.get(suiteKey)!

        // Each DB row is already a single content piece
        const contentPiece = {
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
          suite_id: item.suite_id,
          tone: item.tone,
          audience: item.audience,
          voice: item.voice,
          generated_by: item.generated_by,
          originalPrompt: item.prompt,
        }

        suite.pieces.push(contentPiece)
        suite.categories.add(contentPiece.category)
        suite.types.add(contentPiece.type)
      }
    })

    return Array.from(groups.values())
  }, [contentData])

  // Filter and sort suites
  const filteredSuites = useMemo(() => {
    let filtered = suiteGroups

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (suite) =>
          suite.suite_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suite.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suite.pieces.some(
            (piece: any) =>
              piece.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              piece.label.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((suite) => suite.categories.has(selectedCategory))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "name":
          return a.suite_name.localeCompare(b.suite_name)
        case "size":
          return b.pieces.length - a.pieces.length
        default:
          return 0
      }
    })

    return filtered
  }, [suiteGroups, searchQuery, selectedCategory, sortBy])

  // Get unique categories for filters
  const categories = useMemo(() => {
    const cats = new Set<string>()
    suiteGroups.forEach((suite) => {
      suite.categories.forEach((cat: string) => cats.add(cat))
    })
    return Array.from(cats).map((cat) => ({
      value: cat,
      label:
        contentTypeConfig[cat as keyof typeof contentTypeConfig]?.label || cat.charAt(0).toUpperCase() + cat.slice(1),
    }))
  }, [suiteGroups])

  const totalPieces = suiteGroups.reduce((sum, suite) => sum + suite.pieces.length, 0)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Control Bar - Mobile Responsive */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search suites and content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-orange-400 rounded-xl"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-orange-400 focus:outline-none text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:border-orange-400 focus:outline-none text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="size">By Size</option>
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

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <span className="text-sm text-gray-600">
                  {filteredSuites.length} suites • {totalPieces} total pieces
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">{suiteGroups.length} total suites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{categories.length} categories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suites Display */}
        <AnimatePresence mode="wait">
          {viewMode === "masonry" ? (
            <motion.div
              key="masonry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 sm:space-y-8"
            >
              {filteredSuites.map((suite, index) => (
                <SuiteCard
                  key={suite.suite_id}
                  suite={suite}
                  index={index}
                  onContentUpdate={onContentUpdate}
                  onModelUpdate={onModelUpdate}
                  onStatusUpdate={onStatusUpdate}
                  setExpandedPiece={setExpandedPiece}
                  onDeleteSuite={onDeleteSuite}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredSuites.map((suite, index) => (
                <SuiteListItem
                  key={suite.suite_id}
                  suite={suite}
                  index={index}
                  onContentUpdate={onContentUpdate}
                  onModelUpdate={onModelUpdate}
                  onStatusUpdate={onStatusUpdate}
                  setExpandedPiece={setExpandedPiece}
                  onDeleteSuite={onDeleteSuite}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredSuites.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto">
              <div className="p-6 sm:p-8 bg-orange-100 rounded-full w-fit mx-auto mb-6">
                <Layers className="h-12 w-12 sm:h-16 sm:w-16 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No content suites yet</h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                Create your first content suite to organize and manage your marketing content in one place.
              </p>
              <Button
                onClick={onCreateSuite}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create Content Suite
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Generate website copy, social posts, emails and more in minutes
              </p>
            </div>
          </motion.div>
        )}

        {/* Expanded Content Overlay - Mobile Responsive */}
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

// Suite Card Component for masonry view - Mobile Responsive
function SuiteCard({
  suite,
  index,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  setExpandedPiece,
  onDeleteSuite,
}: {
  suite: any
  index: number
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  setExpandedPiece: (piece: ContentPiece) => void
  onDeleteSuite?: (suiteId: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const displayTitle = suite.suite_name || "Content Suite"
  const subcategoryLabel = suite.subcategory.charAt(0).toUpperCase() + suite.subcategory.slice(1)
  const contentTypes = [...suite.types].sort().map((type: string) => type.charAt(0).toUpperCase() + type.slice(1))
  const categories = [...suite.categories]

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
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Suite Header - Mobile Responsive */}
      <div
        className="p-4 sm:p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-xl flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{displayTitle}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">Content Suite • {subcategoryLabel}</p>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {contentTypes.slice(0, 3).map((type: string) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-xs bg-blue-50 border-blue-200 text-blue-700 px-1 sm:px-2"
                  >
                    {type}
                  </Badge>
                ))}
                {contentTypes.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600 px-1 sm:px-2">
                    +{contentTypes.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{formatDate(suite.created_at)}</span>
                <span className="sm:hidden">
                  {new Date(suite.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {suite.pieces.length} pieces • {categories.length} categories
              </div>
            </div>
            {onDeleteSuite && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete "${displayTitle}"? This will remove all ${suite.pieces.length} content pieces.`)) {
                    onDeleteSuite(suite.suite_id)
                  }
                }}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="p-4 sm:p-6 bg-gray-50/50">
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                {suite.pieces.map((piece: ContentPiece, pieceIndex: number) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: pieceIndex * 0.05, duration: 0.3 }}
                    className="break-inside-avoid mb-4 sm:mb-6"
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

// Suite List Item for list view - Mobile Responsive
function SuiteListItem({
  suite,
  index,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  setExpandedPiece,
  onDeleteSuite,
}: {
  suite: any
  index: number
  onContentUpdate: (contentId: string, pieceIndex: number, newContent: string) => void
  onModelUpdate: (contentId: string, pieceIndex: number, newModel: string) => void
  onStatusUpdate: (contentId: string, pieceIndex: number, regenerated: boolean, edited: boolean) => void
  setExpandedPiece: (piece: ContentPiece) => void
  onDeleteSuite?: (suiteId: string) => void
}) {
  const displayTitle = suite.suite_name || "Content Suite"
  const subcategoryLabel = suite.subcategory.charAt(0).toUpperCase() + suite.subcategory.slice(1)
  const contentTypes = [...suite.types].sort().map((type: string) => type.charAt(0).toUpperCase() + type.slice(1))
  const categories = [...suite.categories]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-xl flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3">
                <div className="w-full sm:w-auto">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1">{displayTitle}</h3>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Content Suite • {subcategoryLabel}</p>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {contentTypes.slice(0, 4).map((type: string) => (
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
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(suite.created_at)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suite.pieces.length} pieces • {categories.length} categories
                    </div>
                  </div>
                  {onDeleteSuite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Delete "${suite.suite_name}"? This will remove all ${suite.pieces.length} content pieces.`)) {
                          onDeleteSuite(suite.suite_id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Preview of first few pieces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {suite.pieces.slice(0, 6).map((piece: ContentPiece) => (
                  <div
                    key={piece.id}
                    onClick={() => setExpandedPiece(piece)}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-xs text-gray-500 mb-1 truncate">{piece.label}</div>
                    <div className="text-sm text-gray-700 line-clamp-2">{piece.content}</div>
                  </div>
                ))}
                {suite.pieces.length > 6 && (
                  <div className="p-3 bg-orange-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-orange-600 font-medium">+{suite.pieces.length - 6} more</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Import the ExpandedContentCard from the main masonry component
import { ExpandedContentCard } from "./content-masonry"
