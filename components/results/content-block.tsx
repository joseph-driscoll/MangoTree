"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Copy, Edit3, Check, RotateCcw, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { availableModels, type ModelConfig, contentSubcategories } from "@/lib/ai-service"
import { ContentTrailStorage } from "@/lib/content-trail-storage"
import { ContentTrailViewer } from "./content-trail-viewer"
import { MangoSpinner } from "@/components/ui/mango-spinner"

interface ContentBlockProps {
  id?: string
  label: string
  content: string
  type: string
  subcategory?: string
  pieceIndex?: number
  originalPrompt?: string
  tone?: string
  audience?: string
  voice?: string
  generatedBy?: string
  pieceGeneratedBy?: string
  pieceRegenerated?: boolean
  pieceEdited?: boolean
  onContentUpdate?: (newContent: string) => void
  onModelUpdate?: (newModel: string) => void
  onStatusUpdate?: (regenerated: boolean, edited: boolean) => void
}

export function ContentBlock({
  id,
  label,
  content,
  type,
  subcategory,
  pieceIndex,
  originalPrompt,
  tone,
  audience,
  voice,
  onContentUpdate,
  onModelUpdate,
  onStatusUpdate,
  generatedBy,
  pieceGeneratedBy,
  pieceRegenerated = false,
  pieceEdited = false,
}: ContentBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [newPrompt, setNewPrompt] = useState(originalPrompt || "")
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(availableModels[0])
  const [currentModel, setCurrentModel] = useState(pieceGeneratedBy || generatedBy)

  // Update currentModel when props change
  useEffect(() => {
    setCurrentModel(pieceGeneratedBy || generatedBy)
  }, [pieceGeneratedBy, generatedBy])

  // Summary of edits/regenerations for little "Edited / Regenerated" ribbon
  const [trailSummary, setTrailSummary] = useState(() => ContentTrailStorage.getTrailSummary(id || "", pieceIndex))
  useEffect(() => {
    if (id) {
      setTrailSummary(ContentTrailStorage.getTrailSummary(id, pieceIndex))
    }
  }, [id, pieceIndex])

  /**  Infer the real category for the regenerate API **/
  const TYPE_TO_CATEGORY: Record<string, string> = {
    subject: "email",
    email: "email",
    headline: "website",
    subheadline: "website",
    paragraph: "website",
    button: "website",
    social: "social",
    hashtags: "social",
    message: "messages",
    title: "listings",
    description: "listings",
    response: "reviews",
    bullets: "blog",
  }
  const getRealCategory = (sub?: string): string => {
    if (sub) {
      for (const [cat, subs] of Object.entries(contentSubcategories)) {
        if (subs.some((s) => s.id === sub)) return cat
      }
    }
    return TYPE_TO_CATEGORY[type] || type
  }

  /* ------------------------------------------------------- */
  /* ---------------------- UI HELPERS ---------------------- */
  /* ------------------------------------------------------- */

  const getTypeConfig = (type: string) => {
    const configs = {
      headline: {
        primaryColor: "bg-blue-600",
        lightColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
      },
      paragraph: {
        primaryColor: "bg-gray-600",
        lightColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-700",
      },
      subject: {
        primaryColor: "bg-purple-600",
        lightColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
      },
      email: {
        primaryColor: "bg-orange-600",
        lightColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
      },
      social: {
        primaryColor: "bg-pink-600",
        lightColor: "bg-pink-50",
        borderColor: "border-pink-200",
        textColor: "text-pink-700",
      },
      message: {
        primaryColor: "bg-indigo-600",
        lightColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-700",
      },
      title: {
        primaryColor: "bg-yellow-600",
        lightColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
      },
      description: {
        primaryColor: "bg-teal-600",
        lightColor: "bg-teal-50",
        borderColor: "border-teal-200",
        textColor: "text-teal-700",
      },
      bullets: {
        primaryColor: "bg-red-600",
        lightColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
      },
      response: {
        primaryColor: "bg-emerald-600",
        lightColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
      },
      hashtags: {
        primaryColor: "bg-purple-600",
        lightColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
      },
    }
    return configs[type as keyof typeof configs] || configs.paragraph
  }

  const typeConfig = getTypeConfig(type)

  const renderContent = () => {
    if (isEditing) {
      if (type === "headline" || type === "subject" || type === "title") {
        return (
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="text-base border-2 border-gray-200 focus:border-orange-400 rounded-xl bg-white"
          />
        )
      } else {
        return (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[120px] text-base border-2 border-gray-200 focus:border-orange-400 rounded-xl bg-white resize-none"
          />
        )
      }
    }

    if (type === "headline" || type === "title") {
      return <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{editedContent}</h3>
    } else if (type === "subject") {
      return <p className="font-semibold text-lg text-gray-900">{editedContent}</p>
    } else if (type === "bullets") {
      return (
        <div className="whitespace-pre-line text-gray-700 font-mono text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
          {editedContent}
        </div>
      )
    } else if (type === "hashtags") {
      return <p className="text-blue-600 font-medium text-lg">{editedContent}</p>
    } else {
      return <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{editedContent}</p>
    }
  }

  /* ------------------------------------------------------- */
  /* ---------------------- SAVE EDIT ---------------------- */
  /* ------------------------------------------------------- */

  const handleSave = async () => {
    if (!id) {
      setIsEditing(false)
      onContentUpdate?.(editedContent)
      toast.success("Content updated!", {
        description: "Your changes have been saved successfully.",
      })
      return
    }

    if (editedContent === content) {
      setIsEditing(false)
      return
    }

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceIndex: typeof pieceIndex === "number" ? pieceIndex : undefined,
          content: editedContent,
        }),
      })

      if (!response.ok) throw new Error(`Save failed: ${response.status}`)

      const result = await response.json()

      if (result.success) {
        ContentTrailStorage.addTrailItem(id, pieceIndex, "edited", {
          previousContent: content,
          newContent: editedContent,
        })
        setTrailSummary(ContentTrailStorage.getTrailSummary(id, pieceIndex))
        setIsEditing(false)
        toast.success("Content saved!", {
          description: "Your changes have been saved successfully.",
        })
        onContentUpdate?.(editedContent)
        onStatusUpdate?.(trailSummary.hasRegenerations, true)
      } else {
        toast.error("Failed to save content")
      }
    } catch (error) {
      toast.error("Failed to save content")
    }
  }

  /* ------------------------------------------------------- */
  /* -------------------- REGENERATE ----------------------- */
  /* ------------------------------------------------------- */

  const handleRegenerate = async (customPrompt?: string) => {
    if (!id) {
      toast.error("Cannot regenerate content without ID")
      return
    }

    setIsRegenerating(true)
    setShowRegenerateDialog(false)

    try {
      const realCategory = getRealCategory(subcategory)

      const requestBody: Record<string, unknown> = {
        contentId: id,
        type: realCategory,
        prompt: originalPrompt || "Regenerate content",
        pieceIndex: typeof pieceIndex === "number" ? pieceIndex : undefined,
        selectedModel,
      }
      if (customPrompt) requestBody.newPrompt = customPrompt
      if (subcategory) requestBody.subcategory = subcategory
      if (tone) requestBody.tone = tone
      if (audience) requestBody.audience = audience
      if (voice) requestBody.voice = voice

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
        const message =
          result?.error || `Server responded with ${response.status}${raw ? ` – ${raw.substring(0, 200)}` : ""}`
        throw new Error(message)
      }

      let newContent = null
      if (result.updatedPieces && typeof pieceIndex === "number") {
        const updatedPiece = result.updatedPieces[pieceIndex]
        if (updatedPiece?.content) newContent = updatedPiece.content
      } else if (result.newPieces && typeof pieceIndex === "number") {
        const newPiece = result.newPieces[pieceIndex]
        if (newPiece?.content) newContent = newPiece.content
      } else if (result.newPieces?.length) {
        const newPiece = result.newPieces[0]
        if (newPiece?.content) newContent = newPiece.content
      }

      if (newContent) {
        ContentTrailStorage.addTrailItem(id, pieceIndex, "regenerated", {
          model: selectedModel.label,
          previousContent: editedContent,
          newContent,
        })
        setTrailSummary(ContentTrailStorage.getTrailSummary(id, pieceIndex))
        setEditedContent(newContent)
        onContentUpdate?.(newContent)

        // Only update the model for this specific piece, not the entire suite
        if (result.newModel || result.updatedModel) {
          const newModelName = result.newModel || result.updatedModel
          setCurrentModel(newModelName)
          onModelUpdate?.(newModelName)
        } else {
          // If no specific model returned, use the selected model for this piece only
          setCurrentModel(selectedModel.label)
          onModelUpdate?.(selectedModel.label)
        }

        onStatusUpdate?.(true, trailSummary.hasEdits)
        const isPiece = typeof pieceIndex === "number"
        toast.success(
          isPiece
            ? `Content regenerated with ${selectedModel.label}!`
            : `Content suite regenerated with ${selectedModel.label}!`,
          {
            description: "The content has been updated with the new AI model.",
          },
        )
      } else {
        throw new Error(result.error || "No new content in response")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate content")
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleQuickRegenerate = () => handleRegenerate()
  const handleCustomRegenerate = () => setShowRegenerateDialog(true)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
      setIsCopied(true)
      toast.success("Copied to clipboard!", {
        description: "The content has been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  /* ------------------------------------------------------- */
  /* -------------------- STATUS RIBBON -------------------- */
  /* ------------------------------------------------------- */

  const displayModel = currentModel || pieceGeneratedBy || generatedBy
  const getStatusIndicators = () => {
    const arr = []
    if (trailSummary.hasRegenerations) arr.push("Regenerated")
    if (trailSummary.hasEdits) arr.push("Edited")
    if (trailSummary.actionCount > 1) arr.push(`${trailSummary.actionCount} changes`)
    return arr
  }
  const statusIndicators = getStatusIndicators()

  /* ------------------------------------------------------- */
  /* ------------------------- JSX ------------------------- */
  /* ------------------------------------------------------- */

  return (
    <>
      <Card
        className={`border-l-4 ${typeConfig.borderColor} bg-white shadow-md hover:shadow-lg transition-all duration-200`}
      >
        <CardHeader className="pb-3 p-4 sm:p-6 sm:pb-3">
          <div className="flex flex-col gap-3">
            {/* ── Top row: badge (and optional label) on left, buttons on right ── */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {label && <CardTitle className="text-base sm:text-lg truncate whitespace-pre-wrap">{label}</CardTitle>}
                <Badge
                  className={`${typeConfig.lightColor} ${typeConfig.textColor} border ${typeConfig.borderColor} text-xs flex-shrink-0`}
                >
                  {type}
                </Badge>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                {/* Quick regenerate */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleQuickRegenerate}
                  disabled={isRegenerating}
                  className="text-gray-500 hover:text-green-600 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-green-50 transition-all duration-200"
                  title="Quick regenerate"
                >
                  {isRegenerating ? (
                    <MangoSpinner className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>

                {/* Custom regenerate */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCustomRegenerate}
                  disabled={isRegenerating}
                  className="text-gray-500 hover:text-orange-600 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-orange-50 transition-all duration-200"
                  title="Regenerate with custom prompt"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                {/* Copy */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-500 hover:text-green-600 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-green-50 transition-all duration-200"
                >
                  {isCopied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-500 hover:text-orange-600 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                {/* Trail viewer */}
                {id && <ContentTrailViewer contentId={id} pieceIndex={pieceIndex} label={label} />}
              </div>
            </div>

            {/* ── Bottom row: model name & status chips ── */}
            {(displayModel || statusIndicators.length > 0) && (
              <div className="flex flex-col gap-1">
                {displayModel && (
                  <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md w-fit">
                    {displayModel}
                  </span>
                )}
                {statusIndicators.length > 0 && (
                  <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md w-fit">
                    {statusIndicators.join(" • ")}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {renderContent()}

            {isEditing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-medium w-full sm:w-auto transition-all duration-200"
                >
                  Save Changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedContent(content)
                  }}
                  className="border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 w-full sm:w-auto transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────── Custom Regenerate Dialog ─────────────────── */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Regenerate Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
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
                rows={5}
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
                className="w-full p-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl mt-2 bg-white"
              >
                {availableModels.map((model) => (
                  <option key={model.label} value={model.label}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <p className="text-sm text-orange-700">
                <strong>Note:</strong> This will only update the model for this specific content piece, not the entire
                suite.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => handleRegenerate(newPrompt)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 flex-1 sm:flex-none"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate with {selectedModel.label}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRegenerateDialog(false)}
                className="border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-3 transition-all duration-200 flex-1 sm:flex-none"
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
