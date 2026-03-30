"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Settings, User, Bell, ChevronLeft, Plus, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Content Suites", href: "/dashboard/suites", icon: Layers },
  { name: "Content Orchard", href: "/dashboard/generated-content", icon: FileText },
  // { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved) setCollapsed(JSON.parse(saved))
    setMounted(true)
  }, [])

  const handleCollapse = (state: boolean) => {
    setCollapsed(state)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(state))
  }

  if (!mounted) {
    return <div className="w-64 bg-white border-r hidden lg:block sticky top-0 h-screen" />
  }

  return (
    <div
      className={cn(
        "bg-white border-r transition-all duration-300 hidden lg:block sticky top-0 h-screen",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-20 px-4 border-b flex items-center justify-between flex-shrink-0">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img src="/images/mango-tree-logo.png" alt="Mango Tree" className="w-10 h-10" />
              <span className="text-xl font-bold">
                <span className="text-orange-500">Mango</span>
                <span className="text-green-600">Tree</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <button
              onClick={() => handleCollapse(false)}
              className="h-10 w-10 mx-auto hover:opacity-75 transition-opacity"
            >
              <img src="/images/mango-tree-logo.png" alt="Expand sidebar" className="w-10 h-10 object-contain" />
            </button>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={() => handleCollapse(true)} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Generate */}
        {!collapsed && (
          <div className="p-4 flex-shrink-0">
            <Link href="/onboarding">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </Link>
          </div>
        )}

        {/* Main navigation */}
        <nav className="p-4 space-y-2 flex-shrink-0">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center p-3" : "space-x-3 px-3 py-2",
                  active ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="flex-1">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Secondary navigation */}
        <div className="px-4 flex-shrink-0">
          <hr className="border-gray-200 mb-4" />
          <div className="space-y-2">
            {secondaryNavigation.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center p-3" : "space-x-3 px-3 py-2",
                    active ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  )
}
