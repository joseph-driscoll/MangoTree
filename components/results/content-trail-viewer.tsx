"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Edit3, RotateCcw, Clock, Cpu } from "lucide-react"
import { ContentTrailStorage } from "@/lib/content-trail-storage"

interface ContentTrailViewerProps {
  contentId: string
  pieceIndex?: number
  label: string
}

export function ContentTrailViewer({ contentId, pieceIndex, label }: ContentTrailViewerProps) {
  const [open, setOpen] = useState(false)
  const trailItems = ContentTrailStorage.getTrailForContent(contentId, pieceIndex)
  const trailSummary = ContentTrailStorage.getTrailSummary(contentId, pieceIndex)

  if (trailSummary.actionCount === 0) {
    return null
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const getActionIcon = (action: "edited" | "regenerated") => {
    return action === "edited" ? (
      <Edit3 className="h-4 w-4 text-blue-600" />
    ) : (
      <RotateCcw className="h-4 w-4 text-green-600" />
    )
  }

  const getActionColor = (action: "edited" | "regenerated") => {
    return action === "edited" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-purple-600 h-7 w-7 sm:h-8 sm:w-8 p-0"
          title={`View ${trailSummary.actionCount} change${trailSummary.actionCount !== 1 ? "s" : ""}`}
        >
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Content History: {label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {trailSummary.actionCount} total change{trailSummary.actionCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {trailSummary.lastModel && (
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last model: {trailSummary.lastModel}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {trailSummary.hasEdits && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      Edited
                    </Badge>
                  )}
                  {trailSummary.hasRegenerations && (
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      Regenerated
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trail Items */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {trailItems.map((item, index) => (
                <Card key={item.id} className="border-l-4 border-l-gray-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getActionIcon(item.action)}
                        <CardTitle className="text-base">
                          {item.action === "edited" ? "Manual Edit" : "AI Regeneration"}
                        </CardTitle>
                        <Badge className={getActionColor(item.action)}>{item.action}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    {item.model && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Cpu className="h-3 w-3" />
                        <span>{item.model}</span>
                      </div>
                    )}
                  </CardHeader>

                  {(item.previousContent || item.newContent) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {item.previousContent && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">Previous:</h5>
                            <div className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                              <p className="text-gray-700 line-clamp-3">{item.previousContent}</p>
                            </div>
                          </div>
                        )}
                        {item.newContent && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">New:</h5>
                            <div className="bg-green-50 border border-green-200 rounded p-2 text-sm">
                              <p className="text-gray-700 line-clamp-3">{item.newContent}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                ContentTrailStorage.clearTrailForContent(contentId)
                setOpen(false)
              }}
              className="text-red-600 hover:text-red-700"
            >
              Clear History
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
