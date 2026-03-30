import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const projectId = params.projectId

  if (!projectId) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  // In the SELECT query, include generated_by
  const { data: content, error } = await supabase
    .from("generated_content")
    .select("id, content, type, prompt, tone, audience, voice, generated_by, created_at, updated_at")
    .eq("id", projectId)
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }

  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }

  return NextResponse.json(content)
}
