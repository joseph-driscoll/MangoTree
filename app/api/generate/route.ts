import { type NextRequest, NextResponse } from "next/server"
import { aiGenerator } from "@/lib/ai-service"
import { DatabaseService } from "@/lib/database-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea, tone, audience, voice, selectedCategories, selectedModel, suiteName, userId } = body

    // Validate required fields
    if (!idea || !tone || !audience || !voice || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate all requested content with the AI service
    let generatedContent: any[] = []
    let hasErrors = false
    let errorMessage = ""

    try {
      generatedContent = await aiGenerator.generateAllCategories({
        idea,
        tone,
        audience,
        voice,
        selectedCategories,
        selectedModel,
      })
    } catch (aiError) {
      // If generation fails, store error content so user can retry
      hasErrors = true
      errorMessage = aiError instanceof Error ? aiError.message : "Failed to generate content with AI"
      
      // Create placeholder content with error message
      generatedContent = Object.entries(selectedCategories || {}).map(([category, subcats]) => ({
        category,
        subcategory: Array.isArray(subcats) ? subcats[0] : "general",
        pieces: [
          {
            label: `${category} Content (Error)`,
            content: `Error: ${errorMessage}`,
            type: "error",
          },
        ],
      }))
    }

    // Each piece becomes its own row in the DB
    const contentItems = []
    for (const subcategoryGroup of generatedContent) {
      for (const piece of subcategoryGroup.pieces) {
        contentItems.push({
          content_type: subcategoryGroup.category,
          subcategory: subcategoryGroup.subcategory,
          title: piece.label,
          content: piece.content,
          prompt: idea,
          tone,
          audience,
          voice,
        })
      }
    }

    // Persist to database
    const result = await DatabaseService.createContentSuite({
      user_id: userId,
      suite_name: suiteName || "Generated Content Suite",
      generated_by: selectedModel?.label || "Llama 3.3 70B (Fast & Free)",
      content_items: contentItems,
    })

    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors 
        ? `Generated content suite but encountered error: ${errorMessage}` 
        : `Generated ${contentItems.length} content groups with ${generatedContent.reduce((sum, group) => sum + group.pieces.length, 0)} total pieces`,
      suite_id: result.suite_id,
      projectId: result.suite_id,
      content: result.content,
      error: hasErrors ? errorMessage : undefined,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
