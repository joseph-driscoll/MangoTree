import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Content generation completed",
    message: "Your product descriptions for Summer Collection are ready to review",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    title: "Low inventory alert",
    message: "Summer dresses are running low (3 units remaining)",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "Weekly report available",
    message: "Your performance summary for this week is ready",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "success",
    title: "Review campaign successful",
    message: "15 new reviews received from your latest campaign",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 5,
    type: "info",
    title: "New feature available",
    message: "Employee Scheduler beta is now available for testing",
    time: "2 days ago",
    unread: false,
  },
]

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-orange-50 border-orange-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with your latest activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>{notifications.filter((n) => n.unread).length} unread notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.unread ? getBgColor(notification.type) : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            {notification.unread && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
