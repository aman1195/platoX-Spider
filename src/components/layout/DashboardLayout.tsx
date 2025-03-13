'use client'

import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { User, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useTheme } from '../theme/ThemeProvider'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pitch Deck Analyzer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                    <span className="text-teal-600 dark:text-teal-400 font-medium">
                      {user?.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <User className="h-5 w-5 mr-3" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={toggleTheme}
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                            )}
                          >
                            {theme === 'light' ? (
                              <>
                                <Moon className="h-5 w-5 mr-3" />
                                Dark Mode
                              </>
                            ) : (
                              <>
                                <Sun className="h-5 w-5 mr-3" />
                                Light Mode
                              </>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 