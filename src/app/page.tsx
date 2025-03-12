import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-8">
          Welcome to {' '}
          <span className="text-blue-600">
            PlatoX AI - DeckInsight
          </span>
        </h1>
        <p className="text-2xl text-center mb-12">
          Revolutionize your investment analysis with AI-powered pitch deck insights
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/signin"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
