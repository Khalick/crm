import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    sendFrom: '',
    appPassword: '',
    sendgridKey: '',
    sendgridFrom: '',
    hunterKey: '',
    apolloKey: '',
    provider: 'gmail' // 'gmail' or 'sendgrid'
  })
  const [saved, setSaved] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('emailSettings')
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  function saveSettings() {
    localStorage.setItem('emailSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function clearSettings() {
    if (!confirm('Clear all settings? This cannot be undone.')) return
    localStorage.removeItem('emailSettings')
    setSettings({
      sendFrom: '',
      appPassword: '',
      sendgridKey: '',
      sendgridFrom: '',
      hunterKey: '',
      apolloKey: '',
      provider: 'gmail'
    })
  }

  return (
    <>
      <Head>
        <title>Settings — Lead Generation CRM</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
            ⚙️ Email Settings
          </h1>
          <p className="text-gray-400">
            Configure your email sending credentials. Settings are stored locally in your browser.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Email Provider</h2>
          <p className="text-gray-400 mb-4">Choose how you want to send emails</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({...settings, provider: 'gmail'})}
              className={`p-6 rounded-lg border-2 transition-all ${
                settings.provider === 'gmail' 
                  ? 'border-primary-500 bg-primary-950/50' 
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="text-3xl mb-2">📧</div>
              <div className="text-lg font-bold text-gray-100 mb-1">Gmail SMTP</div>
              <div className="text-sm text-gray-400">Free • 500 emails/day</div>
              {settings.provider === 'gmail' && (
                <div className="mt-2 text-sm text-primary-400 font-semibold">✓ Selected</div>
              )}
            </button>

            <button
              onClick={() => setSettings({...settings, provider: 'sendgrid'})}
              className={`p-6 rounded-lg border-2 transition-all ${
                settings.provider === 'sendgrid' 
                  ? 'border-accent bg-primary-950/50' 
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-lg font-bold text-gray-100 mb-1">SendGrid</div>
              <div className="text-sm text-gray-400">Free • 100/day • Better deliverability</div>
              {settings.provider === 'sendgrid' && (
                <div className="mt-2 text-sm text-accent font-semibold">✓ Selected</div>
              )}
            </button>
          </div>
        </div>

        {/* Gmail Settings */}
        {settings.provider === 'gmail' && (
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Gmail SMTP Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Gmail Address
                </label>
                <input
                  type="email"
                  value={settings.sendFrom}
                  onChange={(e) => setSettings({...settings, sendFrom: e.target.value})}
                  placeholder="your-email@gmail.com"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Gmail App Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={settings.appPassword}
                    onChange={(e) => setSettings({...settings, appPassword: e.target.value})}
                    placeholder="16-character app password"
                    className="input w-full pr-20"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
                  >
                    {showPasswords ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener" className="text-primary-400 hover:text-primary-300">
                    How to generate app password →
                  </a> (requires 2FA enabled)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SendGrid Settings */}
        {settings.provider === 'sendgrid' && (
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">SendGrid Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  SendGrid API Key
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={settings.sendgridKey}
                    onChange={(e) => setSettings({...settings, sendgridKey: e.target.value})}
                    placeholder="SG.xxxxxxxxxxxxxxxxxx"
                    className="input w-full pr-20"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
                  >
                    {showPasswords ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <a href="https://signup.sendgrid.com/" target="_blank" rel="noopener" className="text-accent hover:text-accent/80">
                    Sign up for SendGrid →
                  </a> Free 100 emails/day
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Verified Sender Email
                </label>
                <input
                  type="email"
                  value={settings.sendgridFrom}
                  onChange={(e) => setSettings({...settings, sendgridFrom: e.target.value})}
                  placeholder="verified@yourdomain.com"
                  className="input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be verified in SendGrid dashboard
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Optional Integrations */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Optional Integrations</h2>
          <p className="text-gray-400 mb-6">Add these for email verification and lead finding</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Hunter.io API Key (Email Verification)
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={settings.hunterKey}
                  onChange={(e) => setSettings({...settings, hunterKey: e.target.value})}
                  placeholder="Optional - 25 free verifications/month"
                  className="input w-full pr-20"
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
                >
                  {showPasswords ? '🙈 Hide' : '👁️ Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <a href="https://hunter.io/users/sign_up" target="_blank" rel="noopener" className="text-primary-400 hover:text-primary-300">
                  Sign up for Hunter.io →
                </a> Free tier available
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Apollo.io API Key (Lead Finding)
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={settings.apolloKey}
                  onChange={(e) => setSettings({...settings, apolloKey: e.target.value})}
                  placeholder="Optional - 50 free credits/month"
                  className="input w-full pr-20"
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
                >
                  {showPasswords ? '🙈 Hide' : '👁️ Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <a href="https://app.apollo.io/#/sign-up" target="_blank" rel="noopener" className="text-primary-400 hover:text-primary-300">
                  Sign up for Apollo.io →
                </a> Free tier available
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={saveSettings}
            className="btn-primary flex-1"
          >
            {saved ? '✓ Saved!' : '💾 Save Settings'}
          </button>
          <button
            onClick={clearSettings}
            className="bg-red-900/20 text-red-400 px-6 py-3 rounded-lg font-semibold border border-red-800 hover:bg-red-900/30 transition-all duration-200"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-semibold text-yellow-300 mb-1">Security Notice</div>
              <p className="text-sm text-gray-300">
                Settings are stored in your browser's localStorage. They are NOT sent to any server. 
                Each user must configure their own credentials. Clear your settings before using a shared computer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
