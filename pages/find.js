import Head from 'next/head'
import { useState } from 'react'

export default function FindLeads() {
  const [domain, setDomain] = useState('')
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')

  async function onSearch() {
    if (!domain.trim()) {
      setError('Please enter a company domain')
      return
    }

    setLoading(true)
    setError('')
    setLeads([])

    try {
      const response = await fetch('/api/find-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), limit })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setLeads(data.leads || [])
      if (data.leads.length === 0) {
        setError('No leads found for this domain')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyToBulkSend() {
    const leadsData = leads.map(l => ({
      name: l.name,
      email: l.email,
      business: l.company,
      location: l.location || '',
      role: l.title || ''
    }))
    
    localStorage.setItem('importedLeads', JSON.stringify(leadsData))
    window.location.href = '/bulk?import=true'
  }

  return (
    <>
      <Head>
        <title>Find Leads — Lead Generation CRM</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
            🔍 Find Leads by Company
          </h1>
          <p className="text-gray-400">
            Search for contacts at any company using Apollo.io. Free: 50 searches/month.
          </p>
        </div>

        {/* Search Form */}
        <div className="card p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Company Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="input w-full"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: google.com, stripe.com, shopify.com
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="input w-full"
              >
                <option value="5">5 leads</option>
                <option value="10">10 leads</option>
                <option value="20">20 leads</option>
                <option value="30">30 leads</option>
                <option value="50">50 leads</option>
              </select>
            </div>
          </div>

          <button
            onClick={onSearch}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '🔍 Searching...' : '🔍 Search Apollo.io'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {leads.length > 0 && (
          <div className="card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                Found {leads.length} Leads
              </h2>
              <button
                onClick={copyToBulkSend}
                className="btn-accent"
              >
                📧 Import to Bulk Send
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">LinkedIn</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="border-b border-dark-700 hover:bg-dark-800 transition-colors">
                      <td className="py-3 px-4 text-gray-100">{lead.name || '—'}</td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${lead.email}`} className="text-accent hover:text-accent/80">
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{lead.title || '—'}</td>
                      <td className="py-3 px-4 text-gray-300">{lead.company || '—'}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{lead.location || '—'}</td>
                      <td className="py-3 px-4">
                        {lead.linkedin ? (
                          <a
                            href={lead.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300"
                          >
                            View →
                          </a>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-primary-950/50 border border-primary-900 rounded-lg">
              <p className="text-sm text-gray-300">
                💡 <strong>Tip:</strong> Click "Import to Bulk Send" to automatically add these leads to your campaign.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
