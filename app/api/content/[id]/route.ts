import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase.from("generated_content").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, content: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { pieceIndex, content: newContent } = body

    console.log("📝 PATCH request:", {
      id: params.id,
      pieceIndex,
      hasNewContent: !!newContent,
      contentPreview: typeof newContent === "string" ? newContent.substring(0, 50) + "..." : "not string",
    })

    // Get the existing content
    const { data: existingContent, error: fetchError } = await supabase
      .from("generated_content")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      console.error("❌ Failed to fetch existing content:", fetchError)
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 })
    }

    if (!Array.isArray(existingContent.content)) {
      console.error("❌ Content is not an array")
      return NextResponse.json({ success: false, error: "Invalid content structure" }, { status: 400 })
    }

    // Update the specific piece if pieceIndex is provided
    if (typeof pieceIndex === "number" && pieceIndex >= 0 && pieceIndex < existingContent.content.length) {
      console.log(`🎯 Updating piece at index ${pieceIndex}`)

      const updatedContent = [...existingContent.content]
      const oldPiece = updatedContent[pieceIndex]

      // Update the piece with new content and mark as edited
      updatedContent[pieceIndex] = {
        ...oldPiece,
        content: newContent,
        edited: true,
        edited_at: new Date().toISOString(),
        // Preserve regeneration status if it exists
        regenerated: oldPiece?.regenerated || false,
        regenerated_at: oldPiece?.regenerated_at || null,
      }

      console.log("🔄 Piece update:", {
        oldContent: oldPiece?.content?.substring(0, 30) + "...",
        newContent: newContent.substring(0, 30) + "...",
        edited: true,
        regenerated: oldPiece?.regenerated || false,
      })

      // Save to database
      const { data: dbResult, error: updateError } = await supabase
        .from("generated_content")
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)
        .select()
        .single()

      if (updateError) {
        console.error("❌ Database update failed:", updateError)
        return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 })
      }

      console.log("✅ Content piece updated and marked as edited!")

      return NextResponse.json({
        success: true,
        content: dbResult,
        message: "Content updated successfully",
      })
    } else {
      console.error("❌ Invalid piece index:", {
        pieceIndex,
        contentLength: existingContent.content.length,
      })
      return NextResponse.json({ success: false, error: "Invalid piece index" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ PATCH API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update content",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log("📝 PUT request for content update:", {
      id: params.id,
      hasPrompt: !!body.prompt,
      hasTone: !!body.tone,
      hasVoice: !!body.voice,
      hasAudience: !!body.audience,
      hasSuiteName: !!body.suite_name,
      contentPieces: Array.isArray(body.content) ? body.content.length : 0,
    })

    // Validate required fields
    if (!body.prompt || !Array.isArray(body.content)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: prompt and content",
        },
        { status: 400 },
      )
    }

    // Update the content in the database
    const { data: updatedContent, error: updateError } = await supabase
      .from("generated_content")
      .update({
        prompt: body.prompt,
        tone: body.tone || null,
        voice: body.voice || null,
        audience: body.audience || null,
        suite_name: body.suite_name || null,
        content: body.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Database update failed:", updateError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update content",
        },
        { status: 500 },
      )
    }

    console.log("✅ Content updated successfully!")

    return NextResponse.json({
      success: true,
      content: updatedContent,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("❌ PUT API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update content",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("generated_content").delete().eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to delete content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Content deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
