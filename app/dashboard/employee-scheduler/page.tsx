import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ToolPageLayout } from "@/components/dashboard/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, Settings } from "lucide-react"

const metrics = [
  { label: "Shifts Scheduled", value: "156", change: "+12%" },
  { label: "Coverage Rate", value: "98%", change: "+5%" },
  { label: "Employee Satisfaction", value: "4.6", change: "+0.3" },
]

const recentActivity = [
  { title: "Week 47 schedule generated", time: "1 hour ago", status: "completed" },
  { title: "Holiday coverage optimized", time: "3 hours ago", status: "processing" },
  { title: "Staff availability updated", time: "5 hours ago", status: "completed" },
]

export default function EmployeeSchedulerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <ToolPageLayout
          title="Content Scheduler"
          description="Smart shift scheduling with AI optimization"
          icon={Calendar}
          metrics={metrics}
          recentActivity={recentActivity}
          primaryAction={
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Beta
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Generate Schedule
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Team Overview
                </CardTitle>
                <CardDescription>Current staff and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Sarah Johnson</span>
                    <Badge className="bg-green-100 text-green-700">Available</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Manager • 40 hrs/week • Mornings preferred</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Mike Chen</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Limited</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Sales • 25 hrs/week • Weekends only</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Emma Davis</span>
                    <Badge className="bg-green-100 text-green-700">Available</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Cashier • 30 hrs/week • Flexible</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  AI Scheduling Features
                </CardTitle>
                <CardDescription>Beta features available now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">🤖 Smart Optimization</h4>
                  <p className="text-sm text-blue-700">AI considers skills, availability, and peak hours</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">📱 Mobile Notifications</h4>
                  <p className="text-sm text-green-700">Automatic shift reminders and updates</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800">🔄 Conflict Resolution</h4>
                  <p className="text-sm text-purple-700">Automatically handles scheduling conflicts</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </ToolPageLayout>
      </div>
    </div>
  )
}
