"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignIn = () => {
    router.push("/auth")
  }

  const handleDashboard = () => {
    router.push("/dashboard/suites")
  }

  const handleSignOut = async () => {
    if (isSigningOut) return // Prevent double clicks

    setIsSigningOut(true)

    try {
      await signOut()

      // Force page reload to clear all state
      window.location.href = "/"
    } catch (error) {
      // Force redirect even if there's an error
      window.location.href = "/"
    } finally {
      setIsSigningOut(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false) // Close mobile menu after navigation
  }

  // Get user's first name from user metadata or email
  const getUserDisplayName = () => {
    if (!user) return "Account"

    // Try to get name from user metadata
    const name = user.user_metadata?.name || user.user_metadata?.full_name
    if (name) {
      // Return first name only
      return name.split(" ")[0]
    }

    // Fallback to email prefix if no name
    return user.email?.split("@")[0] || "Account"
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/mango-tree-logo.png" alt="Mango Tree" className="w-10 h-10" />
              <span className="text-4xl font-bold">
                <span className="text-orange-500">Mango</span>
                <span className="text-green-600">Tree</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Solutions
            </button>
            {/* <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Pricing
            </button> */}
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      <User className="h-4 w-4 mr-2" />
                      {getUserDisplayName()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer focus:bg-gray-100">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="cursor-pointer focus:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={handleDashboard}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Generate Content
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSignIn}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignIn}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("solutions")}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                Solutions
              </button>
              {/* <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                Pricing
              </button> */}
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                About
              </button>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        handleDashboard()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Generate Content
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full"
                      variant="outline"
                      disabled={isSigningOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        handleSignIn()
                        setIsMenuOpen(false)
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignIn()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
