import { UserDebug } from "@/components/debug/user-debug"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug User Profile</h1>
          <p className="text-gray-600">Troubleshoot user profile and database issues.</p>
        </div>

        <UserDebug />
      </div>
    </div>
  )
}
