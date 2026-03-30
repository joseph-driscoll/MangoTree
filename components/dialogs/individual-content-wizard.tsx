"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Sparkles, X, Check } from "lucide-react"
import { StepTwo } from "@/components/onboarding/steps/step-two"
import { StepThree } from "@/components/onboarding/steps/step-three"
import { StepFour } from "@/components/onboarding/steps/step-four"
import { StepSix } from "@/components/onboarding/steps/step-six"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { type ModelConfig, availableModels, contentSubcategories } from "@/lib/ai-service"

interface FormData {
  idea: string
  tone: string
  audience: string[]
  customAudience: string
  voice: string
  selectedModel?: ModelConfig
  selectedSubcategories: string[] // Changed from single to array
}

interface IndividualContentWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: string
  onSuccess?: () => void
}

export function IndividualContentWizard({ open, onOpenChange, contentType, onSuccess }: IndividualContentWizardProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    idea: "",
    tone: "",
    audience: [],
    customAudience: "",
    voice: "professional",
    selectedModel: availableModels[0],
    selectedSubcategories: [], // Changed to array
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const getContentTypeLabel = (type: string) => {
    const labels = {
      website: "Website",
      email: "Email",
      social: "Social Media",
      messages: "Messages",
      listings: "Listings",
      reviews: "Reviews",
      blog: "Blog",
    }
    return labels[type as keyof typeof labels] || type
  }

  const stepTitles = {
    1: `Describe your ${getContentTypeLabel(contentType).toLowerCase()} idea`,
    2: "Choose your tone",
    3: "Select your audience",
    4: `Pick ${getContentTypeLabel(contentType).toLowerCase()} types`,
    5: "Choose AI model",
  }

  // Reset form when dialog opens or content type changes
  useEffect(() => {
    if (open) {
      setFormData({
        idea: "",
        tone: "",
        audience: [],
        customAudience: "",
        voice: "professional",
        selectedModel: availableModels[0],
        selectedSubcategories: [], // Reset to empty array
      })
      setCurrentStep(1)
    }
  }, [open, contentType])

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.idea && formData.idea.trim().length > 0
      case 2:
        return formData.tone && formData.tone.length > 0
      case 3:
        return (
          (formData.audience && formData.audience.length > 0) ||
          (formData.customAudience && formData.customAudience.trim().length > 0)
        )
      case 4:
        return formData.selectedSubcategories && formData.selectedSubcategories.length > 0 // Check array length
      case 5:
        return formData.selectedModel !== undefined
      default:
        return false
    }
  }

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate content")
      return
    }

    setIsGenerating(true)

    try {
      const audienceString =
        formData.audience.length > 0 ? formData.audience.join(", ") : formData.customAudience || "General audience"

      const selectedCategories =
        formData.selectedSubcategories.length > 0
          ? { [contentType]: formData.selectedSubcategories } // Send array of subcategories
          : { [contentType]: [] }

      const payload = {
        type: contentType,
        idea: formData.idea,
        tone: formData.tone,
        audience: audienceString,
        voice: formData.voice,
        userId: user.id,
        selectedCategories,
        selectedModel: formData.selectedModel,
      } satisfies Record<string, unknown>

      const response = await fetch("/api/generate-individual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success) {
        const count = formData.selectedSubcategories.length
        toast.success(
          `Generated ${count} ${getContentTypeLabel(contentType).toLowerCase()} content piece${count > 1 ? "s" : ""}!`,
        )
        onOpenChange(false)
        onSuccess?.()
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      toast.error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSubcategory = (subcategoryId: string) => {
    const currentSelected = formData.selectedSubcategories
    const isSelected = currentSelected.includes(subcategoryId)

    if (isSelected) {
      // Remove from selection
      updateFormData({
        selectedSubcategories: currentSelected.filter((id) => id !== subcategoryId),
      })
    } else {
      // Add to selection
      updateFormData({
        selectedSubcategories: [...currentSelected, subcategoryId],
      })
    }
  }

  const renderSubcategoryStep = () => {
    const subcategories = contentSubcategories[contentType as keyof typeof contentSubcategories] || []

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What types of {getContentTypeLabel(contentType).toLowerCase()} content do you need?
          </h3>
          <p className="text-gray-600">Select one or more content types to generate (you can choose multiple)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subcategories.map((subcategory) => {
            const isSelected = formData.selectedSubcategories.includes(subcategory.id)

            return (
              <div
                key={subcategory.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all relative ${
                  isSelected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                }`}
                onClick={() => toggleSubcategory(subcategory.id)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h4 className="font-semibold text-gray-900 mb-1 pr-8">{subcategory.label}</h4>
                <p className="text-sm text-gray-600">{subcategory.description}</p>
              </div>
            )
          })}
        </div>

        {formData.selectedSubcategories.length > 0 && (
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700">
              <strong>{formData.selectedSubcategories.length}</strong> content type
              {formData.selectedSubcategories.length > 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepTwo formData={formData} updateFormData={updateFormData} />
      case 2:
        return <StepThree formData={formData} updateFormData={updateFormData} />
      case 3:
        return <StepFour formData={formData} updateFormData={updateFormData} />
      case 4:
        return renderSubcategoryStep()
      case 5:
        return <StepSix formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  if (!user) {
    return null
  }

  const isNextDisabled = !canProceed()
  const isPrevDisabled = currentStep === 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Generate {getContentTypeLabel(contentType)} Content
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">{stepTitles[currentStep as keyof typeof stepTitles]}</h3>
          </div>
        </DialogHeader>

        <div className="py-6">{renderStep()}</div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={isPrevDisabled}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={isNextDisabled}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isNextDisabled || isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Growing Your Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {getContentTypeLabel(contentType)} Content
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
