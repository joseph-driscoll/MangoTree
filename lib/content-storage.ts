"use client"

import type { Project, ContentPiece, GeneratedContent } from "./database"

// Mock storage service - replace with actual database calls
export class ContentStorageService {
  private projects: Map<string, Project> = new Map()
  private contentPieces: Map<string, ContentPiece[]> = new Map()

  async saveProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const id = crypto.randomUUID()
    const now = new Date()

    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.projects.set(id, newProject)
    return newProject
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id)
    if (!existing) throw new Error("Project not found")

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    }

    this.projects.set(id, updated)
    return updated
  }

  async saveGeneratedContent(projectId: string, generatedContent: GeneratedContent[]): Promise<ContentPiece[]> {
    const contentPieces: ContentPiece[] = []

    for (const categoryContent of generatedContent) {
      for (const piece of categoryContent.pieces) {
        const contentPiece: ContentPiece = {
          id: crypto.randomUUID(),
          projectId,
          category: categoryContent.category as any,
          label: piece.label,
          content: piece.content,
          type: piece.type,
          isEdited: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        contentPieces.push(contentPiece)
      }
    }

    this.contentPieces.set(projectId, contentPieces)
    return contentPieces
  }

  async getProjectContent(projectId: string): Promise<ContentPiece[]> {
    return this.contentPieces.get(projectId) || []
  }

  async updateContentPiece(id: string, content: string): Promise<ContentPiece> {
    // Find and update the content piece
    for (const [projectId, pieces] of this.contentPieces.entries()) {
      const pieceIndex = pieces.findIndex((p) => p.id === id)
      if (pieceIndex !== -1) {
        pieces[pieceIndex] = {
          ...pieces[pieceIndex],
          content,
          isEdited: true,
          updatedAt: new Date(),
        }
        return pieces[pieceIndex]
      }
    }
    throw new Error("Content piece not found")
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter((p) => p.userId === userId)
  }
}

export const contentStorage = new ContentStorageService()
