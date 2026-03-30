// Demo service for handling content without authentication
export class DemoService {
  private static DEMO_KEY = "mango-tree-demo-content"
  private static DEMO_STATS_KEY = "mango-tree-demo-stats"

  // Generate a demo user ID
  static getDemoUserId(): string {
    let demoId = localStorage.getItem("demo-user-id")
    if (!demoId) {
      demoId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("demo-user-id", demoId)
    }
    return demoId
  }

  // Save content to localStorage
  static saveContent(content: any) {
    try {
      const existingContent = this.getAllContent()
      const newContent = {
        ...content,
        id: content.id || crypto.randomUUID(),
        user_id: this.getDemoUserId(),
        created_at: content.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      existingContent.push(newContent)
      localStorage.setItem(this.DEMO_KEY, JSON.stringify(existingContent))
      return newContent
    } catch (error) {
      console.error("Failed to save demo content:", error)
      return content
    }
  }

  // Get all content from localStorage
  static getAllContent(): any[] {
    try {
      const content = localStorage.getItem(this.DEMO_KEY)
      return content ? JSON.parse(content) : []
    } catch (error) {
      console.error("Failed to load demo content:", error)
      return []
    }
  }

  // Update content in localStorage
  static updateContent(contentId: string, updates: any): any {
    try {
      const allContent = this.getAllContent()
      const index = allContent.findIndex((item) => item.id === contentId)

      if (index !== -1) {
        allContent[index] = {
          ...allContent[index],
          ...updates,
          updated_at: new Date().toISOString(),
        }
        localStorage.setItem(this.DEMO_KEY, JSON.stringify(allContent))
        return allContent[index]
      }
      return null
    } catch (error) {
      console.error("Failed to update demo content:", error)
      return null
    }
  }

  // Delete content from localStorage
  static deleteContent(contentId: string): boolean {
    try {
      const allContent = this.getAllContent()
      const filtered = allContent.filter((item) => item.id !== contentId)
      localStorage.setItem(this.DEMO_KEY, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Failed to delete demo content:", error)
      return false
    }
  }

  // Get organized content (suites and individual)
  static getOrganizedContent() {
    const allContent = this.getAllContent()

    // Group by suites and individual content
    const suites: Record<string, any> = {}
    const individual: any[] = []

    allContent.forEach((item) => {
      if (item.suite_id && !item.generated_individually) {
        if (!suites[item.suite_id]) {
          suites[item.suite_id] = {
            suite_id: item.suite_id,
            suite_name: item.suite_name,
            created_at: item.created_at,
            content: [],
          }
        }
        suites[item.suite_id].content.push(item)
      } else {
        individual.push(item)
      }
    })

    return {
      suites: Object.values(suites),
      individual,
      all: allContent,
    }
  }

  // Get demo stats
  static getStats() {
    const allContent = this.getAllContent()

    const stats = {
      total: allContent.length,
      thisMonth: allContent.filter((item) => {
        const created = new Date(item.created_at)
        const now = new Date()
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length,
      byType: allContent.reduce(
        (acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      suites: allContent.filter((item) => item.suite_id && !item.generated_individually).length,
      individual: allContent.filter((item) => item.generated_individually).length,
    }

    return stats
  }

  // Check if we're in demo mode
  static isDemoMode(): boolean {
    return typeof window !== "undefined" && !window.location.hostname.includes("localhost")
  }

  // Clear all demo data
  static clearDemoData() {
    localStorage.removeItem(this.DEMO_KEY)
    localStorage.removeItem(this.DEMO_STATS_KEY)
    localStorage.removeItem("demo-user-id")
  }
}
