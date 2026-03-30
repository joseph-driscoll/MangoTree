// Supabase client - simple singleton pattern
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single client instance
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface GeneratedContent {
  id: string
  user_id: string
  type: string
  content: any
  prompt: string
  tone: string
  audience: string
  voice: string
  created_at: string
}

export interface Campaign {
  id: string
  user_id: string
  name: string
  type: string
  settings: any
  status: string
  created_at: string
}

export interface Integration {
  id: string
  user_id: string
  platform: string
  status: string
  config: any
  created_at: string
}

export interface UploadedImage {
  id: string
  user_id: string
  image_url: string
  metadata: any
  used_in_content_id?: string
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  preferences: any
  notifications: any
  created_at: string
}
