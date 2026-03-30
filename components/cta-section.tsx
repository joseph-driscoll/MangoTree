import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TreePine, Sparkles, TrendingUp, Shield } from "lucide-react"

export function CTASection() {
  return (
    <>
      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <Card className="border-2 border-green-500 bg-white shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TreePine className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Ready to create?</p>
                    <p className="text-sm text-gray-600">Start generating now</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <a href="/onboarding">
                      Create
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>

      {/* Main CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <Card className="border-2 border-green-200 bg-green-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/30 rounded-full translate-y-24 -translate-x-24" />

            <CardContent className="p-12 text-center relative z-10">
              <div className="flex justify-center mb-6">
                <TreePine className="h-16 w-16 text-green-600" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-600">
                Your Next Marketing Campaign Starts Here
              </h2>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses creating compelling content in seconds. Whether you're a restaurant, retail
                store, agency, or anything in between — your perfect marketing content is just one click away.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-12 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <a href="/onboarding">
                    Start Creating Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 text-lg px-8 py-6"
                >
                  See Live Demo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span>Free to try</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Shield className="h-5 w-5 text-orange-500" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Instant results</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
