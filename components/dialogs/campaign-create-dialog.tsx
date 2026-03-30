"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { DatabaseService } from "@/lib/database-service"

interface CampaignCreateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CampaignCreateDialog({ isOpen, onClose }: CampaignCreateDialogProps) {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    delay: "3",
    followUp: "7",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setCreating(true)
    try {
      await DatabaseService.createCampaign({
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        settings: {
          description: formData.description,
          delay: Number.parseInt(formData.delay),
          followUp: Number.parseInt(formData.followUp),
        },
        status: "draft",
      })

      toast.success("Campaign created successfully!")
      onClose()
      setFormData({ name: "", type: "", description: "", delay: "3", followUp: "7" })
    } catch (error) {
      console.error("Campaign creation error:", error)
      toast.error("Failed to create campaign")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Summer Collection Reviews"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review_request">Review Request</SelectItem>
                <SelectItem value="follow_up">Customer Follow-up</SelectItem>
                <SelectItem value="promo_email">Promotional Email</SelectItem>
                <SelectItem value="win_back">Win-back Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign goals..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delay">Send After (days)</Label>
              <Select value={formData.delay} onValueChange={(value) => setFormData({ ...formData, delay: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUp">Follow-up (days)</Label>
              <Select
                value={formData.followUp}
                onValueChange={(value) => setFormData({ ...formData, followUp: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || !formData.name || !formData.type}
              className="bg-green-600 hover:bg-green-700"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
