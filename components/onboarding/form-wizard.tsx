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
import { toast } from "sonner"
import { StepSix } from "./steps/step-six"
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

interface FormWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function FormWizard({ isOpen, onClose }: FormWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  // Initialize form data with proper defaults
  const [formData, setFormData] = useState<FormData>({
    suiteName: "",
    suiteType: undefined,
    idea: "",
    image: undefined,
    tone: "",
    audience: [],
    customAudience: "",
    voice: "",
    selectedCategories: {},
    selectedModel: availableModels[0], // Default to first model
  })

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
        voice: "",
        selectedCategories: {},
        selectedModel: availableModels[0], // Default to first model
      })
      setCurrentStep(1)
    }
  }, [isOpen])

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

  const updateFormData = (updates: Partial<FormData>) => {
    console.log("Updating form data:", updates)
    setFormData((prev) => {
      const newData = { ...prev, ...updates }
      console.log("New form data:", newData)
      return newData
    })
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

  // Simple validation function
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
        const step5Valid =
          formData.selectedCategories &&
          Object.values(formData.selectedCategories).some((subcats) => subcats.length > 0)
        console.log("Step 5 validation:", step5Valid, "selectedCategories:", formData.selectedCategories)
        return step5Valid
      case 6:
        const step6Valid = formData.selectedModel !== undefined
        console.log("Step 6 validation:", step6Valid, "selectedModel:", formData.selectedModel)
        return step6Valid
      default:
        return false
    }
  }

  const isNextDisabled = !canProceed()
  const isPrevDisabled = currentStep === 1

  console.log(
    "Render - currentStep:",
    currentStep,
    "isNextDisabled:",
    isNextDisabled,
    "isPrevDisabled:",
    isPrevDisabled,
  )

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suiteName: formData.suiteName,
          suiteType: formData.suiteType,
          idea: formData.idea,
          tone: formData.tone,
          audience: formData.audience.length > 0 ? formData.audience.join(", ") : formData.customAudience,
          voice: formData.voice,
          selectedCategories: formData.selectedCategories,
          selectedModel: formData.selectedModel,
          userId: "demo-user",
        }),
      })

      const result = await response.json()

      if (result.success) {
        const totalPieces = Object.values(formData.selectedCategories).reduce(
          (sum, subcats) => sum + (subcats as string[]).length,
          0,
        )
        toast.success(`Generated content suite "${formData.suiteName}" with ${totalPieces} pieces!`)
        onClose()
        router.push(`/results/${result.projectId}`)
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation error:", error)
      toast.error("Failed to generate content. Please try again.")
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          Debug: Step {currentStep}/{totalSteps} | Suite Name: "{formData.suiteName}" | Next Disabled: {isNextDisabled}{" "}
          | Prev Disabled: {isPrevDisabled}
        </div>
      </DialogContent>
    </Dialog>
  )
}
