"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepTwoProps {
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

export function StepTwo({ formData, updateFormData }: StepTwoProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateFormData({ image: file })
    }
  }

  const removeImage = () => {
    updateFormData({ image: undefined })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
          <Lightbulb className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Tell us about your business, product, or campaign. The more details you provide, the better we can tailor your
          content.
        </p>
      </div>

      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="idea" className="text-lg font-semibold">
              Describe Your Idea
            </Label>
            <Textarea
              id="idea"
              placeholder="e.g., I'm a redneck and I sell cardboard underwear. The brand is fun, quirky, and appeals to people who don't take themselves too seriously..."
              value={formData.idea}
              onChange={(e) => updateFormData({ idea: e.target.value })}
              className="min-h-32 text-base"
              required
            />
            <div className="text-sm text-gray-600">
              <strong>Tip:</strong> Include details about your target audience, brand personality, key benefits, and any
              specific messaging you want to emphasize.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Upload Reference Image (Optional)</Label>
            <p className="text-sm text-gray-600">
              Upload a product image, logo, or inspiration photo to help guide the content generation.
            </p>

            {formData.image ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{formData.image.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={removeImage} className="text-green-600 hover:text-green-800">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
