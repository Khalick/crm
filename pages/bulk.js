import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Bulk() {
  const router = useRouter()
  const [leads, setLeads] = useState([{ name: '', email: '', business: '', location: '', role: '' }])
  const [sending, setSending] = useState(false)
  const [log, setLog] = useState([])
  const [showCSV, setShowCSV] = useState(false)
  const [csvText, setCsvText] = useState('')

  // Import leads from Find Leads page
  useEffect(() => {
    if (router.query.import === 'true') {
      const importedLeads = localStorage.getItem('importedLeads')
      if (importedLeads) {
        try {
          const parsed = JSON.parse(importedLeads)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLeads(parsed)
            localStorage.removeItem('importedLeads')
          }
        } catch (e) {
          console.error('Failed to import leads:', e)
        }
      }
    }
  }, [router.query])

  function addLead() {
    if (leads.length >= 30) return alert('Maximum 30 leads')
    setLeads([...leads, { name: '', email: '', business: '', location: '', role: '' }])
  }

  function removeLead(index) {
    setLeads(leads.filter((_, i) => i !== index))
  }

  function updateLead(index, field, value) {
    const updated = [...leads]
    updated[index][field] = value
    setLeads(updated)
  }

  function parseCSV() {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 30)
    const rows = lines.map(l => {
      const parts = l.split(',').map(p => p.trim())
      return {
        name: parts[0] || '',
        email: parts[1] || '',
        business: parts[2] || '',
        location: parts[3] || '',
        role: parts[4] || ''
      }
    })
    setLeads(rows)
    setShowCSV(false)
  }

  async function onSend() {
    const validLeads = leads.filter(l => l.email.trim())
    if (!validLeads.length) return alert('No valid emails found')
    if (!confirm(`Send ${validLeads.length} emails now?`)) return

    setSending(true)
    setLog([])

    try {
      const res = await fetch('/api/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: validLeads })
      })

      const data = await res.json()
      setLog(data.results || [])
    } catch (e) {
      setLog([{ error: e.message }])
    }

    setSending(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">Bulk Send</h1>
          <p className="text-gray-400 mt-2">Add up to 30 leads and send professional outreach emails</p>
        </div>
        <button onClick={() => setShowCSV(!showCSV)} className="text-sm text-accent hover:text-accent-dark underline">
          {showCSV ? '📝 Use Form' : '📋 Paste CSV'}
        </button>
      </div>

      {showCSV ? (
        <div className="card p-6 mb-6">
          <p className="mb-3 text-sm text-gray-400">Paste CSV (format: <code className="text-accent">name,email,business,location,role</code>)</p>
          <textarea className="input w-full" rows={8} value={csvText} onChange={e => setCsvText(e.target.value)} />
          <button onClick={parseCSV} className="mt-4 bg-dark-700 text-gray-100 px-6 py-2 rounded-lg hover:bg-dark-600 transition-colors">Import CSV</button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Leads: <span className="text-accent font-semibold">{leads.length}/30</span></p>
            <button onClick={addLead} className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 text-sm rounded-lg hover:shadow-lg transition-all">
              ➕ Add Lead
            </button>
          </div>

          <div className="space-y-4">
            {leads.map((lead, idx) => (
              <div key={idx} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input text-sm"
                      value={lead.name}
                      onChange={e => updateLead(idx, 'name', e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      className="input text-sm"
                      value={lead.email}
                      onChange={e => updateLead(idx, 'email', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Business"
                      className="input text-sm"
                      value={lead.business}
                      onChange={e => updateLead(idx, 'business', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="input text-sm"
                      value={lead.location}
                      onChange={e => updateLead(idx, 'location', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      className="input text-sm"
                      value={lead.role}
                      onChange={e => updateLead(idx, 'role', e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeLead(idx)} className="text-red-400 hover:text-red-300 text-sm mt-2 transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={onSend} className="btn-accent" disabled={sending}>
          {sending ? '⏳ Sending...' : `🚀 Send ${leads.filter(l => l.email.trim()).length} Emails`}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">Results</h3>
        <div className="card p-6 max-h-80 overflow-y-auto">
          {log.length === 0 && <div className="text-sm text-gray-500 text-center py-8">No results yet. Send emails to see status here.</div>}
          {log.map((r, i) => (
            <div key={i} className="text-sm py-3 border-b border-dark-700 flex items-center gap-3">
              {r.status === 'sent' && <><span className="text-green-400">✓</span><span className="text-gray-300">{r.email}</span></>}
              {r.status === 'error' && <><span className="text-red-400">✗</span><span className="text-gray-300">{r.email}</span><span className="text-red-300 text-xs">: {r.error}</span></>}
              {!r.status && <span className="text-gray-400">{r.error || JSON.stringify(r)}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
