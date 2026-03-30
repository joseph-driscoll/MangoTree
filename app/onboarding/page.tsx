"use client"

import { useState, useEffect } from "react"
import { MultiStepWizard } from "@/components/onboarding/multi-step-wizard"

export default function Page() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Auto-open the wizard when the page loads
  useEffect(() => {
    setIsWizardOpen(true)
  }, [])

  const handleClose = () => {
    setIsWizardOpen(false)
    // Redirect back to dashboard or previous page
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MultiStepWizard isOpen={isWizardOpen} onClose={handleClose} />
    </div>
  )
}
