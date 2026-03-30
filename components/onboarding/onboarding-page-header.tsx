"use client"

import { Sparkles } from "lucide-react"

export function OnboardingPageHeader() {
  return (
    <div className="bg-white border-b px-4 sm:px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-100 rounded-xl">
          <Sparkles className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-orange-500">Mango</span>
            <span className="text-green-600">Tree</span> Content Suite
          </h1>
          <p className="text-sm text-gray-600">Create your personalized content in 5 easy steps</p>
        </div>
      </div>
    </div>
  )
}
