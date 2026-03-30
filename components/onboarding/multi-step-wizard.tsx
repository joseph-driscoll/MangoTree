"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react"
import { StepOne } from "./steps/step-one"
import { StepTwo } from "./steps/step-two"
import { StepThree } from "./steps/step-three"
import { StepFour } from "./steps/step-four"
import { StepFive } from "./steps/step-five"
import { StepSix } from "./steps/step-six"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { type ModelConfig, availableModels } from "@/lib/ai-service"

interface FormData {
  suiteName: string
  suiteType?: string
  idea: string
  image?: File
  tone: string
  audience: string[]
  customAudience: string
  voice: string
  selectedCategories: { [key: string]: string[] }
  selectedModel?: ModelConfig
}

interface MultiStepWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function MultiStepWizard({ isOpen, onClose }: MultiStepWizardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    suiteName: "",
    suiteType: undefined,
    idea: "",
    image: undefined,
    tone: "",
    audience: [],
    customAudience: "",
    voice: "professional", // Default voice
    selectedCategories: {},
    selectedModel: availableModels[0], // Default to first model
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const stepTitles = {
    1: "Name your content suite",
    2: "Describe your idea",
    3: "Choose your tone",
    4: "Select your audience",
    5: "Pick content types",
    6: "Choose AI model",
  }

  // Redirect to auth if not logged in
  useEffect(() => {
    if (isOpen && !user) {
      router.push("/auth")
      onClose()
    }
  }, [isOpen, user, router, onClose])

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        suiteName: "",
        suiteType: undefined,
        idea: "",
        image: undefined,
        tone: "",
        audience: [],
        customAudience: "",
        voice: "professional", // Default voice
        selectedCategories: {},
        selectedModel: availableModels[0], // Default to first model
      })
      setCurrentStep(1)
    }
  }, [isOpen])

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    console.log("Next step clicked")
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    console.log("Previous step clicked")
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    console.log("Checking canProceed for step:", currentStep, "formData:", formData)

    switch (currentStep) {
      case 1:
        const step1Valid = formData.suiteName && formData.suiteName.trim().length > 0
        console.log("Step 1 validation:", step1Valid, "suiteName:", formData.suiteName)
        return step1Valid
      case 2:
        const step2Valid = formData.idea && formData.idea.trim().length > 0
        console.log("Step 2 validation:", step2Valid, "idea:", formData.idea)
        return step2Valid
      case 3:
        const step3Valid = formData.tone && formData.tone.length > 0
        console.log("Step 3 validation:", step3Valid, "tone:", formData.tone)
        return step3Valid
      case 4:
        const step4Valid =
          (formData.audience && formData.audience.length > 0) ||
          (formData.customAudience && formData.customAudience.trim().length > 0)
        console.log(
          "Step 4 validation:",
          step4Valid,
          "audience:",
          formData.audience,
          "customAudience:",
          formData.customAudience,
        )
        return step4Valid
      case 5:
        // For step 5, we'll allow proceeding even without selecting categories for now
        // since the user might want to generate all default content
        return true
      case 6:
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
      console.log("Starting content generation with data:", formData)

      // Prepare the audience string
      const audienceString =
        formData.audience.length > 0 ? formData.audience.join(", ") : formData.customAudience || "General audience"

      // Prepare the payload to match the API expectations
      const payload = {
        idea: formData.idea,
        tone: formData.tone,
        audience: audienceString,
        voice: formData.voice || "professional", // Ensure voice is always set
        userId: user.id,
        // Additional fields for the enhanced API
        suiteName: formData.suiteName,
        suiteType: formData.suiteType,
        selectedCategories: formData.selectedCategories,
        selectedModel: formData.selectedModel,
      }

      console.log("API payload:", payload)

      // Call the API to generate content
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response error:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(result.message || `Generated content suite "${formData.suiteName}"!`)
        onClose()
        router.push("/dashboard/generated-content")
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      toast.error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} updateFormData={updateFormData} />
      case 2:
        return <StepTwo formData={formData} updateFormData={updateFormData} />
      case 3:
        return <StepThree formData={formData} updateFormData={updateFormData} />
      case 4:
        return <StepFour formData={formData} updateFormData={updateFormData} />
      case 5:
        return <StepFive formData={formData} updateFormData={updateFormData} />
      case 6:
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
    <Dialog open={isOpen} onOpenChange={(newOpen) => {
      // Clear loading state when dialog closes
      if (!newOpen) {
        setIsGenerating(false)
      }
      onClose()
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {stepTitles[currentStep as keyof typeof stepTitles]}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
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
                  Growing Your Brand...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content Suite
                </>
              )}
            </Button>
          )}
        </div>

        {/* Debug info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded mt-4">
          Debug: Step {currentStep}/{totalSteps} | Suite Name: "{formData.suiteName}" | Idea: "
          {formData.idea?.substring(0, 30)}..." | Tone: "{formData.tone}" | Voice: "{formData.voice}" | Audience:{" "}
          {formData.audience.length > 0 ? formData.audience.join(", ") : formData.customAudience} | Next Disabled:{" "}
          {isNextDisabled}
        </div>
      </DialogContent>
    </Dialog>
  )
}
