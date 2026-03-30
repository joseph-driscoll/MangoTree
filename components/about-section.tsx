import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Zap, Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">About Mango Tree</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about helping retail businesses grow through the power of AI-driven content creation. Our
            mission is to make professional marketing accessible to every business owner.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer-Focused</h3>
              <p className="text-gray-600">Every feature we build is designed with our customers' success in mind.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Results-Driven</h3>
              <p className="text-gray-600">We measure our success by the growth and success of your business.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">We leverage cutting-edge AI technology to solve real business problems.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-gray-600">We believe in building a supportive community of successful retailers.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-green-50 rounded-2xl p-8 lg:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
            <p className="text-lg text-gray-700 mb-6">
              Founded by retail entrepreneurs who understood the challenges of creating compelling marketing content,
              Mango Tree was born from the need to democratize professional marketing. We've helped thousands of
              businesses transform their marketing efforts and achieve sustainable growth.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-600">Businesses Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
                <div className="text-gray-600">Content Pieces Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
