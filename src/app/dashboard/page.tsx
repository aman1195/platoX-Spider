'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FileUpload } from '@/components/dashboard/FileUpload'
import { PitchDeckList } from '@/components/dashboard/PitchDeckList'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload your pitch decks and get AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <FileUpload />
          </div>
          <div>
            <PitchDeckList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 