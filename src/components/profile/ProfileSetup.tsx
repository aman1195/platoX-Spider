'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Profile {
  full_name: string
  company: string
  role: string
  bio: string
  avatar_url?: string
}

export function ProfileSetup() {
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    company: '',
    role: '',
    bio: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          company: data.company || '',
          role: data.role || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url,
        })
      } else {
        // If no profile exists, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || '',
              company: '',
              role: '',
              bio: '',
            },
          ])
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', insertError)
          throw insertError
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      setMessage('Error loading profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      if (!session) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setMessage('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <input
            type="text"
            id="role"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200' 
              : 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
} 