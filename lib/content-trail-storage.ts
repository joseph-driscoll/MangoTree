interface ContentTrailItem {
  id: string
  pieceIndex?: number
  action: "edited" | "regenerated"
  timestamp: number
  model?: string
  previousContent?: string
  newContent?: string
}

interface ContentTrail {
  [contentId: string]: {
    [pieceIndex: string]: ContentTrailItem[]
  }
}

const STORAGE_KEY = "mango_content_trail"

export class ContentTrailStorage {
  private static getTrail(): ContentTrail {
    if (typeof window === "undefined") return {}

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to parse content trail from localStorage:", error)
      return {}
    }
  }

  private static saveTrail(trail: ContentTrail): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trail))
    } catch (error) {
      console.error("Failed to save content trail to localStorage:", error)
    }
  }

  static addTrailItem(
    contentId: string,
    pieceIndex: number | undefined,
    action: "edited" | "regenerated",
    options: {
      model?: string
      previousContent?: string
      newContent?: string
    } = {},
  ): void {
    const trail = this.getTrail()
    const pieceKey = pieceIndex !== undefined ? pieceIndex.toString() : "content"

    if (!trail[contentId]) {
      trail[contentId] = {}
    }

    if (!trail[contentId][pieceKey]) {
      trail[contentId][pieceKey] = []
    }

    const trailItem: ContentTrailItem = {
      id: `${contentId}-${pieceKey}-${Date.now()}`,
      pieceIndex,
      action,
      timestamp: Date.now(),
      ...options,
    }

    trail[contentId][pieceKey].push(trailItem)

    // Keep only the last 10 items per piece to prevent storage bloat
    if (trail[contentId][pieceKey].length > 10) {
      trail[contentId][pieceKey] = trail[contentId][pieceKey].slice(-10)
    }

    this.saveTrail(trail)
  }

  static getTrailForContent(contentId: string, pieceIndex?: number): ContentTrailItem[] {
    const trail = this.getTrail()
    const pieceKey = pieceIndex !== undefined ? pieceIndex.toString() : "content"

    return trail[contentId]?.[pieceKey] || []
  }

  static getTrailSummary(
    contentId: string,
    pieceIndex?: number,
  ): {
    hasEdits: boolean
    hasRegenerations: boolean
    lastAction?: "edited" | "regenerated"
    lastModel?: string
    actionCount: number
  } {
    const trailItems = this.getTrailForContent(contentId, pieceIndex)

    if (trailItems.length === 0) {
      return {
        hasEdits: false,
        hasRegenerations: false,
        actionCount: 0,
      }
    }

    const hasEdits = trailItems.some((item) => item.action === "edited")
    const hasRegenerations = trailItems.some((item) => item.action === "regenerated")
    const lastItem = trailItems[trailItems.length - 1]

    return {
      hasEdits,
      hasRegenerations,
      lastAction: lastItem.action,
      lastModel: lastItem.model,
      actionCount: trailItems.length,
    }
  }

  static clearTrailForContent(contentId: string): void {
    const trail = this.getTrail()
    delete trail[contentId]
    this.saveTrail(trail)
  }

  static clearAllTrails(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  }

  static exportTrail(): ContentTrail {
    return this.getTrail()
  }

  static importTrail(importedTrail: ContentTrail): void {
    this.saveTrail(importedTrail)
  }
}
