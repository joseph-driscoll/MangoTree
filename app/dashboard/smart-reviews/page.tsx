import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Play, Users, Mail } from "lucide-react"

const metrics = [
  { label: "Reviews Generated", value: "89", change: "+156%" },
  { label: "Response Rate", value: "67%", change: "+45%" },
  { label: "Average Rating", value: "4.8", change: "+0.3" },
]

const recentActivity = [
  { title: "Summer Collection Campaign", time: "1 hour ago", status: "completed" },
  { title: "Wireless Headphones Reviews", time: "3 hours ago", status: "processing" },
  { title: "Skincare Set Follow-up", time: "1 day ago", status: "completed" },
]

export default function SmartReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Smart Reviews"
          description="Auto-generate review requests and drafts for customers"
          icon={Star}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <Button className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start Campaign
            </Button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Create Review Campaign
                </CardTitle>
                <CardDescription>Set up automated review requests for recent orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Campaign Settings</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Send 3 days after delivery</p>
                    <p>• Include AI-generated 5-star draft</p>
                    <p>• One-click customer approval</p>
                    <p>• Follow-up reminder after 7 days</p>
                  </div>
                </div>
                <Button className="w-full">Configure Campaign</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Active Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Summer Collection</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <p className="text-sm text-gray-600">23 emails sent, 15 reviews received</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Electronics Bundle</span>
                    <span className="text-sm text-blue-600">Processing</span>
                  </div>
                  <p className="text-sm text-gray-600">12 emails queued for tomorrow</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ToolPageLayout>
      </div>
    </div>
  )
}
