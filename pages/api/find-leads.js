import { findEmailsApollo } from '../../lib/integrations'
import { setSecurityHeaders, authenticateRequest } from '../../lib/auth'

/**
 * Find emails by company domain
 * POST /api/find-leads
 * Body: { domain: "example.com", limit: 10 }
 */
export default async function handler(req, res) {
  setSecurityHeaders(res)
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  // Check authentication in production
  if (process.env.NODE_ENV === 'production') {
    const auth = authenticateRequest(req)
    if (!auth.authenticated) {
      return res.status(401).json({ error: auth.error })
    }
  }
  
  const { domain, limit = 10, apolloKey } = req.body
  
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain is required' })
  }
  
  if (limit > 50) {
    return res.status(400).json({ error: 'Limit cannot exceed 50' })
  }
  
  try {
    const leads = await findEmailsApollo(domain, limit, apolloKey)
    return res.status(200).json({ leads, count: leads.length })
  } catch (error) {
    console.error('Lead finder error:', error)
    return res.status(500).json({ error: 'Lead search failed', details: error.message })
  }
}
