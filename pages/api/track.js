import { createClient } from '@supabase/supabase-js'
import { validateEmail } from '../../lib/validation'
import { setSecurityHeaders } from '../../lib/auth'

export default async function handler(req, res) {
  setSecurityHeaders(res)
  
  const { email } = req.query
  
  // Validate email parameter
  const validation = validateEmail(email)
  if (!validation.valid) {
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')
    res.setHeader('Content-Type', 'image/gif')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    return res.status(200).send(pixel)
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  try {
    await supabase.from('email_events').insert({ 
      lead_email: validation.email, 
      event_type: 'opened',
      metadata: {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      }
    })
  } catch (e) {
    console.error('Supabase insert error', e)
  }

  // 1x1 transparent gif
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')

  res.setHeader('Content-Type', 'image/gif')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.status(200).send(pixel)
}
