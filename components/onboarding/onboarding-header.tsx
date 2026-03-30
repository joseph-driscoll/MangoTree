import { TreePine, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function OnboardingHeader() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TreePine className="h-8 w-8 text-green-600" />
          <span className="text-4xl font-bold">
            <span className="text-orange-500">Mango</span>
            <span className="text-green-600">Tree</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Step 1 of 4
            </Badge>
            <div className="flex space-x-1">
              <div className="w-8 h-2 bg-green-600 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
