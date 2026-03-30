"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TreePine, Mail, Lock, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ManualResetPage() {
  const [step, setStep] = useState<"email" | "code" | "password" | "success">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/manual-reset?step=password&email=${encodeURIComponent(email)}`,
      })

      if (error) throw error

      setStep("code")
    } catch (error: any) {
      console.error("Send code error:", error)
      setError(error.message || "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "recovery",
      })

      if (error) throw error
      if (!data.session) throw new Error("Failed to verify code")

      setStep("password")
    } catch (error: any) {
      console.error("Verify code error:", error)
      setError(error.message || "Invalid code")
    } finally {
      setIsLoading(false)
    }
  }

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
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setStep("success")
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

  // Check URL params on load
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get("step")
    const emailParam = params.get("email")

    if (stepParam === "password" && emailParam && step === "email") {
      setEmail(emailParam)
      setStep("password")
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "email" && "Enter your email to reset your password"}
            {step === "code" && "Enter the code sent to your email"}
            {step === "password" && "Enter your new password"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === "email" && "Request Reset"}
              {step === "code" && "Verify Code"}
              {step === "password" && "New Password"}
              {step === "success" && "Success"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "We'll send a code to your email"}
              {step === "code" && "Check your email for a verification code"}
              {step === "password" && "Choose a strong password"}
              {step === "success" && "Your password has been updated"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            )}

            {step === "code" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    required
                    className="text-center text-lg tracking-widest"
                    placeholder="Enter code from email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Back to email
                  </button>
                </div>
              </form>
            )}

            {step === "password" && (
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

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}

            {step === "success" && (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                <p className="text-gray-600 mb-4">Your password has been successfully updated.</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
