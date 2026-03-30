import { type NextRequest, NextResponse } from "next/server"
import { aiGenerator } from "@/lib/ai-service"
import { DatabaseService } from "@/lib/database-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, idea, tone, audience, voice, userId, selectedCategories, selectedModel } = body

    if (!type || !idea || !tone || !audience || !voice || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const audienceStr = Array.isArray(audience) ? audience.join(", ") : audience
    const subcategories: string[] = selectedCategories?.[type] || []
    const targetSubs = subcategories.length ? subcategories : ["generic"]

    const savedContents = []

    for (const subId of targetSubs) {
      const pieces = await aiGenerator.generateIndividualContent(type, subId, {
        idea,
        tone,
        audience: audienceStr,
        voice,
        selectedModel,
      })

      if (!pieces || !pieces.length) {
        throw new Error(`Failed to generate ${subId} content`)
      }

      // Save each piece as its own row
      for (const piece of pieces) {
        const saved = await DatabaseService.createGeneratedContent({
          user_id: userId,
          content_type: type,
          subcategory: subId,
          title: piece.label,
          content: piece.content,
          prompt: idea,
          tone,
          audience: audienceStr,
          voice,
          generated_individually: true,
          generated_by: selectedModel?.label || "Llama 3.3 70B",
        })
        savedContents.push(saved)
      }
    }

    return NextResponse.json({
      success: true,
      contents: savedContents,
      message: `Successfully generated ${savedContents.length} content piece(s)!`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate content",
      },
      { status: 500 },
    )
  }
}
