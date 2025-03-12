import { Suspense } from 'react'
import { ReportContent } from './ReportContent'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }>
          <ReportContent id={params.id} />
        </Suspense>
      </div>
    </div>
  )
} 