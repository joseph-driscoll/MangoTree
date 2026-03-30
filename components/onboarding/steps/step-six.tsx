"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, Sparkles, Clock, DollarSign } from "lucide-react"
import { availableModels, type ModelConfig } from "@/lib/ai-service"

interface StepSixProps {
  formData: {
    suiteName: string
    idea: string
    image?: File
    tone: string
    audience: string[]
    customAudience: string
    voice: string
    selectedCategories: { [key: string]: string[] }
    selectedModel?: ModelConfig
  }
  updateFormData: (updates: any) => void
}

const modelFeatures: Record<string, { speed: string; quality: string; cost: string; icon: typeof Brain; description: string; color: string }> = {
  "llama-3.3-70b-versatile": {
    speed: "Fast",
    quality: "Excellent",
    cost: "Free",
    icon: Brain,
    description: "Most capable model — excellent reasoning and creativity",
    color: "bg-purple-50 border-purple-200",
  },
  "llama-3.1-8b-instant": {
    speed: "Very Fast",
    quality: "Very Good",
    cost: "Free",
    icon: Zap,
    description: "Fastest model — great for quick content generation",
    color: "bg-green-50 border-green-200",
  },
}

export function StepSix({ formData, updateFormData }: StepSixProps) {
  const handleModelSelect = (modelId: string) => {
    const selectedModel = availableModels.find((m) => m.model === modelId)
    updateFormData({ selectedModel })
  }

  const currentModelId = formData.selectedModel?.model || availableModels[0].model

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose AI Model</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the AI model that best fits your needs. Each model has different strengths in speed, quality, and
            cost.
          </p>
        </div>
      </div>

      <RadioGroup value={currentModelId} onValueChange={handleModelSelect} className="space-y-4">
        {availableModels.map((model) => {
          const features = modelFeatures[model.model]
          const Icon = features?.icon || Brain
          const modelId = model.model

          return (
            <Card
              key={modelId}
              className={`${features?.color || "bg-gray-50 border-gray-200"} border-2 transition-all duration-200 hover:shadow-md cursor-pointer`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={modelId} id={modelId} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <Label htmlFor={modelId} className="text-lg font-semibold cursor-pointer">
                          {model.label}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {features?.description || "Advanced AI model for content generation"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {features && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{features.speed}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{features.quality}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{features.cost}</span>
                    </Badge>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </RadioGroup>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Model Recommendations</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>
                • <strong>Llama 3.3 70B:</strong> Best quality for complex, creative content
              </li>
              <li>
                • <strong>Llama 3.1 8B:</strong> Fastest generation for quick iterations
              </li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">Powered by Groq — free, no API key needed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
