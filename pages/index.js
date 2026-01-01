import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Lead Generation CRM — Email Outreach Made Simple</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-primary-900 border border-primary-700 rounded-full text-accent text-sm mb-6">
            🚀 Your Lead Generation Command Center
          </div>
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-500 bg-clip-text text-transparent">
              Automate Your Outreach
            </span>
            <br />
            <span className="text-gray-100">Track Every Lead</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Send personalized email campaigns, track opens and engagement, manage your leads — all from one secure dashboard.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn-primary text-lg px-8 py-4">
              🚀 Get Started Free
            </Link>
            <Link href="/leads" className="bg-dark-700 text-gray-100 px-8 py-4 rounded-lg font-semibold border border-dark-600 hover:bg-dark-600 transition-all duration-200 text-lg">
              👥 View Demo
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            ✓ Multi-user accounts &nbsp;·&nbsp; ✓ Your own credentials &nbsp;·&nbsp; ✓ Secure storage
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">📧</div>
            <div className="text-2xl font-bold text-gray-100">30 at Once</div>
            <div className="text-sm text-gray-400">Bulk Email Sending</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-100">Real-Time</div>
            <div className="text-sm text-gray-400">Open Tracking</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">🔒</div>
            <div className="text-2xl font-bold text-gray-100">Secure</div>
            <div className="text-sm text-gray-400">Enterprise-Grade</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">⚡</div>
            <div className="text-2xl font-bold text-gray-100">Fast</div>
            <div className="text-sm text-gray-400">Instant Analytics</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Bulk Email Campaigns</h3>
            <p className="text-gray-300 mb-4">
              Send personalized emails to up to 30 leads at once. Gmail SMTP integration with smart rate limiting to protect your sender reputation.
            </p>
            <Link href="/bulk" className="text-accent hover:text-accent/80 font-semibold">
              Start Campaign →
            </Link>
          </div>

          <div className="card p-8">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Analytics Dashboard</h3>
            <p className="text-gray-300 mb-4">
              Track email opens, engagement rates, and conversion metrics in real-time. Know exactly who's interested in your outreach.
            </p>
            <Link href="/analytics" className="text-accent hover:text-accent/80 font-semibold">
              View Analytics →
            </Link>
          </div>

          <div className="card p-8">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">CRM Interface</h3>
            <p className="text-gray-300 mb-4">
              Manage your leads with status tracking, notes, and sorting. See open counts and last contact date at a glance.
            </p>
            <Link href="/leads" className="text-accent hover:text-accent/80 font-semibold">
              Manage Leads →
            </Link>
          </div>

          <div className="card p-8">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Enterprise Security</h3>
            <p className="text-gray-300 mb-4">
              API authentication, rate limiting, input validation, and Row Level Security. Your data is protected with enterprise-grade security.
            </p>
            <span className="text-primary-400 font-semibold">
              ✓ Production Ready
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-12 text-center bg-gradient-to-br from-primary-950 to-dark-800 border-primary-800">
          <h2 className="text-3xl font-bold mb-4 text-gray-100">Ready to Start Your Campaign?</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Everything you need to manage lead generation — email sending, tracking, analytics, and CRM — all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/bulk" className="btn-primary text-lg px-8 py-4">
              Send Your First Campaign
            </Link>
            <Link href="/analytics" className="bg-dark-600 text-gray-100 px-8 py-4 rounded-lg font-semibold border border-dark-500 hover:bg-dark-500 transition-all duration-200 text-lg">
              View Demo Analytics
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
