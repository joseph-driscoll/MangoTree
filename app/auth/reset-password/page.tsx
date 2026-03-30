"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TreePine, Lock, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isValidSession, setIsValidSession] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const { updatePassword } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Handle URL fragments from password reset email
    const handleAuthCallback = async () => {
      try {
        console.log("Full URL:", window.location.href)
        console.log("Hash:", window.location.hash)

        // Get the URL hash
        const hash = window.location.hash.substring(1)
        const hashParams = new URLSearchParams(hash)

        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")
        const expiresAt = hashParams.get("expires_at")

        console.log("Parsed tokens:", {
          accessToken: accessToken?.substring(0, 20) + "...",
          refreshToken: refreshToken?.substring(0, 20) + "...",
          type,
          expiresAt,
        })

        setDebugInfo(
          `Type: ${type}, Has Access Token: ${!!accessToken}, Has Refresh Token: ${!!refreshToken}, Expires: ${expiresAt}`,
        )

        if (type === "recovery" && accessToken && refreshToken) {
          // Check if token is expired
          const expiresAtTime = expiresAt ? Number.parseInt(expiresAt) * 1000 : 0
          const now = Date.now()

          if (expiresAtTime && now > expiresAtTime) {
            setError("Reset link has expired. Please request a new password reset.")
            return
          }

          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          console.log("Session result:", { data: !!data.session, error })

          if (error) {
            console.error("Session error:", error)
            setError(`Session error: ${error.message}. Please request a new password reset.`)
          } else if (data.session) {
            console.log("Session established for password reset")
            setIsValidSession(true)
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname)
          } else {
            setError("Could not establish session. Please request a new password reset.")
          }
        } else if (hash) {
          // We have a hash but it's not a recovery type
          setError(`Invalid reset link format. Type: ${type}. Please request a new password reset.`)
        } else {
          // No hash at all - user navigated directly
          setError("No reset token found. Please use the link from your email or request a new password reset.")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setError(`Error processing reset link: ${error}. Please request a new password reset.`)
      }
    }

    // Small delay to ensure the page is fully loaded
    setTimeout(handleAuthCallback, 100)
  }, [])

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Password update error:", error)
      setError(error.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">
              <span className="text-orange-500">Mango</span>
              <span className="text-green-600">Tree</span>
            </span>
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
              <p className="text-gray-600 mb-4">Your password has been successfully updated.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">
              <span className="text-orange-500">Mango</span>
              <span className="text-green-600">Tree</span>
            </span>
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying reset link...</p>
              {debugInfo && <p className="text-xs text-gray-400 mt-2">{debugInfo}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Mango</span>
              <span className="text-green-600">Tree</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>Choose a strong password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                {debugInfo && (
                  <Alert>
                    <AlertDescription>
                      <strong>Debug Info:</strong> {debugInfo}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-center space-y-2">
                  <Link href="/auth" className="block text-sm text-blue-600 hover:text-blue-800">
                    ← Back to sign in
                  </Link>
                  <p className="text-xs text-gray-500">
                    Need a new reset link? Go to sign in and click "Forgot your password?"
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      required
                      className="pl-10"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      className="pl-10"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {!error && (
          <div className="text-center">
            <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
