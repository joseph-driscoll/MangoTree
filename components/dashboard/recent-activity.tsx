import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Mail, MessageSquare, Star, FileText, PenTool, Zap, TrendingUp, Users, Target } from "lucide-react"

const activities = [
  {
    icon: Globe,
    title: "Website content suite generated",
    description: "Complete landing page for Summer Collection launch",
    time: "2 minutes ago",
    status: "success",
    type: "Website Content",
  },
  {
    icon: Mail,
    title: "Email campaign sequence created",
    description: "5-part welcome series for new subscribers",
    time: "8 minutes ago",
    status: "success",
    type: "Email Marketing",
  },
  {
    icon: Star,
    title: "Review responses generated",
    description: "Professional replies for 12 customer reviews",
    time: "15 minutes ago",
    status: "success",
    type: "Review Management",
  },
  {
    icon: MessageSquare,
    title: "Social media campaign launched",
    description: "Instagram, Facebook, and LinkedIn posts for product launch",
    time: "32 minutes ago",
    status: "info",
    type: "Social Media",
  },
  {
    icon: FileText,
    title: "Product listings optimized",
    description: "25 e-commerce descriptions updated with SEO keywords",
    time: "1 hour ago",
    status: "success",
    type: "Product Listings",
  },
  {
    icon: PenTool,
    title: "Blog article series created",
    description: "3-part how-to guide for industry expertise",
    time: "2 hours ago",
    status: "success",
    type: "Blog Content",
  },
  {
    icon: Zap,
    title: "Customer support templates generated",
    description: "Automated responses for common inquiries",
    time: "3 hours ago",
    status: "warning",
    type: "Customer Messages",
  },
  {
    icon: TrendingUp,
    title: "Content performance insights",
    description: "Social media posts showing 340% engagement increase",
    time: "4 hours ago",
    status: "info",
    type: "Analytics",
  },
  {
    icon: Users,
    title: "Team collaboration update",
    description: "3 team members contributed to marketing campaign",
    time: "5 hours ago",
    status: "info",
    type: "Team Activity",
  },
  {
    icon: Target,
    title: "Multi-platform campaign completed",
    description: "Coordinated content across all 7 content types",
    time: "6 hours ago",
    status: "success",
    type: "Campaign Suite",
  },
]

export function RecentActivity() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest content generation and platform updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.status === "success"
                    ? "bg-green-100"
                    : activity.status === "info"
                      ? "bg-blue-100"
                      : "bg-orange-100"
                }`}
              >
                <activity.icon
                  className={`h-4 w-4 ${
                    activity.status === "success"
                      ? "text-green-600"
                      : activity.status === "info"
                        ? "text-blue-600"
                        : "text-orange-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {activity.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-tight mb-1">{activity.description}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
