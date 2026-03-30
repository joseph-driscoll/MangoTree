import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentId = params.id

    console.log("🔍 Verifying content in database:", contentId)

    const { data, error } = await supabase.from("generated_content").select("*").eq("id", contentId).single()

    if (error) {
      console.error("❌ Failed to fetch content:", error)
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 })
    }

    console.log("✅ Current database content:", {
      id: data.id,
      type: data.type,
      updated_at: data.updated_at,
      contentPieces: Array.isArray(data.content) ? data.content.length : "not array",
      content: Array.isArray(data.content)
        ? data.content.map((p, i) => ({
            index: i,
            label: p.label,
            type: p.type,
            content: p.content?.substring(0, 100) + "...",
          }))
        : data.content,
    })

    return NextResponse.json({
      success: true,
      data: data,
      contentDetails: Array.isArray(data.content)
        ? data.content.map((p, i) => ({
            index: i,
            label: p.label,
            type: p.type,
            content: p.content,
          }))
        : data.content,
    })
  } catch (error) {
    console.error("❌ Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify content",
      },
      { status: 500 },
    )
  }
}
