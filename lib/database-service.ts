import { supabase } from "./supabase"

// Actual DB schema for generated_content:
// id, user_id, project_id, content_type, subcategory, title, content (text),
// tone, audience, keywords, model, generated_by, is_favorite,
// created_at, updated_at, suite_id, suite_name, generated_individually, prompt, voice

export class DatabaseService {
  // ---------- User helpers ----------
  private static async ensureUserExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle()

      if (error) return false
      if (data) return true

      // Try to create the user from auth session
      const { data: authData } = await supabase.auth.getSession()
      const authUser = authData?.session?.user
      if (!authUser || authUser.id !== userId) return false

      await supabase.from("users").upsert({
        id: authUser.id,
        email: authUser.email!,
        full_name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
      }, { onConflict: "id" })

      return true
    } catch {
      return false
    }
  }

  // ---------- Content creation ----------
  static async createContentSuite(data: {
    user_id: string
    suite_name: string
    generated_by?: string
    content_items: Array<{
      content_type: string
      subcategory?: string
      title?: string
      content: string          // plain text
      prompt: string
      tone: string
      audience: string | string[]
      voice: string
    }>
  }) {
    await DatabaseService.ensureUserExists(data.user_id)

    const suiteId = crypto.randomUUID()
    const savedContent = []

    const audienceStr = Array.isArray(data.content_items[0]?.audience)
      ? (data.content_items[0].audience as string[]).join(", ")
      : (data.content_items[0]?.audience as string) || ""

    for (const item of data.content_items) {
      const audience = Array.isArray(item.audience)
        ? item.audience.join(", ")
        : item.audience || ""

      const row = {
        user_id: data.user_id,
        suite_id: suiteId,
        suite_name: data.suite_name,
        generated_individually: false,
        content_type: item.content_type,
        subcategory: item.subcategory || "general",
        title: item.title || item.subcategory || item.content_type,
        content: item.content,
        prompt: item.prompt,
        tone: item.tone,
        audience,
        voice: item.voice,
        generated_by: data.generated_by || "Llama 3.3 70B",
      }

      const { data: result, error } = await supabase
        .from("generated_content")
        .insert(row)
        .select()
        .single()

      if (error) {
        console.error("DB insert error:", error.message)
        continue
      }
      savedContent.push(result)
    }

    return { suite_id: suiteId, suite_name: data.suite_name, content: savedContent }
  }

  static async createGeneratedContent(data: {
    user_id: string
    content_type: string
    subcategory?: string
    title?: string
    content: string
    prompt: string
    tone: string
    audience: string | string[]
    voice: string
    generated_individually?: boolean
    generated_by?: string
  }) {
    await DatabaseService.ensureUserExists(data.user_id)

    const audience = Array.isArray(data.audience)
      ? data.audience.join(", ")
      : data.audience || ""

    const row = {
      user_id: data.user_id,
      suite_id: null,
      suite_name: null,
      generated_individually: data.generated_individually ?? true,
      content_type: data.content_type,
      subcategory: data.subcategory || "general",
      title: data.title || data.subcategory || data.content_type,
      content: data.content,
      prompt: data.prompt,
      tone: data.tone,
      audience,
      voice: data.voice,
      generated_by: data.generated_by || "Llama 3.3 70B",
    }

    const { data: result, error } = await supabase
      .from("generated_content")
      .insert(row)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return result
  }

  // ---------- Content retrieval ----------
  static async getUserGeneratedContent(userId: string, contentType?: string, limit = 50, offset = 0) {
    try {
      let query = supabase
        .from("generated_content")
        .select("id, content_type, subcategory, title, content, created_at, prompt, tone, audience, voice, suite_id, suite_name, generated_individually, generated_by, is_favorite")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (contentType) query = query.eq("content_type", contentType)

      const { data, error } = await query
      if (error) throw error

      const rows = data || []

      // Group suite rows by suite_id
      const suitesMap: Record<string, any> = {}
      const individual: any[] = []

      rows.forEach((item) => {
        if (item.suite_id && !item.generated_individually) {
          if (!suitesMap[item.suite_id]) {
            suitesMap[item.suite_id] = {
              suite_id: item.suite_id,
              suite_name: item.suite_name,
              created_at: item.created_at,
              content: [],
            }
          }
          suitesMap[item.suite_id].content.push(item)
        } else {
          individual.push(item)
        }
      })

      return {
        suites: Object.values(suitesMap),
        individual,
        all: rows,
        hasMore: rows.length === limit,
        total: rows.length,
      }
    } catch {
      return { suites: [], individual: [], all: [], hasMore: false, total: 0 }
    }
  }

  static async getUserContentCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from("generated_content")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
      if (error) return 0
      return count || 0
    } catch {
      return 0
    }
  }

  // ---------- Update / Delete ----------
  static async updateGeneratedContent(
    contentId: string,
    data: {
      content?: string
      title?: string
      prompt?: string
      tone?: string
      audience?: string | string[]
      voice?: string
      suite_name?: string
      generated_by?: string
    },
  ) {
    const updateData: any = { ...data, updated_at: new Date().toISOString() }
    if (data.audience !== undefined) {
      updateData.audience = Array.isArray(data.audience)
        ? data.audience.join(", ")
        : data.audience
    }

    const { data: result, error } = await supabase
      .from("generated_content")
      .update(updateData)
      .eq("id", contentId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return result
  }

  static async deleteGeneratedContent(contentId: string) {
    const { error } = await supabase.from("generated_content").delete().eq("id", contentId)
    if (error) throw new Error(error.message)
    return true
  }

  static async deleteContentSuite(suiteId: string) {
    const { error } = await supabase.from("generated_content").delete().eq("suite_id", suiteId)
    if (error) throw new Error(error.message)
    return true
  }

  static async toggleFavorite(contentId: string, isFavorite: boolean) {
    const { data: result, error } = await supabase
      .from("generated_content")
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq("id", contentId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return result
  }

  // ---------- Stats ----------
  static async getGeneratedContentStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from("generated_content")
        .select("content_type, created_at, audience, suite_id, generated_individually, generated_by")
        .eq("user_id", userId)

      if (error) throw error
      const rows = data || []

      const now = new Date()
      return {
        total: rows.length,
        thisMonth: rows.filter((i) => {
          const d = new Date(i.created_at)
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length,
        byType: rows.reduce((acc, i) => {
          acc[i.content_type] = (acc[i.content_type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byAudience: rows.reduce((acc, i) => {
          if (i.audience) {
            i.audience.split(",").map((a: string) => a.trim()).filter(Boolean).forEach((a: string) => {
              acc[a] = (acc[a] || 0) + 1
            })
          }
          return acc
        }, {} as Record<string, number>),
        suites: rows.filter((i) => i.suite_id && !i.generated_individually).length,
        individual: rows.filter((i) => i.generated_individually).length,
      }
    } catch {
      return { total: 0, thisMonth: 0, byType: {}, byAudience: {}, suites: 0, individual: 0 }
    }
  }

  static async getDashboardStats(userId: string) {
    const stats = await this.getGeneratedContentStats(userId)
    return {
      contentGenerated: stats.thisMonth,
      totalContent: stats.total,
      activeCampaigns: 0,
      connectedIntegrations: 0,
      contentByType: stats.byType,
      contentByAudience: stats.byAudience,
      contentSuites: stats.suites,
      individualContent: stats.individual,
    }
  }
}
