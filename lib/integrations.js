import axios from 'axios'

/**
 * Hunter.io Email Verification API
 * Free: 25 verifications/month
 * Docs: https://hunter.io/api/v2/docs#email-verifier
 */
export async function verifyEmailHunter(email, apiKey = null) {
  const key = apiKey || process.env.HUNTER_API_KEY
  
  if (!key) {
    console.warn('HUNTER_API_KEY not set, skipping verification')
    return { valid: true, score: null, provider: 'skipped' }
  }
  
  try {
    const response = await axios.get('https://api.hunter.io/v2/email-verifier', {
      params: { email, api_key: key }
    })
    
    const { data } = response.data
    
    return {
      valid: data.status === 'valid',
      score: data.score, // 0-100
      result: data.result, // deliverable, undeliverable, risky, unknown
      acceptAll: data.accept_all,
      disposable: data.disposable,
      provider: 'hunter'
    }
  } catch (error) {
    console.error('Hunter verification error:', error.response?.data || error.message)
    return { valid: true, score: null, provider: 'error' }
  }
}

/**
 * Apollo.io Lead Enrichment API
 * Free: 50 credits/month
 * Docs: https://apolloio.github.io/apollo-api-docs/
 */
export async function enrichLeadApollo(email, apiKey = null) {
  const key = apiKey || process.env.APOLLO_API_KEY
  
  if (!key) {
    console.warn('APOLLO_API_KEY not set, skipping enrichment')
    return { enriched: false, provider: 'skipped' }
  }
  
  try {
    const response = await axios.post('https://api.apollo.io/v1/people/match', 
      { email },
      { headers: { 'Content-Type': 'application/json', 'X-Api-Key': key } }
    )
    
    const person = response.data.person
    
    if (!person) {
      return { enriched: false, provider: 'apollo' }
    }
    
    return {
      enriched: true,
      provider: 'apollo',
      data: {
        name: person.name,
        firstName: person.first_name,
        lastName: person.last_name,
        title: person.title,
        company: person.organization?.name,
        companyDomain: person.organization?.website_url,
        location: person.city ? `${person.city}, ${person.state}` : null,
        linkedin: person.linkedin_url,
        phone: person.phone_numbers?.[0],
        emailStatus: person.email_status
      }
    }
  } catch (error) {
    console.error('Apollo enrichment error:', error.response?.data || error.message)
    return { enriched: false, provider: 'error' }
  }
}

/**
 * Apollo.io Email Finder (by company domain)
 * Find emails for people at a company
 */
export async function findEmailsApollo(domain, limit = 10, apiKey = null) {
  const key = apiKey || process.env.APOLLO_API_KEY
  
  if (!key) {
    throw new Error('APOLLO_API_KEY not set')
  }
  
  try {
    const response = await axios.post('https://api.apollo.io/v1/mixed_people/search',
      {
        organization_domains: [domain],
        page: 1,
        per_page: limit
      },
      { headers: { 'Content-Type': 'application/json', 'X-Api-Key': key } }
    )
    
    const people = response.data.people || []
    
    return people.map(person => ({
      name: person.name,
      email: person.email,
      title: person.title,
      company: person.organization?.name,
      location: person.city ? `${person.city}, ${person.state}` : null,
      linkedin: person.linkedin_url
    }))
  } catch (error) {
    console.error('Apollo search error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * SendGrid Email Sending
 * Free: 100 emails/day forever
 * Docs: https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
export async function sendEmailSendGrid({ to, subject, html, from, apiKey = null }) {
  const key = apiKey || process.env.SENDGRID_API_KEY
  
  if (!key) {
    throw new Error('SENDGRID_API_KEY not set')
  }
  
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(key)
  
  try {
    const msg = {
      to,
      from: from || process.env.SENDGRID_FROM_EMAIL,
      subject,
      html
    }
    
    await sgMail.send(msg)
    
    return { sent: true, provider: 'sendgrid' }
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message)
    throw error
  }
}

/**
 * Bulk email verification
 * Uses Hunter.io API efficiently
 */
export async function verifyEmailsBulk(emails) {
  const results = []
  
  for (const email of emails) {
    const result = await verifyEmailHunter(email)
    results.push({ email, ...result })
    
    // Rate limiting: Hunter allows 10 requests/second
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return results
}
