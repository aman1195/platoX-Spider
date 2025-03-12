'use client'

import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AnalysisDisplay } from '@/components/AnalysisDisplay'
import type { AnalysisResult } from '@/lib/types'

interface ReportContentProps {
  id: string
}

export function ReportContent({ id }: ReportContentProps) {
  const [report, setReport] = React.useState<{ content: AnalysisResult } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null)
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    async function fetchReport() {
      if (!id) {
        setError('No report ID provided')
        setLoading(false)
        return
      }

      try {
        const { data: pitchDeck, error: pitchDeckError } = await supabase
          .from('pitch_decks')
          .select('*')
          .eq('id', id)
          .single()

        if (pitchDeckError) throw pitchDeckError

        const { data: report, error: reportError } = await supabase
          .from('analysis_reports')
          .select('*')
          .eq('pitch_deck_id', id)
          .single()

        if (reportError) throw reportError

        // Debug logging
        console.log('Raw report data:', report)
        setDebugInfo(JSON.stringify(report, null, 2))

        // Check if content exists and handle different content types
        if (!report.content) {
          throw new Error('Report content is empty')
        }

        let content: AnalysisResult
        try {
          // Handle case where content might already be an object
          content = typeof report.content === 'string' 
            ? JSON.parse(report.content)
            : report.content

          // Validate the parsed content has required fields
          if (!content.profile || !content.strengthsWeaknesses || !content.competitors) {
            throw new Error('Report content is missing required fields')
          }

        } catch (e) {
          console.error('Error parsing report content:', e)
          console.error('Raw content:', report.content)
          throw new Error(`Invalid report format: ${e instanceof Error ? e.message : 'Unknown parsing error'}`)
        }

        setReport({ content })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load report'
        console.error('Report loading error:', error)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Report</h2>
          <p className="text-red-600">{error}</p>
          {debugInfo && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Information:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!report?.content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Report Found</h2>
          <p className="text-yellow-600">The requested report could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisDisplay analysis={report.content} />
    </div>
  )
} 