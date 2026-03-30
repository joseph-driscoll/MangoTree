import { DatabaseTest } from "@/components/database-test"

export default function TestDbPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
          <p className="text-gray-600">Verify that your Supabase database is properly connected and configured.</p>
        </div>

        <div className="flex justify-center">
          <DatabaseTest />
        </div>
      </div>
    </div>
  )
}
