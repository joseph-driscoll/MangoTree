import { type NextRequest, NextResponse } from "next/server"
import { aiGenerator, contentSubcategories } from "@/lib/ai-service"
import { DatabaseService } from "@/lib/database-service"

// Map piece type to category
const TYPE_TO_CATEGORY: Record<string, string> = {
  subject: "email",
  email: "email",
  headline: "website",
  subheadline: "website",
  paragraph: "website",
  button: "website",
  social: "social",
  hashtags: "social",
  message: "messages",
  title: "listings",
  description: "listings",
  response: "reviews",
  bullets: "blog",
}

export async function POST(request: NextRequest) {
  try {
    const { contentId, type, subcategory, prompt, tone, audience, voice, newPrompt, selectedModel } =
      await request.json()

    // Map piece type to real category
    let category = type
    if (!Object.keys(contentSubcategories).includes(category)) {
      category = TYPE_TO_CATEGORY[type] || type
    }

    if (!contentId || !category || !prompt) {
      return NextResponse.json(
        { success: false, error: "contentId, category and prompt are required" },
        { status: 400 },
      )
    }

    // Generate new content using the AI service
    const ideaToUse = newPrompt || prompt
    let newPieces

    if (subcategory) {
      newPieces = await aiGenerator.generateIndividualContent(category, subcategory, {
        idea: ideaToUse,
        tone: tone || "professional",
        audience: audience || "general",
        voice: voice || "professional",
        selectedModel,
      })
    } else {
      const suites = await aiGenerator.generateAllCategories({
        idea: ideaToUse,
        tone: tone || "professional",
        audience: audience || "general",
        voice: voice || "professional",
        selectedCategories: { [category]: ["general"] },
        selectedModel,
      })
      newPieces = suites?.[0]?.pieces ?? []
    }

    // Update the content in database
    if (newPieces[0]?.content) {
      await DatabaseService.updateGeneratedContent(contentId, {
        content: newPieces[0].content,
        model: selectedModel?.label || "Llama 3.3 70B",
      })
    }

    return NextResponse.json({
      success: true,
      newPieces,
      newModel: selectedModel?.label ?? "Llama 3.3 70B",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Failed to regenerate: ${error instanceof Error ? error.message : "Unknown error"}`,
    })
  }
}
