'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProfileSetup } from '@/components/profile/ProfileSetup'

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your profile information and preferences
            </p>
          </div>
          <div className="p-6">
            <ProfileSetup />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 