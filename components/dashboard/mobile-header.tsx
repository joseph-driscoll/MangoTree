"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { FileText, Settings, User, Bell, Plus, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Content Suites", href: "/dashboard/suites", icon: Layers },
  { name: "Generated Content", href: "/dashboard/generated-content", icon: FileText, badge: "Main" },
  // { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

const bottomNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

export function MobileHeader() {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Quick Generate Button */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/onboarding">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-center px-6 py-3">
            <Plus className="h-4 w-4 mr-2" />
            GENERATE CONTENT
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-6 py-4 border-t space-y-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-between lg:hidden p-4 bg-white border-b">
      {/* Logo on the left */}
      <Link href="/" className="flex items-center space-x-2">
        <img src="/images/mango-tree-logo.png" alt="Mango Tree" className="w-10 h-10" />
        <span className="text-4xl font-bold">
          <span className="text-orange-500">Mango</span>
          <span className="text-green-600">Tree</span>
        </span>
      </Link>

      {/* Burger menu on the right */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 w-full sm:max-w-md">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </div>
  )
}
