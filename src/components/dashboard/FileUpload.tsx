'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ANALYSIS_TIMEOUT = 300000 // 5 minutes

export function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useTextract, setUseTextract] = useState(false)
  const { user } = useAuth()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        setError('You must be logged in to upload files')
        return
      }

      const file = acceptedFiles[0]
      if (!file) return

      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 10MB')
        return
      }

      let deckId: string | undefined

      try {
        setUploading(true)
        setError(null)

        // Create file path
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Convert file to Uint8Array for upload
        const arrayBuffer = await file.arrayBuffer()
        const fileData = new Uint8Array(arrayBuffer)

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('pitch-decks')
          .upload(filePath, fileData, {
            contentType: 'application/pdf'
          })

        if (uploadError) {
          throw new Error(uploadError.message || 'Failed to upload file')
        }

        // Create pitch deck record
        const { data: deck, error: dbError } = await supabase
          .from('pitch_decks')
          .insert({
            user_id: user.id,
            title: file.name,
            file_url: filePath,
            status: 'pending'
          })
          .select()
          .single()

        if (dbError || !deck) {
          throw new Error('Failed to create pitch deck record')
        }

        deckId = deck.id

        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT)

        try {
          // Trigger analysis with timeout
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              deckId: deck.id,
              useTextract
            }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Invalid server response' }))
            throw new Error(errorData.error || `Analysis failed: ${response.status}`)
          }

          const result = await response.json()
          if (!result.success) {
            throw new Error('Analysis failed to start')
          }
        } catch (analysisError) {
          if (analysisError instanceof Error && analysisError.name === 'AbortError') {
            throw new Error('Analysis timed out. The file may be too large or complex.')
          }
          throw analysisError
        }

      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        
        // Update deck status to failed if we have a deck ID
        if (deckId) {
          await supabase
            .from('pitch_decks')
            .update({ status: 'failed' })
            .eq('id', deckId)
        }
      } finally {
        setUploading(false)
      }
    },
    [user, useTextract]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={useTextract}
              onChange={(e) => setUseTextract(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <span className="text-sm text-gray-700">
            Use for image-based PDFs
          </span>
        </label>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {uploading
              ? 'Uploading...'
              : 'Drag and drop your pitch deck here, or click to select file'}
          </p>
          <p className="mt-1 text-xs text-gray-500">PDF files up to 10MB</p>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
} 