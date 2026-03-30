"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ShoppingBag, Mail, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { DatabaseService } from "@/lib/database-service"

interface IntegrationDialogProps {
  isOpen: boolean
  onClose: () => void
}

const integrations = [
  {
    id: "shopify",
    name: "Shopify",
    icon: ShoppingBag,
    description: "Connect your Shopify store",
    fields: [
      { key: "store_url", label: "Store URL", placeholder: "your-store.myshopify.com" },
      { key: "api_key", label: "API Key", placeholder: "Your Shopify API key" },
    ],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: Mail,
    description: "Sync with your email lists",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your Mailchimp API key" },
      { key: "list_id", label: "List ID", placeholder: "Default list ID" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    description: "Get notifications in Slack",
    fields: [{ key: "webhook_url", label: "Webhook URL", placeholder: "https://hooks.slack.com/..." }],
  },
]

export function IntegrationDialog({ isOpen, onClose }: IntegrationDialogProps) {
  const { user } = useAuth()
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    if (!user || !selectedIntegration) return

    setConnecting(true)
    try {
      await DatabaseService.createIntegration({
        user_id: user.id,
        platform: selectedIntegration,
        status: "connected",
        config: formData,
      })

      toast.success(`${integrations.find((i) => i.id === selectedIntegration)?.name} connected successfully!`)
      onClose()
      setSelectedIntegration(null)
      setFormData({})
    } catch (error) {
      console.error("Integration error:", error)
      toast.error("Failed to connect integration")
    } finally {
      setConnecting(false)
    }
  }

  const selectedIntegrationData = integrations.find((i) => i.id === selectedIntegration)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Integration</DialogTitle>
        </DialogHeader>

        {!selectedIntegration ? (
          <div className="space-y-3">
            {integrations.map((integration) => (
              <Card
                key={integration.id}
                className="cursor-pointer hover:border-green-300 transition-colors"
                onClick={() => setSelectedIntegration(integration.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {integration.icon && <integration.icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-4 border-b">
              {selectedIntegrationData && <selectedIntegrationData.icon className="h-6 w-6" />}
              <div>
                {selectedIntegrationData && <h3 className="font-medium">{selectedIntegrationData.name}</h3>}
                {selectedIntegrationData && (
                  <p className="text-sm text-gray-500">{selectedIntegrationData.description}</p>
                )}
              </div>
            </div>

            {selectedIntegrationData &&
              selectedIntegrationData.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedIntegration(null)
                  setFormData({})
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleConnect}
                disabled={connecting || !Object.values(formData).every((v) => v.trim())}
                className="bg-green-600 hover:bg-green-700"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
