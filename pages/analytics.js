import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Analytics({ stats, topLeads, recentEvents }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent mb-2">Analytics</h1>
        <p className="text-gray-400">Track your campaign performance and engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-primary-500">
          <div className="text-sm text-gray-400 mb-2">Total Leads</div>
          <div className="text-4xl font-bold text-gray-100">{stats.totalLeads}</div>
        </div>
        <div className="card p-6 border-l-4 border-accent">
          <div className="text-sm text-gray-400 mb-2">Emails Sent</div>
          <div className="text-4xl font-bold text-gray-100">{stats.emailsSent}</div>
        </div>
        <div className="card p-6 border-l-4 border-primary-600">
          <div className="text-sm text-gray-400 mb-2">Total Opens</div>
          <div className="text-4xl font-bold text-gray-100">{stats.totalOpens}</div>
        </div>
        <div className="card p-6 border-l-4 border-accent">
          <div className="text-sm text-gray-400 mb-2">Open Rate</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">{stats.openRate}%</div>
        </div>
      </div>

      {/* Top Engaged Leads */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">🔥 Top Engaged Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-dark-900 border-b border-dark-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Business</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Opens</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {topLeads.map((lead, i) => (
                <tr key={i} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4 text-gray-100">{lead.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{lead.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-bold">
                      {lead.opens} 🔥
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${lead.status === 'interested' ? 'bg-accent/20 text-accent' : 'bg-dark-700 text-gray-400'}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
              {topLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No engaged leads yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">📊 Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-primary-700">
              <div className="text-gray-300">New</div>
              <div className="text-3xl font-bold text-primary-400">{stats.statusBreakdown.new || 0}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-accent">
              <div className="text-gray-300">Interested</div>
              <div className="text-3xl font-bold text-accent">{stats.statusBreakdown.interested || 0}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-600">
              <div className="text-gray-300">Other</div>
              <div className="text-3xl font-bold text-gray-400">{stats.statusBreakdown.other || 0}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">⚡ Recent Activity</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-3 px-4 bg-dark-900 rounded-lg border border-dark-700">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${event.event_type === 'opened' ? 'bg-accent animate-pulse' : 'bg-primary-500'}`}></span>
                <span className="text-gray-300 flex-1 truncate">{event.lead_email}</span>
                <span className={`px-2 py-1 rounded text-xs ${event.event_type === 'opened' ? 'bg-accent/20 text-accent' : 'bg-primary-900 text-primary-400'}`}>
                  {event.event_type}
                </span>
                <span className="text-gray-500 text-xs">{new Date(event.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="text-center text-gray-500 py-12">No activity yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: leads } = await supabase.from('leads').select('*')
  const { data: events } = await supabase.from('email_events').select('*').order('created_at', { ascending: false })

  const totalLeads = leads?.length || 0
  const emailsSent = events?.filter(e => e.event_type === 'sent').length || 0
  const totalOpens = events?.filter(e => e.event_type === 'opened').length || 0
  const openRate = emailsSent > 0 ? Math.round((totalOpens / emailsSent) * 100) : 0

  const opensByEmail = {}
  events?.forEach(e => {
    if (e.event_type === 'opened') {
      opensByEmail[e.lead_email] = (opensByEmail[e.lead_email] || 0) + 1
    }
  })

  const topLeads = (leads || [])
    .map(l => ({ ...l, opens: opensByEmail[l.email] || 0 }))
    .filter(l => l.opens > 0)
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10)

  const statusBreakdown = {}
  leads?.forEach(l => {
    const status = l.status || 'other'
    statusBreakdown[status] = (statusBreakdown[status] || 0) + 1
  })

  return {
    props: {
      stats: { totalLeads, emailsSent, totalOpens, openRate, statusBreakdown },
      topLeads,
      recentEvents: events?.slice(0, 20) || []
    }
  }
}
