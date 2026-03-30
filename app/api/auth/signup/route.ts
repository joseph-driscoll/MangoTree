import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json()

  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

  // Create the user already confirmed
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ user: data.user }, { status: 200 })
}
