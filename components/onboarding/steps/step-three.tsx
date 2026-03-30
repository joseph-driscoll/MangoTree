"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const toneOptions = [
  {
    id: "playful",
    name: "Playful",
    description: "Fun, energetic, and lighthearted",
    emoji: "🎉",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Confident, strong, and impactful",
    emoji: "💪",
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm, approachable, and welcoming",
    emoji: "😊",
  },
  {
    id: "polished",
    name: "Polished",
    description: "Professional, refined, and sophisticated",
    emoji: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple, and straightforward",
    emoji: "🎯",
  },
  {
    id: "poetic",
    name: "Poetic",
    description: "Creative, expressive, and artistic",
    emoji: "🎨",
  },
]

interface StepThreeProps {
  formData: {
    suiteName: string
    idea: string
    image?: File
    tone: string
    audience: string[]
    customAudience: string
    voice: string
    selectedCategories: { [key: string]: string[] }
  }
  updateFormData: (updates: any) => void
}

export function StepThree({ formData, updateFormData }: StepThreeProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">Choose the tone that best represents your brand personality.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toneOptions.map((tone) => (
          <Card
            key={tone.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.tone === tone.id
                ? "border-2 border-green-500 bg-green-50"
                : "border-2 border-gray-200 hover:border-green-300"
            }`}
            onClick={() => updateFormData({ tone: tone.id })}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{tone.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{tone.name}</h3>
                    {formData.tone === tone.id && <Badge className="bg-green-600">Selected</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{tone.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
