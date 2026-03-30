import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, Users, Bot } from "lucide-react"

const metrics = [
  { label: "Messages Sent", value: "1,234", change: "+45%" },
  { label: "Response Rate", value: "23%", change: "+12%" },
  { label: "Customer Retention", value: "78%", change: "+18%" },
]

const recentActivity = [
  { title: "Welcome series sent to 45 customers", time: "30 minutes ago", status: "completed" },
  { title: "Post-purchase follow-up batch", time: "2 hours ago", status: "processing" },
  { title: "Abandoned cart recovery", time: "4 hours ago", status: "completed" },
]

export default function CustomerFollowupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Customer Follow-up"
          description="AI-powered customer communication and retention"
          icon={MessageSquare}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Create Sequence
            </Button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-purple-600" />
                  AI Message Templates
                </CardTitle>
                <CardDescription>Pre-built sequences for common scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Welcome Series</h4>
                  <p className="text-sm text-gray-600">3-email sequence for new customers</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Post-Purchase</h4>
                  <p className="text-sm text-gray-600">Thank you + care instructions</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Win-Back Campaign</h4>
                  <p className="text-sm text-gray-600">Re-engage inactive customers</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">New Customers</span>
                    <span className="text-sm">156 people</span>
                  </div>
                  <p className="text-sm text-gray-600">First purchase within 30 days</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">VIP Customers</span>
                    <span className="text-sm">43 people</span>
                  </div>
                  <p className="text-sm text-gray-600">$500+ lifetime value</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">At Risk</span>
                    <span className="text-sm">89 people</span>
                  </div>
                  <p className="text-sm text-gray-600">No purchase in 90+ days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ToolPageLayout>
      </div>
    </div>
  )
}
