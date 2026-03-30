import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Zap, Globe, Mail, MessageSquare, ShoppingBag } from "lucide-react"

const metrics = [
  { label: "Content Pieces", value: "0", change: "N/A" },
  { label: "Channels", value: "6", change: "Ready" },
  { label: "Time Saved", value: "0 hrs", change: "Coming Soon" },
]

const recentActivity = [
  { title: "Feature in development", time: "In progress", status: "processing" },
  { title: "Beta testing planned for Q2", time: "Scheduled", status: "processing" },
  { title: "Early access list growing", time: "Active", status: "completed" },
]

export default function ContentOrchardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Content Orchard"
          description="Omnichannel content generation from a single product photo"
          icon={Share2}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Coming Soon
              </Badge>
              <Button variant="outline">Join Waitlist</Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-orange-600" />
                  How It Works
                </CardTitle>
                <CardDescription>One photo becomes content for every channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    📸
                  </div>
                  <p className="font-medium mb-2">Upload One Product Photo</p>
                  <div className="text-2xl my-4">↓</div>
                  <p className="text-sm text-gray-600">AI generates content for all channels automatically</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-green-600" />
                  Content Channels
                </CardTitle>
                <CardDescription>All channels covered from one source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Website product pages</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Email marketing campaigns</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Social media posts</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-orange-50">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Marketplace listings</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>🚀 Early Access Program</CardTitle>
              <CardDescription>Be the first to try Content Orchard when it launches in Q2 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">What you'll get:</h3>
                <ul className="space-y-1 text-sm text-gray-700 mb-4">
                  <li>• Free access during beta period</li>
                  <li>• Direct feedback line to our development team</li>
                  <li>• 50% discount on first year when it launches</li>
                  <li>• Priority support and training</li>
                </ul>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Join Early Access List
                </Button>
              </div>
            </CardContent>
          </Card>
        </ToolPageLayout>
      </div>
    </div>
  )
}
