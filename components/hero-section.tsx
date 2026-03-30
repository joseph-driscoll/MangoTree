"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Globe, Mail, MessageSquare, Star, FileText, PenTool } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth")
    }
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const contentTypes = [
    { icon: Globe, label: "Website Content", color: "text-blue-600" },
    { icon: Mail, label: "Email Campaigns", color: "text-green-600" },
    { icon: MessageSquare, label: "Social Media", color: "text-purple-600" },
    { icon: Star, label: "Review Responses", color: "text-orange-500" },
    { icon: FileText, label: "Product Listings", color: "text-red-500" },
    { icon: PenTool, label: "Blog Content", color: "text-indigo-600" },
    { icon: Zap, label: "Customer Messages", color: "text-pink-600" },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-blue-200 rounded-full opacity-20 animate-pulse delay-3000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-100 text-sm font-medium text-gray-700 mb-8 border border-green-200">
            <Sparkles className="w-4 h-4 mr-2 text-green-600" />
            Complete AI Content Generation Platform • 7 Content Types • Any Business
          </div>

          {/* Powerful Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The Only <span className="text-green-600">AI Content</span> Platform
            <br />
            Your Business Will Ever Need
          </h1>

          {/* Enhanced Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            From a single photo or idea, generate complete marketing campaigns across{" "}
            <span className="font-semibold text-green-600">7 content types</span> and{" "}
            <span className="font-semibold text-orange-500">every platform</span>. Website copy, email sequences, social
            posts, product listings, review responses, blog articles, and customer messages — all in your brand voice,
            instantly.
          </p>

          {/* Content Types Showcase */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            {contentTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md"
              >
                <type.icon className={`w-4 h-4 ${type.color}`} />
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {user ? "Go to Dashboard" : "Start Creating Content"}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>

            <Button
              onClick={handleLearnMore}
              size="lg"
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-10 py-4 text-xl font-semibold transition-all duration-300"
            >
              See All Features
            </Button>
          </div>

          {/* Enhanced Social Proof */}
          <div className="text-base text-gray-500 mb-20">
            Powering content creation for restaurants, retailers, agencies, SaaS companies, and entrepreneurs worldwide
          </div>

          {/* Enhanced Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center p-8 bg-white/70 rounded-3xl backdrop-blur-sm border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">7 Content Types, One Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Website content, email campaigns, social media, product listings, review responses, blog articles, and
                customer messages — all generated from a single input
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white/70 rounded-3xl backdrop-blur-sm border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl group">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Every Business, Every Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Restaurants, retail stores, service businesses, SaaS companies — optimized for Instagram, Facebook,
                LinkedIn, email, websites, and more
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white/70 rounded-3xl backdrop-blur-sm border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Marketing Suites</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate entire marketing campaigns with coordinated messaging across all channels, or create individual
                pieces for specific needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
