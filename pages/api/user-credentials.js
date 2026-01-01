import { createClient } from '@supabase/supabase-js'
import { setSecurityHeaders } from '../../lib/auth'

/**
 * Get current user's email credentials
 * GET /api/user-credentials
 * Requires: Authorization header with Supabase JWT
 */
export default async function handler(req, res) {
  setSecurityHeaders(res)
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get authorization token from header
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  try {
    // Create Supabase client with user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Fetch user's credentials
    const { data, error } = await supabase
      .from('user_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (!data) {
      return res.status(200).json({ 
        hasCredentials: false,
        message: 'No credentials configured. Please visit Settings to add your email credentials.'
      })
    }

    // Return credentials (they're already protected by RLS)
    return res.status(200).json({
      hasCredentials: true,
      credentials: {
        provider: data.email_provider,
        sendFrom: data.send_from,
        appPassword: data.app_password,
        sendgridKey: data.sendgrid_key,
        sendgridFrom: data.sendgrid_from,
        hunterKey: data.hunter_key,
        apolloKey: data.apollo_key
      }
    })
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return res.status(500).json({ error: 'Failed to fetch credentials', details: error.message })
  }
}
