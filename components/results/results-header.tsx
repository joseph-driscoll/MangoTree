"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreePine, Download, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export function ResultsHeader() {
  const handleExportAll = () => {
    // Export functionality would go here
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Mango</span>
              <span className="text-green-600">Tree</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/onboarding" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Link>
            </Button>

            <Button
              onClick={handleExportAll}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Content Generated Successfully
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Content Suite is Ready</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Edit, export, or copy anything you need. It's all yours.
          </p>
        </div>
      </div>
    </header>
  )
}
