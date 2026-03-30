"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { contentSubcategories } from "@/lib/ai-service"

interface StepFiveProps {
  formData: {
    selectedCategories: { [key: string]: string[] }
  }
  updateFormData: (updates: any) => void
}

const contentTypeConfig = {
  website: {
    label: "Website Content",
    description: "Homepage, about page, product pages, and more",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  email: {
    label: "Email Marketing",
    description: "Newsletters, promotions, welcome series, and campaigns",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
  social: {
    label: "Social Media",
    description: "Posts, stories, captions, and engagement content",
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  messages: {
    label: "Customer Messages",
    description: "Support responses, follow-ups, and communication templates",
    color: "bg-orange-50 border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  listings: {
    label: "Product Listings",
    description: "E-commerce descriptions, marketplace listings, and catalogs",
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-700",
  },
  reviews: {
    label: "Review Responses",
    description: "Professional responses to customer reviews and feedback",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  blog: {
    label: "Blog Content",
    description: "Articles, tutorials, industry insights, and thought leadership",
    color: "bg-indigo-50 border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
}

export function StepFive({ formData, updateFormData }: StepFiveProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const toggleSubcategory = (category: string, subcategoryId: string) => {
    const currentSelected = formData.selectedCategories[category] || []
    const isSelected = currentSelected.includes(subcategoryId)

    console.log("🔍 Multi-step wizard - toggling subcategory:", {
      category,
      subcategoryId,
      isSelected,
      currentSelected,
    })

    const newSelected = isSelected
      ? currentSelected.filter((id) => id !== subcategoryId) // Use subcategoryId consistently
      : [...currentSelected, subcategoryId] // Use subcategoryId consistently

    console.log("🔍 Multi-step wizard - new selection:", newSelected)

    updateFormData({
      selectedCategories: {
        ...formData.selectedCategories,
        [category]: newSelected,
      },
    })
  }

  const selectAllInCategory = (category: string) => {
    const subcategories = contentSubcategories[category as keyof typeof contentSubcategories] || []
    const allIds = subcategories.map((sub) => sub.id) // Use sub.id consistently

    console.log("🔍 Multi-step wizard - selecting all in category:", {
      category,
      allIds,
    })

    updateFormData({
      selectedCategories: {
        ...formData.selectedCategories,
        [category]: allIds,
      },
    })
  }

  const clearCategory = (category: string) => {
    console.log("🔍 Multi-step wizard - clearing category:", category)

    updateFormData({
      selectedCategories: {
        ...formData.selectedCategories,
        [category]: [],
      },
    })
  }

  const getTotalSelected = () => {
    return Object.values(formData.selectedCategories).reduce((sum, arr) => sum + arr.length, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Content Types</h2>
        <p className="text-gray-600">
          Select the types of content you want to generate. You can choose multiple categories and specific content
          types within each category.
        </p>
      </div>

      {getTotalSelected() > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Selected: {getTotalSelected()} content type{getTotalSelected() !== 1 ? "s" : ""}
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData.selectedCategories).map(([category, subcategoryIds]) =>
              subcategoryIds.map((subId) => {
                const subcategories = contentSubcategories[category as keyof typeof contentSubcategories] || []
                const sub = subcategories.find((s) => s.id === subId)
                return sub ? (
                  <Badge key={`${category}-${subId}`} variant="outline" className="bg-white">
                    {contentTypeConfig[category as keyof typeof contentTypeConfig]?.label}: {sub.label}
                  </Badge>
                ) : null
              }),
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(contentTypeConfig).map(([category, config]) => {
          const isExpanded = expandedCategories.has(category)
          const subcategories = contentSubcategories[category as keyof typeof contentSubcategories] || []
          const selectedSubcategories = formData.selectedCategories[category] || []
          const selectedCount = selectedSubcategories.length

          return (
            <Card key={category} className={`${config.color} border-2 transition-all duration-200`}>
              <CardHeader
                className="cursor-pointer hover:bg-white/50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3">
                      {config.label}
                      {selectedCount > 0 && <Badge className={config.badgeColor}>{selectedCount} selected</Badge>}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">{config.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearCategory(category)
                        }}
                        className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        selectAllInCategory(category)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Select All
                    </button>
                    <div className="text-gray-400">{isExpanded ? "−" : "+"}</div>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {subcategories.map((sub) => {
                      const isSelected = selectedSubcategories.includes(sub.id) // Use sub.id consistently
                      return (
                        <div
                          key={sub.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => toggleSubcategory(category, sub.id)} // Use sub.id consistently
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{sub.label}</h4>
                              <p className="text-xs text-gray-600 mt-1">{sub.description}</p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ml-2 ${
                                isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {getTotalSelected() === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No content types selected yet</p>
          <p className="text-sm text-gray-400">
            Click on a category above to expand it and select specific content types
          </p>
        </div>
      )}
    </div>
  )
}
