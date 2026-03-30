"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, Settings, Sparkles } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action: string
  href: string
  completed: boolean
}

export function StepsCard() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "upload",
      title: "Upload a product photo",
      description: "Add your first product image to generate descriptions",
      icon: Upload,
      action: "Upload Photo",
      href: "/dashboard/product-descriptions",
      completed: false,
    },
    {
      id: "configure",
      title: "Configure your preferences",
      description: "Set your default tone, voice, and audience",
      icon: Settings,
      action: "Configure",
      href: "/dashboard/settings",
      completed: false,
    },
    {
      id: "generate",
      title: "Generate your first content",
      description: "Create your first AI-powered content suite",
      icon: Sparkles,
      action: "Generate",
      href: "/onboarding",
      completed: false,
    },
  ])

  const completedCount = steps.filter((step) => step.completed).length
  const progress = Math.round((completedCount / steps.length) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Get Started with Mango Tree</CardTitle>
            <CardDescription>Complete these steps to set up your account</CardDescription>
          </div>
          <Badge variant="outline">{progress}% Complete</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.completed ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <step.icon className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
