"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Content {
  id: string
  title: string
  description: string
}

export default function ProjectResults({ params }: { params: { projectId: string } }) {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { projectId } = params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/content/project/${projectId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setContent(data)
        setLoading(false)
      } catch (error) {
        console.error("Could not fetch content:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!content || content.length === 0) {
    return <div>No content found for project ID: {projectId}</div>
  }

  return (
    <div>
      <h1>Project Results for Project ID: {projectId}</h1>
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push("/")}>Back to Home</button>
    </div>
  )
}
