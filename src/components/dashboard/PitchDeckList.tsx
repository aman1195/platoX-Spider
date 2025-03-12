'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import type { Database } from '@/lib/supabase'

type PitchDeck = Database['public']['Tables']['pitch_decks']['Row']

export function PitchDeckList() {
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchDecks = async () => {
      try {
        if (!user) {
          console.error('No user found when fetching decks')
          return
        }

        const { data, error } = await supabase
          .from('pitch_decks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw error
        }
        
        if (!data) {
          console.error('No data returned from Supabase')
          return
        }
        
        setDecks(data)
      } catch (err) {
        console.error('Error fetching pitch decks:', {
          error: err,
          user: user?.id,
          timestamp: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDecks()

    // Subscribe to changes
    const subscription = supabase
      .channel('pitch_decks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pitch_decks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchDecks()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const handleDelete = async (deckId: string) => {
    if (!window.confirm('Are you sure you want to delete this pitch deck?')) {
      return
    }

    try {
      setDeleting(deckId)
      
      // Get the file path first
      const deck = decks.find(d => d.id === deckId)
      if (!deck) return

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('pitch-decks')
        .remove([deck.file_url])

      if (storageError) {
        console.error('Error deleting file:', storageError)
      }

      // Delete the analysis report if it exists
      await supabase
        .from('analysis_reports')
        .delete()
        .eq('pitch_deck_id', deckId)

      // Delete the pitch deck record
      const { error: dbError } = await supabase
        .from('pitch_decks')
        .delete()
        .eq('id', deckId)

      if (dbError) {
        throw dbError
      }

      // Update local state
      setDecks(decks.filter(d => d.id !== deckId))
    } catch (error) {
      console.error('Error deleting pitch deck:', error)
      alert('Failed to delete pitch deck. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No pitch decks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your first pitch deck to get started
          </p>
        </div>
      </div>
    )
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600 bg-green-50',
          icon: null,
          text: 'Completed'
        }
      case 'processing':
        return {
          color: 'text-blue-600 bg-blue-50',
          icon: <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
          text: 'Processing'
        }
      case 'failed':
        return {
          color: 'text-red-600 bg-red-50',
          icon: <AlertCircle className="mr-1 h-3 w-3" />,
          text: 'Failed'
        }
      default:
        return {
          color: 'text-gray-600 bg-gray-50',
          icon: null,
          text: status
        }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Pitch Decks</h2>
      <div className="divide-y divide-gray-200 overflow-y-scroll max-h-[70vh]">
        {decks.map((deck) => {
          const statusDisplay = getStatusDisplay(deck.status)
          return (
            <div key={deck.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{deck.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(deck.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusDisplay.color}`}>
                    {statusDisplay.icon}
                    {statusDisplay.text}
                  </span>
                  {deck.status === 'completed' && (
                    <Link
                      href={`/reports/${deck.id}`}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      View Report
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(deck.id)}
                    disabled={deleting === deck.id}
                    className={`text-red-600 hover:text-red-500 focus:outline-none ${
                      deleting === deck.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Delete pitch deck"
                  >
                    {deleting === deck.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 