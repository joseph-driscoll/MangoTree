import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  MessageSquare,
  Star,
  Calendar,
  BarChart3,
  Share2,
  ArrowRight,
  Zap,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react"

const tools = [
  {
    icon: FileText,
    title: "Product Description Generator",
    description: "Generate compelling product descriptions from photos",
    status: "Active",
    usage: "247 generated this month",
    color: "text-green-600",
    bgColor: "bg-green-50",
    statusIcon: CheckCircle,
    statusColor: "text-green-600",
    action: "Generate More",
  },
  {
    icon: Star,
    title: "Smart Reviews",
    description: "Auto-generate review requests and drafts",
    status: "Active",
    usage: "89 reviews collected",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    statusIcon: CheckCircle,
    statusColor: "text-green-600",
    action: "View Campaign",
  },
  {
    icon: MessageSquare,
    title: "Customer Follow-up",
    description: "AI-powered customer communication",
    status: "In Progress",
    usage: "1,234 messages sent",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    statusIcon: Play,
    statusColor: "text-blue-600",
    action: "Finish Setup",
  },
  {
    icon: BarChart3,
    title: "Retail Insights",
    description: "AI-powered analytics and alerts",
    status: "Active",
    usage: "12 insights this week",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    statusIcon: CheckCircle,
    statusColor: "text-green-600",
    action: "View Insights",
  },
  {
    icon: Calendar,
    title: "Employee Scheduler",
    description: "Smart shift scheduling and management",
    status: "Paused",
    usage: "Ready to activate",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    statusIcon: Pause,
    statusColor: "text-gray-500",
    action: "Activate",
  },
  {
    icon: Share2,
    title: "Content Orchard",
    description: "Multi-channel content generation",
    status: "Coming Soon",
    usage: "Available Q2 2024",
    color: "text-green-600",
    bgColor: "bg-green-50",
    statusIcon: null,
    statusColor: "text-gray-500",
    action: "Join Waitlist",
  },
]

export function AIToolsGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-6 w-6 text-green-600 mr-2" />
          Your AI Tools
        </CardTitle>
        <CardDescription>Manage and monitor your retail AI automation tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <Card key={index} className="border hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    {tool.statusIcon && <tool.statusIcon className={`h-4 w-4 ${tool.statusColor}`} />}
                    <Badge
                      variant={tool.status === "Active" ? "default" : "secondary"}
                      className={
                        tool.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : tool.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : ""
                      }
                    >
                      {tool.status}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{tool.usage}</span>
                  <Button
                    size="sm"
                    variant={tool.status === "In Progress" ? "default" : "ghost"}
                    className={`transition-opacity ${
                      tool.status === "In Progress"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    disabled={tool.status === "Coming Soon"}
                  >
                    {tool.action}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
