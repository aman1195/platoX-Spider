'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FileUpload } from '@/components/dashboard/FileUpload'
import { PitchDeckList } from '@/components/dashboard/PitchDeckList'
import { FileText, TrendingUp, Users, AlertCircle, Upload, Clock, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% increase</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-teal-600">
              <Upload className="h-4 w-4 mr-1" />
              <span>2 uploading</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">21</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>98% success rate</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Support available 24/7</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upload New Pitch Deck</h2>
                <p className="mt-1 text-sm text-gray-500">Upload a PDF file to analyze</p>
              </div>
              <div className="p-6">
                <FileUpload />
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
                <p className="mt-1 text-sm text-gray-500">View and manage your pitch deck analyses</p>
              </div>
              <div className="p-6">
                <PitchDeckList />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold">Pro Tips 💡</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </DashboardLayout>
  )
} 