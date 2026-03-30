import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, AlertTriangle, Eye } from "lucide-react"

const metrics = [
  { label: "Insights Generated", value: "12", change: "+3" },
  { label: "Trend Accuracy", value: "94%", change: "+2%" },
  { label: "Revenue Impact", value: "$2,340", change: "+15%" },
]

const recentActivity = [
  { title: "Eco-friendly products trending up 45%", time: "2 hours ago", status: "completed" },
  { title: "Low inventory alert: Summer dresses", time: "4 hours ago", status: "completed" },
  { title: "Customer behavior analysis complete", time: "1 day ago", status: "completed" },
]

export default function RetailInsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Retail Insights"
          description="AI-powered analytics and trend analysis for your business"
          icon={BarChart3}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <Button className="bg-green-600 hover:bg-green-700">
              <Eye className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Current Trends
                </CardTitle>
                <CardDescription>AI-detected patterns in your sales data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800">🔥 Hot Trend</h4>
                  <p className="text-sm text-green-700">Eco-friendly products up 45% this month</p>
                  <p className="text-xs text-green-600 mt-1">Recommend: Increase eco-product inventory</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">📈 Growing</h4>
                  <p className="text-sm text-blue-700">Weekend sales increased 23%</p>
                  <p className="text-xs text-blue-600 mt-1">Recommend: Weekend-specific promotions</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-medium text-orange-800">⚠️ Watch</h4>
                  <p className="text-sm text-orange-700">Summer items declining as expected</p>
                  <p className="text-xs text-orange-600 mt-1">Recommend: Plan fall inventory</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Smart Alerts
                </CardTitle>
                <CardDescription>Automated notifications for important changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-800">Low Inventory</span>
                    <span className="text-xs text-red-600">URGENT</span>
                  </div>
                  <p className="text-sm text-red-700">Summer dresses: Only 3 units left</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-800">Price Opportunity</span>
                    <span className="text-xs text-yellow-600">MEDIUM</span>
                  </div>
                  <p className="text-sm text-yellow-700">Competitor dropped prices on electronics</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Customer Insight</span>
                    <span className="text-xs text-blue-600">INFO</span>
                  </div>
                  <p className="text-sm text-blue-700">Repeat customers prefer bundle deals</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ToolPageLayout>
      </div>
    </div>
  )
}
