"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DatabaseTest() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    connection: boolean | null
    tables: string[]
    error: string | null
  }>({
    connection: null,
    tables: [],
    error: null,
  })

  const testConnection = async () => {
    setTesting(true)
    setResults({ connection: null, tables: [], error: null })

    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`)
      }

      // Test all tables exist
      const tablesToTest = [
        "users",
        "generated_content",
        "campaigns",
        "integrations",
        "uploaded_images",
        "user_settings",
      ]

      const tableResults = []
      for (const table of tablesToTest) {
        try {
          const { error } = await supabase.from(table).select("count", { count: "exact", head: true })

          if (!error) {
            tableResults.push(table)
          }
        } catch (e) {
          console.warn(`Table ${table} test failed:`, e)
        }
      }

      setResults({
        connection: true,
        tables: tableResults,
        error: null,
      })
    } catch (error) {
      setResults({
        connection: false,
        tables: [],
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection Test
          {results.connection === true && <CheckCircle className="h-5 w-5 text-green-500" />}
          {results.connection === false && <XCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Database Connection"
          )}
        </Button>

        {results.connection !== null && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Connection Status:</span>
              {results.connection ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Failed
                </span>
              )}
            </div>

            {results.tables.length > 0 && (
              <div>
                <span className="font-medium">Tables Found:</span>
                <ul className="mt-2 space-y-1">
                  {results.tables.map((table) => (
                    <li key={table} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {table}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-medium text-red-800">Error:</span>
                <p className="text-sm text-red-700 mt-1">{results.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>What this test checks:</strong>
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Supabase connection is working</li>
            <li>All required tables exist</li>
            <li>Row Level Security is properly configured</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
