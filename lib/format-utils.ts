export function parseAudience(audience: string | string[]): string[] {
  if (Array.isArray(audience)) {
    return audience.filter(Boolean)
  }

  if (typeof audience === "string") {
    if (audience.trim() === "") return []

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(audience)
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean)
      }
    } catch {
      // If not JSON, split by comma
      return audience
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }

  return []
}

export function formatAudience(audience: string | string[]): string {
  const audienceArray = parseAudience(audience)
  return audienceArray.join(", ")
}
