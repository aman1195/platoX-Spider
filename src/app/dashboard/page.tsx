'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FileUpload } from '@/components/dashboard/FileUpload'
import { PitchDeckList } from '@/components/dashboard/PitchDeckList'
import { FileText, TrendingUp, Users, AlertCircle, Upload, Clock, CheckCircle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useTheme } from '@/components/theme/ThemeProvider'

interface DashboardStats {
  total: number
  completed: number
  failed: number
  inProgress: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0
  })
  const [userName, setUserName] = useState('')
  const supabase = createClientComponentClient()
  const { theme } = useTheme()

  useEffect(() => {
    // Fetch initial stats
    fetchStats()
    fetchUserName()

    // Subscribe to changes
    const subscription = supabase
      .channel('pitch_decks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pitch_decks' }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserName = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', session.user.id)
      .single()

    if (profile?.full_name) {
      setUserName(profile.full_name)
    } else {
      setUserName(session.user.email?.split('@')[0] || 'User')
    }
  }

  const fetchStats = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: decks } = await supabase
      .from('pitch_decks')
      .select('status')
      .eq('user_id', session.user.id)

    if (!decks) return

    const stats = decks.reduce((acc, deck) => {
      acc.total++
      switch (deck.status) {
        case 'completed':
          acc.completed++
          break
        case 'failed':
          acc.failed++
          break
        case 'processing':
          acc.inProgress++
          break
      }
      return acc
    }, { total: 0, completed: 0, failed: 0, inProgress: 0 })

    setStats(stats)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's an overview of your pitch deck analyses
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Analyses</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload New Pitch Deck</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload a PDF file to analyze</p>
              </div>
              <div className="p-6">
                <FileUpload />
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="mt-6 bg-gradient-to-r from-teal-600 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold">Pro Tips 💡</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Text-based PDFs</p>
                    <p className="mt-1 text-sm text-teal-100">Best for standard pitch decks with searchable text</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Image-based PDFs</p>
                    <p className="mt-1 text-sm text-teal-100">Toggle AWS Textract for scanned documents</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">File Requirements</p>
                    <p className="mt-1 text-sm text-teal-100">Max 10MB, PDF format only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Analyses</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage your pitch deck analyses</p>
              </div>
              <div className="p-6">
                <PitchDeckList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 