import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Quote, Users, Building, Rocket } from "lucide-react"

const solutions = [
  {
    title: "Solo Creator",
    subtitle: "Perfect for Individual Entrepreneurs",
    description:
      "You're running your business solo and need professional content fast. Generate complete marketing campaigns from a single photo or idea. Get website copy, social posts, email sequences, product descriptions, and more — all in your unique brand voice.",
    features: [
      "All 7 content types included",
      "Unlimited individual content generation",
      "Complete marketing suites",
      "Multi-platform optimization",
      "Brand voice training",
      "Export to any format",
    ],
    price: "$29/month",
    badge: "Most Popular",
    icon: Zap,
    testimonial: "Generated a month's worth of professional content in 30 minutes. Game changer for my business.",
    includes: "Everything you need to scale content creation",
    userType: "Solo entrepreneurs, freelancers, small business owners",
  },
  {
    title: "Team Powerhouse",
    subtitle: "For Growing Companies & Marketing Teams",
    description:
      "Your team needs to collaborate on content while maintaining brand consistency. Advanced workflow tools, team permissions, shared brand libraries, and priority integrations with your existing marketing stack.",
    features: [
      "Everything in Solo Creator",
      "Team collaboration tools",
      "Shared brand libraries",
      "Advanced integrations",
      "Priority support",
      "Usage analytics & insights",
    ],
    price: "$79/month",
    badge: "Best for Teams",
    icon: Users,
    testimonial: "Our entire marketing team collaborates seamlessly. Brand consistency across all our content.",
    includes: "All features + advanced team tools",
    userType: "Marketing teams, agencies, growing companies",
  },
  {
    title: "Enterprise Command",
    subtitle: "Custom Solutions & White-Label Options",
    description:
      "Large-scale operations need enterprise-grade solutions. Custom integrations, white-label options, dedicated support, unlimited usage across all brands and locations, and advanced security features.",
    features: [
      "Everything in Team Powerhouse",
      "White-label platform options",
      "Custom integrations & API access",
      "Dedicated account management",
      "Advanced security & compliance",
      "Multi-brand management",
    ],
    price: "Custom",
    badge: "Enterprise",
    icon: Building,
    testimonial: "Scaled content creation across 50+ locations with complete brand control and compliance.",
    includes: "Fully customized enterprise solution",
    userType: "Large retailers, franchise systems, enterprise companies",
  },
]

const businessTypes = [
  { name: "Restaurants", icon: "🍽️", description: "Menu descriptions, social posts, review responses" },
  { name: "Retail Stores", icon: "🛍️", description: "Product listings, email campaigns, social content" },
  { name: "Service Businesses", icon: "🔧", description: "Service descriptions, customer communications, blogs" },
  { name: "SaaS Companies", icon: "💻", description: "Feature descriptions, onboarding emails, help content" },
  { name: "E-commerce", icon: "📦", description: "Product pages, marketplace listings, customer support" },
  { name: "Agencies", icon: "🎯", description: "Client content, case studies, proposal materials" },
]

export function SolutionsSection() {
  return (
    <section id="solutions" className="py-24 px-4 bg-green-50">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">Scale Content Creation at Any Size</h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From solo entrepreneurs to enterprise teams — choose the solution that matches your ambition and watch your
            content creation transform. Every plan includes all 7 content types and unlimited possibilities.
          </p>
        </div>

        {/* Business Types */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Built for Every Type of Business</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {businessTypes.map((business, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/70 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-2xl mb-2">{business.icon}</div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">{business.name}</h4>
                <p className="text-xs text-gray-600 leading-tight">{business.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="border-2 hover:border-green-300 transition-all duration-300 hover:shadow-2xl group relative overflow-hidden flex flex-col h-full"
            >
              {solution.badge && (
                <Badge className="absolute top-6 right-6 bg-green-600 text-white z-10">
                  {solution.badge}
                </Badge>
              )}

              <CardHeader className="pb-6 relative">
                <solution.icon className="h-12 w-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl mb-2">{solution.title}</CardTitle>
                <CardDescription className="text-green-600 font-semibold text-lg">{solution.subtitle}</CardDescription>
                <div className="text-sm text-gray-500 mt-2">{solution.userType}</div>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow">
                <div className="space-y-6 flex-grow">
                  <p className="text-gray-600 leading-relaxed">{solution.description}</p>

                  {/* Testimonial */}
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start space-x-2">
                      <Quote className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-green-800 italic">{solution.testimonial}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t mt-auto">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900">{solution.price}</div>
                    {solution.price !== "Custom" && <div className="text-gray-500">per month</div>}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-lg transition-all">
                    {solution.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 max-w-3xl mx-auto">
            <Rocket className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Content Creation?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of businesses already using Mango Tree to create professional content in seconds, not
              hours.
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
