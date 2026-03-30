"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Plus, ArrowRight } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface GeneratedContent {
  id: string
  content_type?: string
  type?: string
  title?: string
  content: any
  created_at: string
  prompt?: string
  tone?: string
  audience?: string
  subcategory?: string
}

export function GeneratedContentPreview() {
  const [content, setContent] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      loadRecentContent()
    } else if (mounted && !user) {
      setLoading(false)
    }
  }, [user, mounted])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 text-green-600 mr-2" />
            Your Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const loadRecentContent = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error("Error loading content:", error)
      setError("Failed to load content")
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  const getContentTitle = (item: GeneratedContent) => {
    if (item.title) return item.title
    if (item.content?.title) return item.content.title
    if (item.content?.headline) return item.content.headline
    const contentType = item.content_type || item.type || "Content"
    return `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content`
  }

  const getContentPreview = (item: GeneratedContent) => {
    // New schema: content is plain text
    if (typeof item.content === "string") {
      return item.content.length > 100 ? item.content.substring(0, 100) + "..." : item.content
    }
    if (item.content?.description) return item.content.description.substring(0, 100) + "..."
    if (item.content?.body) return item.content.body.substring(0, 100) + "..."
    if (item.prompt) return item.prompt.substring(0, 100) + "..."
    return "No preview available"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 text-green-600 mr-2" />
            Your Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 text-green-600 mr-2" />
            Your Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Unable to load content at the moment</p>
            <Link href="/onboarding">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 text-green-600 mr-2" />
              Your Generated Content
            </CardTitle>
            <CardDescription>
              {content.length > 0
                ? `${content.length} recent items • View all your generated content`
                : "Start generating content to see it here"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Link href="/onboarding">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Generate New
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {content.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-500 mb-4">Generate your first piece of content to get started</p>
            <Link href="/onboarding">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm">{getContentTitle(item)}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {item.content_type || item.type || "content"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{getContentPreview(item)}</p>
                  <p className="text-xs text-gray-400">Generated {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/generated-content?id=${item.id}`}>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {content.length >= 3 && (
              <div className="text-center pt-2">
                <Link href="/dashboard/generated-content">
                  <Button variant="ghost" size="sm">
                    View all content
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
