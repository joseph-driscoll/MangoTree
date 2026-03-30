import { generateText } from "ai"
import { createXai } from "@ai-sdk/xai"

export interface ModelConfig {
  model: string
  label: string
}

// Use xAI Grok models - fast and reliable
export const availableModels: ModelConfig[] = [
  { model: "grok-3-fast", label: "Grok 3 Fast (Quick Generation)" },
  { model: "grok-3", label: "Grok 3 (Best Quality)" },
]

export interface GenerationRequest {
  idea: string
  tone: string
  customTone?: string
  audience: string
  customAudience?: string
  voice: string
  category: string
  subcategories?: string[]
  selectedModel?: ModelConfig
}

export interface GeneratedContent {
  category: string
  subcategory: string
  pieces: Array<{
    label: string
    content: string
    type: string
  }>
}

interface GenerationParams {
  idea: string
  tone: string
  audience: string
  voice: string
  subcategories?: string[]
  selectedModel?: ModelConfig
}

interface ContentPiece {
  label: string
  content: string
  type: string
}

interface CategoryContent {
  pieces: ContentPiece[]
}

// Content subcategories for each main category - CONSISTENT IDs for both wizards
export const contentSubcategories = {
  website: [
    { id: "hero", label: "Hero Section", description: "Main headline, subheadline, and hero description" },
    { id: "about", label: "About Page", description: "Company story, mission, and values" },
    { id: "features", label: "Features & Benefits", description: "Product features and benefit descriptions" },
    { id: "testimonials", label: "Testimonials", description: "Customer testimonial templates" },
    { id: "faq", label: "FAQ Section", description: "Frequently asked questions and answers" },
    { id: "call-to-action", label: "Call to Action", description: "Various CTA buttons and action prompts" }, // Updated name and ID
    { id: "product", label: "Product Descriptions", description: "Detailed product page content" },
    { id: "landing", label: "Landing Pages", description: "Conversion-focused landing page copy" },
    { id: "footer", label: "Footer Content", description: "Footer links, legal, and contact info" },
    { id: "navigation", label: "Navigation & Menus", description: "Menu items and navigation labels" },
  ],
  email: [
    { id: "welcome", label: "Welcome Series", description: "New subscriber welcome emails" },
    { id: "promotional", label: "Promotional", description: "Sales and promotional campaigns" },
    { id: "newsletter", label: "Newsletter", description: "Regular newsletter content" },
    { id: "abandoned", label: "Abandoned Cart", description: "Cart recovery email sequences" },
    { id: "followup", label: "Follow-up", description: "Post-purchase and engagement emails" },
    { id: "announcement", label: "Announcements", description: "Product launches and company news" },
    { id: "educational", label: "Educational", description: "Tips, tutorials, and how-to content" },
    { id: "seasonal", label: "Seasonal", description: "Holiday and seasonal campaigns" },
  ],
  social: [
    { id: "posts", label: "Regular Posts", description: "Daily social media content" },
    { id: "stories", label: "Stories", description: "Instagram/Facebook story content" },
    { id: "promotional", label: "Promotional Posts", description: "Product and service promotions" },
    { id: "educational", label: "Educational", description: "Tips, facts, and how-to posts" },
    { id: "engagement", label: "Engagement", description: "Questions, polls, and interactive content" },
    { id: "behind-scenes", label: "Behind the Scenes", description: "Company culture and process content" },
    { id: "user-generated", label: "User-Generated", description: "Customer spotlight and UGC prompts" },
    { id: "trending", label: "Trending Topics", description: "Current events and trending hashtags" },
  ],
  messages: [
    { id: "welcome", label: "Welcome Messages", description: "New customer welcome messages" },
    { id: "support", label: "Customer Support", description: "Help desk and support responses" },
    { id: "sales", label: "Sales Outreach", description: "Cold outreach and sales messages" },
    { id: "followup", label: "Follow-up", description: "Check-in and follow-up messages" },
    { id: "appointment", label: "Appointment", description: "Booking and scheduling messages" },
    { id: "feedback", label: "Feedback Requests", description: "Review and feedback collection" },
    { id: "thank-you", label: "Thank You", description: "Appreciation and gratitude messages" },
    { id: "referral", label: "Referral", description: "Referral program messages" },
  ],
  listings: [
    { id: "product", label: "Product Listings", description: "E-commerce product descriptions" },
    { id: "service", label: "Service Listings", description: "Service offering descriptions" },
    { id: "marketplace", label: "Marketplace", description: "Third-party marketplace listings" },
    { id: "classified", label: "Classified Ads", description: "Craigslist and classified ad copy" },
    { id: "directory", label: "Directory", description: "Business directory listings" },
    { id: "real-estate", label: "Real Estate", description: "Property listing descriptions" },
    { id: "job", label: "Job Postings", description: "Employment opportunity descriptions" },
    { id: "event", label: "Event Listings", description: "Event and workshop descriptions" },
  ],
  reviews: [
    { id: "positive", label: "Positive Response", description: "Thank you responses to good reviews" },
    { id: "negative", label: "Negative Response", description: "Professional responses to criticism" },
    { id: "neutral", label: "Neutral Response", description: "Responses to neutral feedback" },
    { id: "request", label: "Review Requests", description: "Asking customers for reviews" },
    { id: "follow-up", label: "Review Follow-up", description: "Following up on review responses" },
    { id: "incentive", label: "Review Incentives", description: "Encouraging reviews with offers" },
  ],
  blog: [
    { id: "how-to", label: "How-To Guides", description: "Step-by-step tutorial content" },
    { id: "listicle", label: "List Articles", description: "Top 10, best of, and list-style posts" },
    { id: "case-study", label: "Case Studies", description: "Customer success stories and examples" },
    { id: "industry", label: "Industry News", description: "Industry trends and news commentary" },
    { id: "behind-scenes", label: "Behind the Scenes", description: "Company culture and process posts" },
    { id: "educational", label: "Educational", description: "Teaching and informational content" },
    { id: "opinion", label: "Opinion Pieces", description: "Thought leadership and opinion articles" },
    { id: "seasonal", label: "Seasonal Content", description: "Holiday and seasonal blog posts" },
  ],
}

