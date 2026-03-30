import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Star, FileText, MessageSquare, Users } from "lucide-react"

const stats = [
  {
    title: "Products Generated",
    value: "247",
    change: "+23%",
    trend: "up",
    icon: FileText,
    color: "text-green-600",
  },
  {
    title: "Customer Reviews",
    value: "89",
    change: "+156%",
    trend: "up",
    icon: Star,
    color: "text-orange-500",
  },
  {
    title: "Auto Responses",
    value: "1,234",
    change: "+45%",
    trend: "up",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center text-sm">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
