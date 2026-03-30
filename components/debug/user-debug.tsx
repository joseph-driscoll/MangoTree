"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"
import { syncAuthUserToPublicUsers } from "@/lib/user-sync"

export function UserDebug() {
  const { user, syncUser } = useAuth()
  const [publicUser, setPublicUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)

  const checkPublicUser = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking public user:", error)
        setPublicUser({ error: error.message })
      } else {
        setPublicUser(data)
      }
    } catch (error) {
      console.error("Error:", error)
      setPublicUser({ error: "Failed to check user" })
    }
  }

  const handleSyncUser = async () => {
    setLoading(true)
    try {
      const result = await syncAuthUserToPublicUsers()
      setSyncResult(result)
      await checkPublicUser() // Refresh the public user data
    } catch (error) {
      setSyncResult({ success: false, error: "Sync failed" })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      checkPublicUser()
    }
  }, [user])

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Debug</CardTitle>
          <CardDescription>No authenticated user found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Auth User (from auth.users)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name,
                created_at: user.created_at,
                email_confirmed_at: user.email_confirmed_at,
              },
              null,
              2,
            )}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public User (from public.users)</CardTitle>
          <CardDescription>
            {publicUser ? "User found in public.users table" : "User NOT found in public.users table"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(publicUser || "No user found", null, 2)}
          </pre>
          <div className="mt-4 space-x-2">
            <Button onClick={checkPublicUser} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleSyncUser} disabled={loading}>
              {loading ? "Syncing..." : "Sync User to Public Table"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {syncResult && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(syncResult, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
