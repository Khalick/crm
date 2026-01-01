import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) throw error

      if (isSignUp) {
        alert('Check your email to confirm your account!')
      } else {
        router.push('/settings')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
              <span className="text-dark-900 font-bold text-2xl">L</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
              LocalLeads
            </h1>
          </div>
          <p className="text-gray-400">
            {isSignUp ? 'Create your CRM account' : 'Sign in to your CRM account'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {isSignUp 
              ? 'This is your LocalLeads login password (not your email password)' 
              : 'Use your LocalLeads account credentials'}
          </p>
        </div>

        <div className="bg-dark-800 rounded-lg border border-dark-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
                placeholder="you@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is your account login email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isSignUp ? 'Create Password for LocalLeads' : 'Account Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isSignUp 
                  ? '⚠️ This is NOT your email password. Create a new secure password for this CRM. Minimum 6 characters.' 
                  : 'Enter your LocalLeads account password'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent hover:from-primary-500 hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold text-dark-900 transition-all"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded">
          <p className="text-xs text-blue-300">
            <strong>ℹ️ After signing up:</strong> Go to Settings to configure your Gmail or SendGrid credentials for sending emails.
          </p>
        </div>
      </div>
    </div>
  )
}
