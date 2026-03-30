import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Settings, HelpCircle } from "lucide-react"

const actions = [
  {
    icon: Upload,
    title: "Generate Product Description",
    description: "Upload a photo to create compelling product copy",
    action: "Upload Photo",
  },
  {
    icon: Plus,
    title: "Create Review Campaign",
    description: "Set up automated review requests for recent orders",
    action: "Start Campaign",
  },
  {
    icon: Settings,
    title: "Configure Integrations",
    description: "Connect Shopify, WooCommerce, or other platforms",
    action: "Add Integration",
  },
  {
    icon: HelpCircle,
    title: "Get Help",
    description: "Access tutorials and support resources",
    action: "View Docs",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to grow your retail business</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <action.icon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
              <Button size="sm" variant="outline">
                {action.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
