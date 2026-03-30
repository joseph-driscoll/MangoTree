"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Sparkles, Loader2, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { DatabaseService } from "@/lib/database-service"

export function DescriptionGenerator() {
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    tone: "friendly",
    audience: "general",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
      } else {
        toast.error("Please select an image file")
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate content")
      return
    }

    if (!selectedFile && !formData.description) {
      toast.error("Please upload an image or provide a description")
      return
    }

    setIsGenerating(true)

    try {
      // Upload image if provided
      let imageRecord = null
      if (selectedFile) {
        imageRecord = await DatabaseService.uploadImage(selectedFile, user.id)
      }

      // Generate content
      const content = [
        {
          label: "Product Title",
          content: `${formData.productName || "Premium Product"} - High Quality Solution`,
          type: "title",
        },
        {
          label: "Short Description",
          content: `Experience the difference with our ${
            formData.productName || "premium product"
          }. Designed with quality and performance in mind.`,
          type: "description",
        },
        {
          label: "Long Description",
          content: `Introducing our ${
            formData.productName || "premium product"
          } - the perfect solution for discerning customers who demand the best. Crafted with attention to detail and using only the finest materials, this product delivers exceptional performance and reliability.

${formData.description || "This product features innovative design and premium materials."}

Whether you're a professional or enthusiast, you'll appreciate the thoughtful features and superior craftsmanship that sets this product apart from the competition.`,
          type: "description",
        },
        {
          label: "Key Features",
          content:
            "• Premium quality\n• Innovative design\n• Exceptional performance\n• Reliable and durable\n• Customer satisfaction guaranteed",
          type: "bullets",
        },
      ]

      await DatabaseService.createGeneratedContent({
        user_id: user.id,
        type: "listings",
        content,
        prompt: formData.description || `Generate content for ${formData.productName}`,
        tone: formData.tone,
        audience: formData.audience,
        voice: "conversational",
      })

      toast.success("Product description generated successfully!")

      // Reset form
      setSelectedFile(null)
      setFormData({
        productName: "",
        description: "",
        tone: "friendly",
        audience: "general",
      })
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Generate Product Description</CardTitle>
        <CardDescription>Upload a photo or provide details to create compelling product descriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            placeholder="e.g. Organic Cotton T-Shirt"
          />
        </div>

        <div className="space-y-2">
          <Label>Product Image (Optional)</Label>
          {selectedFile ? (
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                <Button variant="outline" size="sm" onClick={() => document.getElementById("fileInput")?.click()}>
                  Select File
                </Button>
                <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Product Details (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your product features, materials, benefits, etc."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                <SelectItem value="professional">Professional & Polished</SelectItem>
                <SelectItem value="luxury">Luxury & Premium</SelectItem>
                <SelectItem value="playful">Playful & Fun</SelectItem>
                <SelectItem value="minimal">Minimal & Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Consumers</SelectItem>
                <SelectItem value="luxury">Luxury Shoppers</SelectItem>
                <SelectItem value="budget">Budget-Conscious Buyers</SelectItem>
                <SelectItem value="eco">Eco-Conscious Consumers</SelectItem>
                <SelectItem value="tech">Tech Enthusiasts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (!selectedFile && !formData.description && !formData.productName)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
