"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MobileMenuContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  // Close menu when route changes (for seamless UX)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return <MobileMenuContext.Provider value={{ isOpen, setIsOpen, toggleMenu }}>{children}</MobileMenuContext.Provider>
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider")
  }
  return context
}
