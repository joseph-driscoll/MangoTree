"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { RealStatsCards } from "@/components/dashboard/real-stats-cards"
import { QuickActionsConnected } from "@/components/dashboard/quick-actions-connected"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AIToolsGrid } from "@/components/dashboard/ai-tools-grid"
import { StepsCard } from "@/components/dashboard/steps-card"
import { useAuth } from "@/components/auth/auth-provider"
import { GeneratedContentPreview } from "@/components/dashboard/generated-content-preview"
import { MobileMenuProvider } from "@/components/dashboard/mobile-menu-context"
import { MangoSpinner } from "@/components/ui/mango-spinner"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (!loading && user) {
      // Redirect to Content Suites as the default landing page
      router.push("/dashboard/suites")
    }
  }, [user, loading, router])

  if (loading) {
    return <MangoSpinner overlay size="xl" />
  }

  if (!user) {
    return null
  }

  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-gray-50 md:flex">
        <DashboardSidebar />
        <div className="flex-1">
          <MobileHeader />
          <div className="hidden lg:block">
            <DashboardHeader />
          </div>
          <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
            <RealStatsCards />
            <StepsCard />
            <GeneratedContentPreview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AIToolsGrid />
                <QuickActionsConnected />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  )
}
