import { createClient } from '@supabase/supabase-js'
import { setSecurityHeaders, setCorsHeaders, authenticateRequest } from '../../lib/auth'
import { validateLeadData } from '../../lib/validation'
import { verifyEmailHunter, sendEmailSendGrid } from '../../lib/integrations'
import nodemailer from 'nodemailer'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

// In-memory rate limiting per IP
const requestCounts = new Map()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS_PER_HOUR = 10

function checkRateLimit(ip) {
  const now = Date.now()
  const userRequests = requestCounts.get(ip) || []
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW)
  
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, error: 'Rate limit exceeded. Max 10 bulk sends per hour.' }
  }
  
  recentRequests.push(now)
  requestCounts.set(ip, recentRequests)
  return { allowed: true }
}

export default async function handler(req, res) {
  // Set security headers
  setSecurityHeaders(res)
  setCorsHeaders(res)
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Check authentication in production
  if (process.env.NODE_ENV === 'production') {
    const auth = authenticateRequest(req)
    if (!auth.authenticated) {
      return res.status(401).json({ error: auth.error })
    }
  }
  
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.error })
  }

  const { leads } = req.body || {}
  if (!Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ error: 'No leads provided' })
  }
  
  if (leads.length > 30) {
    return res.status(400).json({ error: 'Maximum 30 leads per request' })
  }

  const SENDER = process.env.SEND_EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL
  const APP_PASSWORD = process.env.APP_PASSWORD
  const USE_SENDGRID = !!process.env.SENDGRID_API_KEY
  const VERIFY_EMAILS = !!process.env.HUNTER_API_KEY
  const DELAY_SECONDS = parseInt(process.env.DELAY_SECONDS || '60', 10)

  // Check if we have email credentials
  if (!USE_SENDGRID && (!SENDER || !APP_PASSWORD)) {
    return res.status(500).json({ error: 'Missing email credentials. Set SENDGRID_API_KEY or SEND_EMAIL_FROM+APP_PASSWORD' })
  }

  // Setup Gmail transporter if not using SendGrid
  let transporter = null
  if (!USE_SENDGRID) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: SENDER, pass: APP_PASSWORD }
    })
  }

  const results = []

  for (const lead of leads) {
    // Validate and sanitize lead data
    const validation = validateLeadData({
      email: lead.email,
      business_name: lead.business || lead.name || '',
      location: lead.location || '',
      notes: lead.role || ''
    })
    
    if (!validation.valid) {
      results.push({ 
        email: lead.email, 
        status: 'error', 
        error: validation.errors.join(', ') 
      })
      continue
    }
    
    const sanitized = validation.sanitized
    const to = sanitized.email
    const name = lead.name || lead.business || ''
    const location = sanitized.location || ''

    // Verify email if Hunter.io is configured
    if (VERIFY_EMAILS) {
      try {
        const verification = await verifyEmailHunter(to)
        if (!verification.valid && verification.result === 'undeliverable') {
          results.push({ 
            email: to, 
            status: 'skipped', 
            error: 'Email undeliverable (Hunter.io)',
            verification: verification
          })
          continue
        }
      } catch (e) {
        console.error('Verification error:', e)
        // Continue anyway if verification fails
      }
    }

    // upsert lead with sanitized data
    try {
      await supabase.from('leads').upsert({ 
        email: to, 
        business_name: sanitized.business_name, 
        location: location, 
        status: 'new',
        notes: sanitized.notes 
      })
    } catch (e) {
      console.error('Supabase upsert error', e)
      results.push({ email: to, status: 'error', error: 'Database error' })
      continue
    }

    const pixel = `${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/api/track?email=${encodeURIComponent(to)}`

    const html = `
      <p>Hello ${name},</p>
      <p>My name is Peter, a web developer based near ${location}.</p>
      <p>I build modern, mobile-friendly websites that help local businesses get more customers online.</p>
      <p>If you'd like a free website audit, reply to this email or book a 15-min consult: ${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}</p>
      <p>If you'd prefer not to hear from me again, reply "UNSUBSCRIBE".</p>
      <p>Best,<br/>Peter</p>
      <img src="${pixel}" width="1" height="1" />
    `

    try {
      // Use SendGrid if configured, otherwise Gmail
      if (USE_SENDGRID) {
        await sendEmailSendGrid({ 
          to, 
          subject: 'Free website audit — I can help', 
          html,
          from: SENDER 
        })
      } else {
        await transporter.sendMail({ 
          from: SENDER, 
          to, 
          subject: 'Free website audit — I can help', 
          html 
        })
      }

      // record event 'sent'
      try { await supabase.from('email_events').insert({ lead_email: to, event_type: 'sent' }) } catch (e) { console.error(e) }

      // update last_contacted
      try { await supabase.from('leads').update({ last_contacted: new Date().toISOString() }).eq('email', to) } catch (e) { console.error(e) }

      results.push({ email: to, status: 'sent', provider: USE_SENDGRID ? 'sendgrid' : 'gmail' })
    } catch (err) {
      console.error('send error', err)
      results.push({ email: to, status: 'error', error: String(err) })
    }

    // delay between sends
    await sleep(DELAY_SECONDS * 1000)
  }

  res.json({ results, verified: VERIFY_EMAILS, provider: USE_SENDGRID ? 'sendgrid' : 'gmail' })
}
