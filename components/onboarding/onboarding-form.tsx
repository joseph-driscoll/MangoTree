"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

const toneOptions = [
  "Calm & Elegant",
  "Friendly & Down-to-earth",
  "Bold & Cheeky",
  "Sleek & Luxury",
  "Quirky & Fun",
  "Custom",
]

const audienceOptions = [
  "Health-conscious women 25–45",
  "Gen Z buyers",
  "Moms with young kids",
  "Luxury shoppers",
  "Custom",
]

const voiceOptions = [
  { value: "first-person", label: "First-person (I/we)", description: "Personal and direct" },
  { value: "third-person", label: "Third-person (the brand speaks)", description: "Professional brand voice" },
  { value: "conversational", label: "Conversational", description: "Friendly and approachable" },
  { value: "formal", label: "Formal", description: "Professional and polished" },
  { value: "minimal", label: "Minimal", description: "Clean and concise" },
  { value: "poetic", label: "Poetic", description: "Creative and expressive" },
]

export function OnboardingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    idea: "",
    tone: "",
    customTone: "",
    audience: "",
    customAudience: "",
    voice: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: "demo-user", // In real app, get from auth
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Generated ${result.contentCount} pieces of content!`)
        router.push(`/results/${result.projectId}`)
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormValid = formData.idea.trim() && formData.tone && formData.audience && formData.voice

  return (
    <Card className="border-2 border-green-100 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Idea Description */}
          <div className="space-y-3">
            <Label htmlFor="idea" className="text-lg font-semibold text-gray-900">
              Describe your idea
            </Label>
            <Textarea
              id="idea"
              placeholder="I'm starting a handmade soap brand using natural ingredients…"
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              className="min-h-[120px] text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-900">Choose your tone</Label>
            <Select
              value={formData.tone}
              onValueChange={(value) => setFormData({ ...formData, tone: value, customTone: "" })}
              required
            >
              <SelectTrigger className="text-base border-gray-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select a tone for your brand" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((tone) => (
                  <SelectItem key={tone} value={tone.toLowerCase().replace(/\s+/g, "-")}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.tone === "custom" && (
              <Input
                placeholder="Describe your custom tone..."
                value={formData.customTone}
                onChange={(e) => setFormData({ ...formData, customTone: e.target.value })}
                className="text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            )}
          </div>

          {/* Audience Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-900">Select your audience</Label>
            <Select
              value={formData.audience}
              onValueChange={(value) => setFormData({ ...formData, audience: value, customAudience: "" })}
              required
            >
              <SelectTrigger className="text-base border-gray-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Who are you targeting?" />
              </SelectTrigger>
              <SelectContent>
                {audienceOptions.map((audience) => (
                  <SelectItem key={audience} value={audience.toLowerCase().replace(/\s+/g, "-")}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.audience === "custom" && (
              <Input
                placeholder="Describe your target audience..."
                value={formData.customAudience}
                onChange={(e) => setFormData({ ...formData, customAudience: e.target.value })}
                className="text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            )}
          </div>

          {/* Voice Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">Pick your voice</Label>
            <RadioGroup
              value={formData.voice}
              onValueChange={(value) => setFormData({ ...formData, voice: value })}
              className="space-y-3"
              required
            >
              {voiceOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50/30 transition-all cursor-pointer"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="mt-0.5 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="text-base font-medium text-gray-900 cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || isGenerating}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Growing Your Brand...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  Generate My Brand
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">You can edit everything later.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
