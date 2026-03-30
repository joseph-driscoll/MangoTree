"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Sparkles } from "lucide-react"

interface StepOneProps {
  formData: {
    suiteName: string
    suiteType?: string
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

export function StepOne({ formData, updateFormData }: StepOneProps) {
  const suiteTypes = [
    {
      id: "product-launch",
      title: "Product Launch",
      description: "New product introduction",
    },
    {
      id: "seasonal-campaign",
      title: "Seasonal Campaign",
      description: "Holiday or seasonal content",
    },
    {
      id: "brand-refresh",
      title: "Brand Refresh",
      description: "Updated brand messaging",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
          <Package className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Give your content suite a memorable name. This will help you organize and find your generated content later.
        </p>
      </div>

      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="suiteName" className="text-lg font-semibold">
              Content Suite Name
            </Label>
            <Input
              id="suiteName"
              placeholder="e.g., Redneck Cardboard Underwear Launch, Summer Product Campaign..."
              value={formData.suiteName}
              onChange={(e) => updateFormData({ suiteName: e.target.value })}
              className="text-lg p-4 h-14"
              required
            />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>This name will appear in your content library and can be changed later</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label className="text-lg font-semibold mb-3 block">Content Suite Type (Optional)</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suiteTypes.map((type) => (
            <Card
              key={type.id}
              className={`border cursor-pointer transition-all ${
                formData.suiteType === type.id
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 hover:border-green-300"
              }`}
              onClick={() => updateFormData({ suiteType: type.id })}
            >
              <CardContent className="p-4 text-center">
                <h4 className="font-medium text-gray-900 mb-1">{type.title}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
