import { ResultsHeader } from "@/components/results/results-header"
import { ContentTabs } from "@/components/results/content-tabs"
import { OnboardingTooltip } from "@/components/results/onboarding-tooltip"

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResultsHeader />
      <main className="container mx-auto px-4 py-8">
        <ContentTabs />
        <OnboardingTooltip />
      </main>
    </div>
  )
}
