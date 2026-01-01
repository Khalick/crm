import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Leads({ leads: initialLeads }) {
  const [leads, setLeads] = useState(initialLeads)
  const [sortBy, setSortBy] = useState('created_at')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredLeads = leads
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'opens') return b.opens - a.opens
      if (sortBy === 'created_at') return new Date(b.created_at) - new Date(a.created_at)
      return 0
    })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent mb-2">Leads</h1>
        <p className="text-gray-400">Manage and track all your outreach leads</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          Showing <span className="text-accent font-semibold">{filteredLeads.length}</span> leads
        </div>
        <div className="flex gap-3 items-center">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input text-sm py-2">
            <option value="created_at">Sort by Date</option>
            <option value="opens">Sort by Opens</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input text-sm py-2">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="interested">Interested</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-dark-900 border-b border-dark-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Business</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Opens</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(l => (
                <tr key={l.id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4 text-gray-100">{l.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{l.email}</td>
                  <td className="px-6 py-4 text-gray-300">{l.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${l.opens > 0 ? 'bg-accent/20 text-accent' : 'bg-dark-700 text-gray-500'}`}>
                      {l.opens ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      l.status === 'new' ? 'bg-primary-900/50 text-primary-400 border border-primary-700' : 
                      l.status === 'interested' ? 'bg-accent/20 text-accent border border-accent' : 
                      'bg-dark-700 text-gray-400 border border-dark-600'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No leads found. Add some leads in the Bulk Send page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200)
  const { data: eventsData } = await supabase.from('email_events').select('lead_email, event_type')

  const opens = Object.create(null)
  if (eventsData && Array.isArray(eventsData)) {
    for (const e of eventsData) {
      if (e.event_type === 'opened') {
        opens[e.lead_email] = (opens[e.lead_email] || 0) + 1
      }
    }
  }

  const leads = (leadsData || []).map(l => ({ ...l, opens: opens[l.email] || 0 }))

  return { props: { leads } }
}
