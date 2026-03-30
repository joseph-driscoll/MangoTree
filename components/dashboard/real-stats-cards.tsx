"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, MessageSquare, Users, Zap } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"
import { MangoSpinner } from "@/components/ui/mango-spinner"

interface DashboardStats {
  contentGenerated: number
  totalContent: number
  activeCampaigns: number
  connectedIntegrations: number
  contentByType: Record<string, number>
}

export function RealStatsCards() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadStats()
    } else {
      // Show demo stats for non-authenticated users
      setStats({
        contentGenerated: 0,
        totalContent: 0,
        activeCampaigns: 0,
        connectedIntegrations: 0,
        contentByType: {},
      })
      setLoading(false)
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return

    try {
      setError(null)

      // Get generated content stats
      const { data: contentData, error: contentError } = await supabase
        .from("generated_content")
        .select("type, created_at")
        .eq("user_id", user.id)

      if (contentError) {
        console.warn("Error fetching content stats:", contentError)
      }

      // Get campaigns stats
      const { data: campaignsData, error: campaignsError } = await supabase
        .from("campaigns")
        .select("status, created_at")
        .eq("user_id", user.id)

      if (campaignsError) {
        console.warn("Error fetching campaigns stats:", campaignsError)
      }

      // Get integrations stats
      const { data: integrationsData, error: integrationsError } = await supabase
        .from("integrations")
        .select("status, created_at")
        .eq("user_id", user.id)

      if (integrationsError) {
        console.warn("Error fetching integrations stats:", integrationsError)
      }

      // Calculate stats
      const content = contentData || []
      const campaigns = campaignsData || []
      const integrations = integrationsData || []

      const now = new Date()
      const thisMonth = content.filter((item) => {
        const created = new Date(item.created_at)
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length

      const contentByType = content.reduce(
        (acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const activeCampaigns = campaigns.filter((c) => c.status === "active").length
      const connectedIntegrations = integrations.filter((i) => i.status === "connected").length

      setStats({
        contentGenerated: thisMonth,
        totalContent: content.length,
        activeCampaigns,
        connectedIntegrations,
        contentByType,
      })
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
      setError("Failed to load stats")
      // Set fallback stats
      setStats({
        contentGenerated: 0,
        totalContent: 0,
        activeCampaigns: 0,
        connectedIntegrations: 0,
        contentByType: {},
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <MangoSpinner size="md" />
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (!stats) return null

  const statsData = [
    {
      title: "Content This Month",
      value: stats.contentGenerated.toString(),
      change: stats.contentGenerated > 0 ? `+${stats.contentGenerated}` : "Get started",
      trend: "up" as const,
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Total Content",
      value: stats.totalContent.toString(),
      change: stats.totalContent > 0 ? `${stats.totalContent} pieces` : "None yet",
      trend: "up" as const,
      icon: Zap,
      color: "text-blue-600",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: stats.activeCampaigns > 0 ? `${stats.activeCampaigns} running` : "None active",
      trend: "up" as const,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Integrations",
      value: stats.connectedIntegrations.toString(),
      change: stats.connectedIntegrations > 0 ? "Connected" : "None yet",
      trend: "up" as const,
      icon: Users,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 text-sm">
              ⚠️ Database not fully configured. Showing demo data.
              <button onClick={loadStats} className="ml-2 underline hover:no-underline">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="flex items-center text-sm">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
