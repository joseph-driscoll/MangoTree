import { type NextRequest, NextResponse } from "next/server"
import { contentStorage } from "@/lib/content-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, content } = body

    if (!contentId || !content) {
      return NextResponse.json({ error: "Missing contentId or content" }, { status: 400 })
    }

    const updatedPiece = await contentStorage.updateContentPiece(contentId, content)

    return NextResponse.json({
      success: true,
      content: updatedPiece,
    })
  } catch (error) {
    console.error("Update API Error:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