export class AIContentGenerator {
  private xaiClient = createXai({ apiKey: process.env.XAI_API_KEY_REAL })

  private async generateContent(prompt: string, modelConfig?: ModelConfig, isRetry = false): Promise<string> {
    const selectedModel = modelConfig || availableModels[0]
    
    try {
      const { text } = await generateText({
        model: this.xaiClient(selectedModel.model),
        prompt: `You are a professional copywriter. ${prompt}

IMPORTANT: Return ONLY the requested content. Do not include any prefixes, explanations, or meta-commentary. Do not say "Here is..." or "Generated content for..." - just provide the actual content requested.`,
        temperature: 0.7,
        maxTokens: 1000,
      })

      return text.trim()
    } catch (error) {
      // Only retry once with a different model
      if (!isRetry && error instanceof Error) {
        const fallbackModel = availableModels[1] || availableModels[0]
        if (fallbackModel.model !== selectedModel.model) {
          return this.generateContent(prompt, fallbackModel, true)
        }
      }

      if (error instanceof Error) {
        if (error.message.includes("API key") || error.message.includes("Unauthorized")) {
          throw new Error("AI API key not configured or invalid")
        }
        if (error.message.includes("quota")) {
          throw new Error("AI API quota exceeded")
        }
        if (error.message.includes("rate limit")) {
          throw new Error("AI API rate limit exceeded")
        }
      }

      throw new Error("Failed to generate content with AI")
    }
  }

  async generateIndividualContent(
    category: string,
    subcategory: string,
    params: GenerationParams,
  ): Promise<ContentPiece[]> {
    try {
      switch (category) {
        case "website":
          return this.generateWebsiteSubcategory(subcategory, params)
        case "email":
          return this.generateEmailSubcategory(subcategory, params)
        case "social":
          return this.generateSocialSubcategory(subcategory, params)
        case "messages":
          return this.generateMessagesSubcategory(subcategory, params)
        case "listings":
          return this.generateListingsSubcategory(subcategory, params)
        case "reviews":
          return this.generateReviewsSubcategory(subcategory, params)
        case "blog":
          return this.generateBlogSubcategory(subcategory, params)
        default:
          throw new Error(`Unknown category: ${category}`)
      }
    } catch (error) {
      console.error(`Failed to generate ${subcategory} content:`, error)
      return [
        {
          label: `${subcategory} Content (Error)`,
          content: `Unable to generate ${subcategory} content. Please try again.`,
          type: "paragraph",
        },
      ]
    }
  }

