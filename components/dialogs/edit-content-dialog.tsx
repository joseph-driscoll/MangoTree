"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { parseAudience } from "@/lib/format-utils"
import { X } from "lucide-react"

interface EditContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: {
    id: string
    type: string
    content: any[]
    prompt: string
    tone?: string
    audience?: string | string[]
    voice?: string
    suite_name?: string
  }
  onUpdate: () => void
}

const audienceOptions = ["Men", "Women", "Teens", "Parents", "Professionals", "Eco-conscious"]

export function EditContentDialog({ open, onOpenChange, content, onUpdate }: EditContentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])
  const [customAudience, setCustomAudience] = useState("")
  const [formData, setFormData] = useState({
    prompt: content.prompt,
    tone: content.tone || "",
    voice: content.voice || "",
    content: content.content,
    suite_name: content.suite_name || "",
  })

  // Reset form data when content changes
  useEffect(() => {
    const audiences = parseAudience(content.audience)
    const predefinedAudiences = audiences.filter((a) => audienceOptions.includes(a))
    const customAudiences = audiences.filter((a) => !audienceOptions.includes(a))

    setSelectedAudiences(predefinedAudiences)
    setCustomAudience(customAudiences.join(", "))
    setFormData({
      prompt: content.prompt,
      tone: content.tone || "",
      voice: content.voice || "",
      content: content.content,
      suite_name: content.suite_name || "",
    })
  }, [content])

  const toggleAudience = (audience: string) => {
    setSelectedAudiences((prev) => (prev.includes(audience) ? prev.filter((a) => a !== audience) : [...prev, audience]))
  }

  const handleSave = async () => {
    console.log("Saving content...", formData)
    setLoading(true)

    try {
      // Combine selected audiences with custom audience
      const allAudiences = [...selectedAudiences]
      if (customAudience.trim()) {
        allAudiences.push(
          ...customAudience
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }

      const saveData = {
        ...formData,
        audience: allAudiences.length > 0 ? JSON.stringify(allAudiences) : "",
      }

      const response = await fetch(`/api/content/${content.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      })

      console.log("Response status:", response.status)
      const result = await response.json()
      console.log("Response data:", result)

      if (response.ok && result.success) {
        toast.success("Content updated successfully!")
        onUpdate()
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to update content")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update content")
    } finally {
      setLoading(false)
    }
  }

  const updateContentPiece = (index: number, field: string, value: string) => {
    const updatedContent = [...formData.content]
    updatedContent[index] = { ...updatedContent[index], [field]: value }
    setFormData({ ...formData, content: updatedContent })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-auto">
        <DialogHeader>
          <DialogTitle>Edit {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content</DialogTitle>
          <DialogDescription>Update your generated content and settings.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="suite_name">Content Suite Name</Label>
            <Input
              id="suite_name"
              value={formData.suite_name}
              onChange={(e) => setFormData({ ...formData, suite_name: e.target.value })}
              placeholder="e.g., Baxter's Badger Search and Rescue"
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full p-2 border rounded-md text-sm sm:text-base"
              >
                <option value="">Select tone</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="bold">Bold</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div>
              <Label htmlFor="voice">Voice</Label>
              <select
                value={formData.voice}
                onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                className="w-full p-2 border rounded-md text-sm sm:text-base"
              >
                <option value="">Select voice</option>
                <option value="formal">Formal</option>
                <option value="conversational">Conversational</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="authoritative">Authoritative</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Target Audience</Label>
            <div className="space-y-3 mt-2">
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((audience) => (
                  <Badge
                    key={audience}
                    variant={selectedAudiences.includes(audience) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 ${
                      selectedAudiences.includes(audience)
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:border-green-500 hover:text-green-600"
                    }`}
                    onClick={() => toggleAudience(audience)}
                  >
                    {audience}
                    {selectedAudiences.includes(audience) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>

              <div>
                <Label htmlFor="customAudience">Custom Audience (comma-separated)</Label>
                <Input
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="e.g., Small business owners, Tech enthusiasts"
                />
              </div>

              {(selectedAudiences.length > 0 || customAudience) && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Current audience:</strong>{" "}
                    {[
                      ...selectedAudiences,
                      ...customAudience
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    ].join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="prompt">Original Prompt</Label>
            <Textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Describe your business or product..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Generated Content Pieces</Label>
            <div className="space-y-4 mt-2">
              {formData.content.map((piece: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={piece.label || ""}
                      onChange={(e) => updateContentPiece(index, "label", e.target.value)}
                      className="font-medium"
                      placeholder="Content label"
                    />
                    <span className="text-xs text-gray-500 ml-2">{piece.type}</span>
                  </div>
                  <Textarea
                    value={piece.content || ""}
                    onChange={(e) => updateContentPiece(index, "content", e.target.value)}
                    className="min-h-[80px]"
                    placeholder="Content text"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
