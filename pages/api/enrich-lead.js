import { enrichLeadApollo } from '../../lib/integrations'
import { setSecurityHeaders, authenticateRequest } from '../../lib/auth'

/**
 * Lead enrichment endpoint
 * POST /api/enrich-lead
 * Body: { email: "john@example.com" }
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
  
  const { email } = req.body
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }
  
  try {
    const result = await enrichLeadApollo(email)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Enrichment error:', error)
    return res.status(500).json({ error: 'Enrichment failed', details: error.message })
  }
}
