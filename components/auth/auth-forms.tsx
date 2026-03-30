"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, Lock, User, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useAuth } from "./auth-provider"

export function AuthForms() {
  /* ---------------------------------------------------------------------
     Local state
  --------------------------------------------------------------------- */
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)

  const [signInData, setSignInData] = useState({ email: "", password: "" })
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [resetEmail, setResetEmail] = useState("")

  /* ---------------------------------------------------------------------
     Hooks
  --------------------------------------------------------------------- */
  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  /* ---------------------------------------------------------------------
     Handlers
  --------------------------------------------------------------------- */
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn(signInData.email.trim(), signInData.password)
      router.push("/dashboard/suites") // land on Content Suites
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)
      setError("")
      setSuccess("")

      try {
        // ① create the user
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signUpData.email.trim(),
            password: signUpData.password,
            name: signUpData.name,
          }),
        })

        const body = await res.json()
        if (!res.ok) throw new Error(body.error || "Failed to sign up")

        // ② immediate sign-in
        await signIn(signUpData.email.trim(), signUpData.password)
        router.push("/dashboard/suites")
      } catch (err: any) {
        setError(err.message || "Failed to sign up")
      } finally {
        setIsLoading(false)
      }
    },
    [signUpData, signIn, router],
  )

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await resetPassword(resetEmail)
      setSuccess("Password reset email sent! Check your inbox.")
      setShowResetForm(false)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------------------------------------------------------------
     Render helpers
  --------------------------------------------------------------------- */
  const BrandLogo = () => (
    <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
      <Image src="/images/mango-tree-logo.png" alt="Mango Tree" width={32} height={32} className="rounded-lg" />
      <span className="text-2xl font-bold">
        <span className="text-orange-500">Mango</span>
        <span className="text-green-600">Tree</span>
      </span>
    </Link>
  )

  /* ---------------------------------------------------------------------
     JSX
  --------------------------------------------------------------------- */
  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <BrandLogo />
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your email and we’ll send a reset link.</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      required
                      className="pl-10"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending…" : "Send Reset Email"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setShowResetForm(false)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <BrandLogo />
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create a new account</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* ---------------- Sign In ---------------- */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={signInData.email}
                        onChange={(e) =>
                          setSignInData((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        required
                        className="pl-10"
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) =>
                          setSignInData((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in…" : "Sign In"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Sign Up ---------------- */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        required
                        className="pl-10"
                        placeholder="Jane Doe"
                        value={signUpData.name}
                        onChange={(e) =>
                          setSignUpData((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={signUpData.email}
                        onChange={(e) =>
                          setSignUpData((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        minLength={6}
                        className="pl-10"
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) =>
                          setSignUpData((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating…" : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
