import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Mail, MessageSquare, Star, FileText, PenTool, Zap, Sparkles, Target, Layers } from "lucide-react"

const contentTypes = [
  {
    icon: Globe,
    title: "Website Content",
    description:
      "Landing pages, product descriptions, about pages, service descriptions — SEO-optimized and conversion-focused",
    badge: "SEO Ready",
    color: "text-blue-600",
    examples: ["Product pages", "Service descriptions", "About sections", "Landing pages"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Welcome sequences, promotional campaigns, newsletters, follow-ups — personalized for your audience",
    badge: "High Converting",
    color: "text-green-600",
    examples: ["Welcome series", "Product launches", "Newsletters", "Re-engagement"],
  },
  {
    icon: MessageSquare,
    title: "Social Media Content",
    description: "Instagram posts, Facebook ads, LinkedIn articles, TikTok captions — optimized for each platform",
    badge: "Multi-Platform",
    color: "text-purple-600",
    examples: ["Instagram posts", "Facebook ads", "LinkedIn content", "Twitter threads"],
  },
  {
    icon: Star,
    title: "Review Responses",
    description:
      "Professional responses to customer reviews — maintain your reputation with thoughtful, branded replies",
    badge: "Reputation Management",
    color: "text-orange-500",
    examples: ["5-star thank you", "Issue resolution", "Professional responses", "Brand voice"],
  },
  {
    icon: FileText,
    title: "Product Listings",
    description: "E-commerce descriptions, marketplace listings, catalog content — compelling copy that sells",
    badge: "Sales Focused",
    color: "text-red-500",
    examples: ["Amazon listings", "Shopify products", "Marketplace copy", "Catalog descriptions"],
  },
  {
    icon: PenTool,
    title: "Blog Content",
    description: "Industry articles, how-to guides, thought leadership, SEO content — establish your expertise",
    badge: "Authority Building",
    color: "text-indigo-600",
    examples: ["How-to guides", "Industry insights", "Case studies", "SEO articles"],
  },
  {
    icon: Zap,
    title: "Customer Messages",
    description:
      "Support responses, sales outreach, follow-up messages — maintain consistent, professional communication",
    badge: "Customer Success",
    color: "text-pink-600",
    examples: ["Support tickets", "Sales outreach", "Follow-ups", "Onboarding"],
  },
]

const platformFeatures = [
  {
    icon: Target,
    title: "Smart Business Intelligence",
    description: "AI understands your industry, audience, and goals to create perfectly targeted content",
    badge: "AI-Powered",
    color: "text-green-600",
  },
  {
    icon: Layers,
    title: "Complete Content Suites",
    description: "Generate coordinated campaigns across all 7 content types with consistent messaging and branding",
    badge: "Campaign Ready",
    color: "text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Instant Multi-Format",
    description: "One input creates content optimized for every platform — Instagram, email, website, ads, and more",
    badge: "Universal Output",
    color: "text-orange-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">7 Content Types. Infinite Possibilities.</h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From a single photo, description, or idea, generate professional content across every channel your business
            needs. Each piece is optimized for its platform and perfectly aligned with your brand voice.
          </p>
        </div>

        {/* Content Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {contentTypes.map((type, index) => (
            <Card
              key={index}
              className="border-2 hover:border-green-200 transition-all duration-300 hover:shadow-xl group h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <type.icon className={`h-8 w-8 ${type.color} group-hover:scale-110 transition-transform`} />
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {type.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {type.description}
                </CardDescription>
                <div className="space-y-1">
                  {type.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                      {example}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Features */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Powered by Advanced AI Intelligence</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform doesn't just generate content — it understands your business, audience, and goals to create
            content that actually converts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-xl group text-center p-8"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-green-100 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <div className="flex items-center justify-center mb-3">
                  <h4 className="text-xl font-bold text-gray-900 mr-3">{feature.title}</h4>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {feature.badge}
                  </Badge>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
