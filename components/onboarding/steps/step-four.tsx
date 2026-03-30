"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

const audienceOptions = ["Men", "Women", "Teens", "Parents", "Professionals", "Eco-conscious"]

interface StepFourProps {
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

export function StepFour({ formData, updateFormData }: StepFourProps) {
  const [showCustom, setShowCustom] = useState(false)

  const toggleAudience = (audience: string) => {
    const currentAudience = formData.audience
    const isSelected = currentAudience.includes(audience)

    if (isSelected) {
      updateFormData({
        audience: currentAudience.filter((a: string) => a !== audience),
      })
    } else {
      updateFormData({
        audience: [...currentAudience, audience],
      })
    }
  }

  const isSelected = (audience: string) => {
    return formData.audience.includes(audience)
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Select one or more audience segments that best describe your target customers.</p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {audienceOptions.map((audience) => (
            <Badge
              key={audience}
              variant={isSelected(audience) ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                isSelected(audience) ? "bg-green-600 hover:bg-green-700" : "hover:border-green-500 hover:text-green-600"
              }`}
              onClick={() => toggleAudience(audience)}
            >
              {audience}
              {isSelected(audience) && <X className="h-3 w-3 ml-2" />}
            </Badge>
          ))}

          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 text-sm hover:border-green-500 hover:text-green-600"
            onClick={() => setShowCustom(true)}
          >
            + Custom
          </Badge>
        </div>

        {showCustom && (
          <div className="space-y-2">
            <Label htmlFor="customAudience">Custom Audience</Label>
            <Input
              id="customAudience"
              placeholder="Describe your specific target audience..."
              value={formData.customAudience}
              onChange={(e) => updateFormData({ customAudience: e.target.value })}
            />
          </div>
        )}

        {(formData.audience.length > 0 || formData.customAudience) && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Selected:</strong> {formData.audience.length > 0 ? formData.audience.join(", ") : ""}
              {formData.audience.length > 0 && formData.customAudience ? ", " : ""}
              {formData.customAudience}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
