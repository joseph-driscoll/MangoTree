import { supabase } from "./supabase"

// Simple debounce - only sync once per user per session
const syncedUsers = new Set<string>()

export async function syncAuthUserToPublicUsers() {
  // Don't run on server side
  if (typeof window === 'undefined') {
    return { success: false, skipLog: true }
  }

  try {
    // Get session directly instead of calling getUser (avoids extra API call)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return { success: false, skipLog: true }
    }

    const authUser = session.user

    // Skip if already synced this session
    if (syncedUsers.has(authUser.id)) {
      return { success: true, skipLog: true }
    }

    // Mark as synced immediately to prevent race conditions
    syncedUsers.add(authUser.id)

    // Check if user already exists in public.users
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle()

    if (existingUser) {
      return { success: true }
    }

    // Create user in public.users
    await supabase
      .from("users")
      .upsert({
        id: authUser.id,
        email: authUser.email!,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      }, { onConflict: 'id' })

    return { success: true }
  } catch {
    // Silently fail - user sync is not critical
    return { success: false, skipLog: true }
  }
}
