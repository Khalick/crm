import { verifyEmailHunter } from '../../lib/integrations'
import { setSecurityHeaders, authenticateRequest } from '../../lib/auth'

/**
 * Email verification endpoint
 * POST /api/verify-email
 * Body: { email: "test@example.com" }
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
  
  const { email, hunterKey } = req.body
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }
  
  try {
    const result = await verifyEmailHunter(email, hunterKey)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Verification error:', error)
    return res.status(500).json({ error: 'Verification failed', details: error.message })
  }
}
