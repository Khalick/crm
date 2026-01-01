import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Settings() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [provider, setProvider] = useState('gmail')
  const [sendFrom, setSendFrom] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [sendgridKey, setSendgridKey] = useState('')
  const [sendgridFrom, setSendgridFrom] = useState('')
  const [hunterKey, setHunterKey] = useState('')
  const [apolloKey, setApolloKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSendgrid, setShowSendgrid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadCredentials()
    }
  }, [user])

  const loadCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProvider(data.email_provider || 'gmail')
        setSendFrom(data.send_from || '')
        setAppPassword(data.app_password || '')
        setSendgridKey(data.sendgrid_key || '')
        setSendgridFrom(data.sendgrid_from || '')
        setHunterKey(data.hunter_key || '')
        setApolloKey(data.apollo_key || '')
      }
    } catch (err) {
      console.error('Error loading credentials:', err)
      setMessage({ type: 'error', text: 'Failed to load credentials' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    // Validation
    if (!sendFrom && !sendgridFrom) {
      setMessage({ type: 'error', text: 'Please enter an email address' })
      return
    }

    if (provider === 'gmail' && !appPassword) {
      setMessage({ type: 'error', text: 'Gmail App Password is required' })
      return
    }

    if (provider === 'sendgrid' && !sendgridKey) {
      setMessage({ type: 'error', text: 'SendGrid API Key is required' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const credentials = {
        user_id: user.id,
        email_provider: provider,
        send_from: sendFrom,
        app_password: appPassword,
        sendgrid_key: sendgridKey,
        sendgrid_from: sendgridFrom,
        hunter_key: hunterKey,
        apollo_key: apolloKey,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_credentials')
        .upsert(credentials, { onConflict: 'user_id' })

      if (error) throw error

      setMessage({ type: 'success', text: 'Credentials saved successfully!' })
    } catch (err) {
      console.error('Error saving credentials:', err)
      setMessage({ type: 'error', text: 'Failed to save credentials: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent mb-2">
          Email Settings
        </h1>
        <p className="text-gray-400">
          Configure your email credentials to send campaigns. Your data is encrypted and stored securely.
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded border ${
          message.type === 'success' 
            ? 'bg-green-900/20 border-green-700 text-green-400' 
            : 'bg-red-900/20 border-red-700 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Email Provider
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setProvider('gmail')}
              className={`flex-1 py-3 px-4 rounded border transition-all ${
                provider === 'gmail'
                  ? 'bg-primary-900/30 border-primary-500 text-primary-400'
                  : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
              }`}
            >
              <div className="font-semibold">Gmail</div>
              <div className="text-xs mt-1">Free SMTP</div>
            </button>
            <button
              onClick={() => setProvider('sendgrid')}
              className={`flex-1 py-3 px-4 rounded border transition-all ${
                provider === 'sendgrid'
                  ? 'bg-primary-900/30 border-primary-500 text-primary-400'
                  : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
              }`}
            >
              <div className="font-semibold">SendGrid</div>
              <div className="text-xs mt-1">100/day free</div>
            </button>
          </div>
        </div>

        {/* Gmail Settings */}
        {provider === 'gmail' && (
          <div className="space-y-4 p-4 bg-dark-900/50 rounded border border-dark-700">
            <h3 className="font-semibold text-primary-400">Gmail SMTP Configuration</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Your Gmail Address
              </label>
              <input
                type="email"
                value={sendFrom}
                onChange={(e) => setSendFrom(e.target.value)}
                placeholder="your_email@gmail.com"
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Gmail App Password
                <a 
                  href="https://support.google.com/accounts/answer/185833" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-primary-400 hover:text-primary-300"
                >
                  (How to get?)
                </a>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-300 px-2"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Not your regular Gmail password. Enable 2FA first, then generate an app password.
              </p>
            </div>
          </div>
        )}

        {/* SendGrid Settings */}
        {provider === 'sendgrid' && (
          <div className="space-y-4 p-4 bg-dark-900/50 rounded border border-dark-700">
            <h3 className="font-semibold text-primary-400">SendGrid API Configuration</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                SendGrid API Key
                <a 
                  href="https://app.sendgrid.com/settings/api_keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-primary-400 hover:text-primary-300"
                >
                  (Get API Key)
                </a>
              </label>
              <div className="relative">
                <input
                  type={showSendgrid ? 'text' : 'password'}
                  value={sendgridKey}
                  onChange={(e) => setSendgridKey(e.target.value)}
                  placeholder="SG.xxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowSendgrid(!showSendgrid)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-300 px-2"
                >
                  {showSendgrid ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Verified Sender Email
              </label>
              <input
                type="email"
                value={sendgridFrom}
                onChange={(e) => setSendgridFrom(e.target.value)}
                placeholder="verified@yourdomain.com"
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be verified in SendGrid dashboard
              </p>
            </div>
          </div>
        )}

        {/* Optional API Keys */}
        <div className="space-y-4 p-4 bg-dark-900/50 rounded border border-dark-700">
          <h3 className="font-semibold text-gray-300">Optional API Integrations</h3>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Hunter.io API Key (email verification)
              <a 
                href="https://hunter.io/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-xs text-primary-400 hover:text-primary-300"
              >
                (Get Free Key)
              </a>
            </label>
            <input
              type="text"
              value={hunterKey}
              onChange={(e) => setHunterKey(e.target.value)}
              placeholder="Optional - 50 free verifications/month"
              className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Apollo.io API Key (lead enrichment)
              <a 
                href="https://app.apollo.io/#/settings/integrations/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-xs text-primary-400 hover:text-primary-300"
              >
                (Get Free Key)
              </a>
            </label>
            <input
              type="text"
              value={apolloKey}
              onChange={(e) => setApolloKey(e.target.value)}
              placeholder="Optional - 50 free credits/month"
              className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent hover:from-primary-500 hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold text-dark-900 transition-all"
        >
          {saving ? 'Saving...' : 'Save Credentials'}
        </button>

        {/* Security Notice */}
        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded">
          <p className="text-sm text-blue-300">
            🔒 <strong>Security:</strong> Your credentials are encrypted and stored in Supabase with Row Level Security. Only you can access them.
          </p>
        </div>
      </div>
    </div>
  )
}
