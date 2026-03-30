import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, TrendingUp } from "lucide-react"
import { DescriptionGenerator } from "@/components/product-description/description-generator"

const metrics = [
  { label: "Descriptions Generated", value: "0", change: "+0%" },
  { label: "Time Saved", value: "0 hrs", change: "+0%" },
  { label: "Conversion Rate", value: "0%", change: "+0%" },
]

const recentActivity = [{ title: "No recent activity", time: "Start generating!", status: "completed" }]

export default function ProductDescriptionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Product Description Generator"
          description="Generate compelling product descriptions from photos and bullet points"
          icon={FileText}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Product Photo
            </Button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DescriptionGenerator />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Performance Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> Include lifestyle shots for 23% better conversion rates
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Best Practice:</strong> Add product dimensions and materials for SEO boost
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Reminder:</strong> Review and customize AI descriptions for your brand voice
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ToolPageLayout>
      </div>
    </div>
  )
}
