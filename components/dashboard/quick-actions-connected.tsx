"use client"

import type React from "react"
import {
  Sparkles,
  BookText,
  Calendar,
  CheckCircle2,
  Code,
  FileCode2,
  FileJson2,
  FileType,
  LayoutDashboard,
  ListChecks,
  Mail,
  MessageSquare,
  Pen,
  Search,
  Send,
  Settings,
  Sheet,
  ShoppingBag,
  User,
  Users,
} from "lucide-react"
import { QuickActions } from "./quick-actions"

interface QuickAction {
  type: string
  label: string
  icon: any
}

interface QuickActionsConnectedProps {
  handleQuickAction: (type: string) => void
}

/**
 * Connected version of QuickActions that can later be enhanced with
 * Supabase data, feature flags, etc. For now, it just renders the
 * presentational component.
 */
const QuickActionsConnected: React.FC<QuickActionsConnectedProps> = ({ handleQuickAction }) => {
  const quickActions: QuickAction[] = [
    { type: "blogPost", label: "Blog Post", icon: BookText },
    { type: "email", label: "Email", icon: Mail },
    { type: "tweet", label: "Tweet", icon: MessageSquare },
    { type: "productDescription", label: "Product Desc.", icon: ShoppingBag },
    { type: "adCopy", label: "Ad Copy", icon: Sparkles },
    { type: "socialMediaPost", label: "Social Post", icon: Send },
    { type: "websiteCopy", label: "Website Copy", icon: Code },
    { type: "article", label: "Article", icon: BookText },
    { type: "script", label: "Script", icon: Pen },
    { type: "outline", label: "Outline", icon: ListChecks },
    { type: "meetingAgenda", label: "Meeting Agenda", icon: Calendar },
    { type: "checklist", label: "Checklist", icon: CheckCircle2 },
    { type: "json", label: "JSON", icon: FileJson2 },
    { type: "typescript", label: "Typescript", icon: FileCode2 },
    { type: "csv", label: "CSV", icon: FileType },
    { type: "termsConditions", label: "T&C", icon: Sheet },
    { type: "userPersona", label: "User Persona", icon: User },
    { type: "teamBio", label: "Team Bio", icon: Users },
    { type: "settingsPage", label: "Settings Page", icon: Settings },
    { type: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { type: "searchQuery", label: "Search Query", icon: Search },
  ]

  return (
    <section className="space-y-6">
      {/* Section Title and Description */}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Quick Generate Individual Content</h3>
        <p className="text-sm sm:text-base text-gray-600">Create single pieces of content for specific needs</p>
      </div>

      {/* Quick Actions Grid */}
      <QuickActions />
    </section>
  )
}

export default QuickActionsConnected
export { QuickActionsConnected }