  private async generateWebsiteSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params



    switch (subcategory) {
      case "hero":
        const [headline, subheadline, heroDesc] = await Promise.all([
          this.generateContent(
            `Write a powerful main headline for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          Create a catchy, memorable headline that captures their unique personality. Make it bold and attention-grabbing. Focus specifically on what this business does based on the description: "${idea}"`,
            selectedModel,
          ),
          this.generateContent(
            `Write a supporting subheadline for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          This should complement the main headline and provide more detail about their services. Focus specifically on what this business does based on the description: "${idea}"`,
            selectedModel,
          ),
          this.generateContent(
            `Write a hero section description for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          Write 2-3 sentences that explain what makes them special and why customers should choose them. Focus specifically on what this business does based on the description: "${idea}"`,
            selectedModel,
          ),
        ])
        return [
          { label: "Main Headline", content: headline, type: "headline" },
          { label: "Subheadline", content: subheadline, type: "subheadline" },
          { label: "Hero Description", content: heroDesc, type: "paragraph" },
        ]

      case "call-to-action": // Updated case name
        const [primaryCTAButtons, secondaryCTAButtons, urgencyCTAButtons] = await Promise.all([
          this.generateContent(
            `Write 3-4 primary call-to-action button texts for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          
          Make them action-oriented and compelling. Think about what primary actions you want customers to take based on what this business does: "${idea}"
          
          Format as a bullet list:
          • [Button text 1]
          • [Button text 2]
          • [Button text 3]
          • [Button text 4]`,
            selectedModel,
          ),
          this.generateContent(
            `Write 3-4 secondary call-to-action button texts for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          
          These should be less aggressive than primary CTAs, maybe for learning more, viewing services, or getting information about what this business does: "${idea}"
          
          Format as a bullet list:
          • [Button text 1]
          • [Button text 2]
          • [Button text 3]
          • [Button text 4]`,
            selectedModel,
          ),
          this.generateContent(
            `Write a short urgency blurb for this business: ${idea}

  Tone: ${tone}
  Audience: ${audience}

  Create a compelling 1-2 sentence urgency statement about promotions, limited availability, or time-sensitive offers related to what this business does: "${idea}". This should motivate immediate action.

  Return as a short paragraph, not a bulleted list.`,
            selectedModel,
          ),
        ])
        return [
          { label: "Primary CTA Buttons", content: primaryCTAButtons, type: "bullets" },
          { label: "Secondary CTA Buttons", content: secondaryCTAButtons, type: "bullets" },
          { label: "Urgency CTA Blurb", content: urgencyCTAButtons, type: "paragraph" },
        ]

      case "faq":
        const faqContent = await this.generateContent(
          `Write 5 frequently asked questions and answers for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Format as:
        Q: [Question]
        A: [Answer]
        
        Cover topics relevant to what this business does based on: "${idea}"`,
          selectedModel,
        )
        return [{ label: "FAQ Section", content: faqContent, type: "faq" }]

      case "about":
        const [aboutTitle, aboutStory, mission] = await Promise.all([
          this.generateContent(
            `Write an "About Us" page title for this business: ${idea}
          
          Tone: ${tone}
          Voice: ${voice}
          
          Make it personal and emphasize what makes this business special based on: "${idea}"`,
            selectedModel,
          ),
          this.generateContent(
            `Write an "About Us" story for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          Tell their story based on what this business does: "${idea}". Make it personal and trustworthy.`,
            selectedModel,
          ),
          this.generateContent(
            `Write a mission statement for this business: ${idea}
          
          Tone: ${tone}
          Voice: ${voice}
          
          Focus on their commitment to what they do based on: "${idea}"`,
            selectedModel,
          ),
        ])
        return [
          { label: "About Page Title", content: aboutTitle, type: "title" },
          { label: "Company Story", content: aboutStory, type: "paragraph" },
          { label: "Mission Statement", content: mission, type: "paragraph" },
        ]

      case "product":
        const [productTitle, productDesc, productFeatures] = await Promise.all([
          this.generateContent(
            `Write a product/service title for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          
          Make it clear and compelling based on what they offer: "${idea}"`,
            selectedModel,
          ),
          this.generateContent(
            `Write a detailed product/service description for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          Explain what they offer and why it's valuable based on: "${idea}"`,
            selectedModel,
          ),
          this.generateContent(
            `Write key features/benefits for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          
          List 3-5 key features or benefits as bullet points based on what they do: "${idea}"`,
            selectedModel,
          ),
        ])
        return [
          { label: "Service Title", content: productTitle, type: "title" },
          { label: "Service Description", content: productDesc, type: "description" },
          { label: "Key Features", content: productFeatures, type: "bullets" },
        ]

      default:
        const defaultContent = await this.generateContent(
          `Create ${subcategory} content for this business: ${idea}
          
          Tone: ${tone}
          Audience: ${audience}
          Voice: ${voice}
          
          Generate appropriate content for ${subcategory} based on what this business does: "${idea}". Return ONLY the content text, no quotes or extra formatting.`,
          selectedModel,
        )
        return [
          {
            label: `${subcategory} Content`,
            content: defaultContent.trim(),
            type: "paragraph",
          },
        ]
    }
  }

  private async generateEmailSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params

    const [subject, body] = await Promise.all([
      this.generateContent(
        `Create an email subject line for a ${subcategory} email about this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it compelling and relevant to ${subcategory} for what this business does: "${idea}". Return ONLY the subject line text, no quotes or extra formatting.`,
        selectedModel,
      ),
      this.generateContent(
        `Write an email body for a ${subcategory} email about this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it engaging and appropriate for ${subcategory} based on what this business does: "${idea}". Include a natural call-to-action. Return ONLY the email body text, no quotes or extra formatting.`,
        selectedModel,
      ),
    ])

    return [
      { label: `${subcategory} Subject Line`, content: subject.trim(), type: "subject" },
      { label: `${subcategory} Email Body`, content: body.trim(), type: "email" },
    ]
  }

  private async generateSocialSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params

    const [post, hashtags] = await Promise.all([
      this.generateContent(
        `Create a ${subcategory} social media post for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it engaging and appropriate for ${subcategory} based on what this business does: "${idea}". Return ONLY the post content, no quotes or extra formatting.`,
        selectedModel,
      ),
      this.generateContent(
        `Generate relevant hashtags for a ${subcategory} post about this business: ${idea}
        
        Audience: ${audience}
        
        Provide 5-8 hashtags relevant to what this business does: "${idea}". Return as a single line with hashtags separated by spaces. Return ONLY the hashtags, no quotes or extra formatting.`,
        selectedModel,
      ),
    ])

    return [
      { label: `${subcategory} Post`, content: post.trim(), type: "social" },
      { label: "Hashtags", content: hashtags.trim(), type: "hashtags" },
    ]
  }

  private async generateMessagesSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params

    const message = await this.generateContent(
      `Create a ${subcategory} message for this business: ${idea}
      
      Tone: ${tone}
      Audience: ${audience}
      Voice: ${voice}
      
      Make it personal and appropriate for ${subcategory} based on what this business does: "${idea}". Return ONLY the message content, no quotes or extra formatting.`,
      selectedModel,
    )

    return [{ label: `${subcategory} Message`, content: message.trim(), type: "message" }]
  }

  private async generateListingsSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params

    const [title, description] = await Promise.all([
      this.generateContent(
        `Create a ${subcategory} listing title for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it compelling and descriptive based on what this business does: "${idea}". Return ONLY the title text, no quotes or extra formatting.`,
        selectedModel,
      ),
      this.generateContent(
        `Write a ${subcategory} listing description for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it detailed and persuasive based on what this business does: "${idea}". Return ONLY the description text, no quotes or extra formatting.`,
        selectedModel,
      ),
    ])

    return [
      { label: `${subcategory} Title`, content: title.trim(), type: "title" },
      { label: `${subcategory} Description`, content: description.trim(), type: "description" },
    ]
  }

  private async generateReviewsSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, voice, selectedModel } = params

    const response = await this.generateContent(
      `Create a ${subcategory} review response for this business: ${idea}
      
      Tone: ${tone}
      Voice: ${voice}
      
      Make it professional and appropriate for ${subcategory} reviews based on what this business does: "${idea}". Return ONLY the response text, no quotes or extra formatting.`,
      selectedModel,
    )

    return [{ label: `${subcategory} Review Response`, content: response.trim(), type: "response" }]
  }

  private async generateBlogSubcategory(subcategory: string, params: GenerationParams): Promise<ContentPiece[]> {
    const { idea, tone, audience, voice, selectedModel } = params

    const [title, intro, outline] = await Promise.all([
      this.generateContent(
        `Create a ${subcategory} blog post title for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Make it SEO-friendly and engaging based on what this business does: "${idea}". Return ONLY the title text, no quotes or extra formatting.`,
        selectedModel,
      ),
      this.generateContent(
        `Write a ${subcategory} blog post introduction for this business: ${idea}
        
        Tone: ${tone}
        Audience: ${audience}
        Voice: ${voice}
        
        Hook the reader and set up the main points based on what this business does: "${idea}". Write 2-3 paragraphs. Return ONLY the introduction text, no quotes or extra formatting.`,
        selectedModel,
      ),
      this.generateContent(
        `Create a ${subcategory} blog post outline for this business: ${idea}
        
        Audience: ${audience}
        
        Provide 4-6 main sections relevant to what this business does: "${idea}". Format as numbered list. Return ONLY the outline text, no quotes or extra formatting.`,
        selectedModel,
      ),
    ])

    return [
      { label: `${subcategory} Blog Title`, content: title.trim(), type: "title" },
      { label: "Introduction", content: intro.trim(), type: "paragraph" },
      { label: "Post Outline", content: outline.trim(), type: "bullets" },
    ]
  }

  // The main method that generates all categories - NOW GENERATES MULTIPLE PIECES LIKE INDIVIDUAL WIZARD
  async generateAllCategories(params: {
    idea: string
    tone: string
    audience: string
    voice: string
    selectedCategories?: { [key: string]: string[] }
    selectedModel?: ModelConfig
  }): Promise<GeneratedContent[]> {
    const { selectedCategories } = params
    const results: GeneratedContent[] = []

    // Validate the selected model - if it has old format or doesn't exist in availableModels, use default
    let validModel = availableModels[0]
    if (params.selectedModel?.model) {
      const foundModel = availableModels.find(m => m.model === params.selectedModel?.model)
      if (foundModel) {
        validModel = foundModel
      }
    }
    
    if (selectedCategories) {
      // Generate only selected categories with their subcategories
      for (const [category, subcategories] of Object.entries(selectedCategories)) {
        if (subcategories.length > 0) {
          try {
            // Generate content for each subcategory separately
            for (const subcategory of subcategories) {
              const subcategoryContent = await this.generateIndividualContent(category, subcategory, {
                ...params,
                selectedModel: validModel,
              })

              results.push({
                category,
                subcategory, // Use the same subcategory ID
                pieces: subcategoryContent, // Multiple pieces just like individual wizard
              })
            }
          } catch {
            results.push({
              category,
              subcategory: "error",
              pieces: [
                {
                  label: `${category} Content (Error)`,
                  content: `Unable to generate ${category} content at this time.`,
                  type: "paragraph",
                },
              ],
            })
          }
        }
      }
    } else {
      // Fallback to default subcategories for each category
      const defaultCategories = {
        website: ["hero", "about", "features"],
        email: ["promotional"],
        social: ["posts"],
        messages: ["welcome"],
        listings: ["product"],
        reviews: ["positive"],
        blog: ["how-to"],
      }

      for (const [category, defaultSubs] of Object.entries(defaultCategories)) {
        try {
          for (const subcategory of defaultSubs) {
            const subcategoryContent = await this.generateIndividualContent(category, subcategory, {
              ...params,
              selectedModel: validModel,
            })

            results.push({
              category,
              subcategory,
              pieces: subcategoryContent,
            })
          }
        } catch {
          results.push({
            category,
            subcategory: "error",
            pieces: [
              {
                label: `${category} Content (Error)`,
                content: `Unable to generate ${category} content at this time.`,
                type: "paragraph",
              },
            ],
          })
        }
      }
    }

    console.log(`🎉 Content generation complete! Generated ${results.length} subcategory groups`)
    return results
  }
}

// Export a singleton instance
export const aiGenerator = new AIContentGenerator()
