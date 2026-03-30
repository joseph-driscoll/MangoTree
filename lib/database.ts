// Database schema and types for Mango Tree
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  subscription: "free" | "pro" | "enterprise"
  defaultTone?: string
  defaultVoice?: string
  defaultAudience?: string
}

export interface Project {
  id: string
  userId: string
  name: string
  idea: string
  tone: string
  customTone?: string
  audience: string
  customAudience?: string
  voice: string
  status: "generating" | "completed" | "error"
  createdAt: Date
  updatedAt: Date
}

export interface ContentPiece {
  id: string
  projectId: string
  category: "website" | "email" | "social" | "messages" | "listings" | "reviews" | "blog"
  label: string
  content: string
  type: string
  isEdited: boolean
  rating?: "helpful" | "not_helpful"
  createdAt: Date
  updatedAt: Date
}

export interface GenerationJob {
  id: string
  projectId: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  error?: string
  createdAt: Date
  completedAt?: Date
}
