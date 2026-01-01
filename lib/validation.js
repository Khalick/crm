import validator from 'validator'

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  
  const trimmed = email.trim().toLowerCase()
  
  if (!validator.isEmail(trimmed)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email too long' }
  }
  
  return { valid: true, email: trimmed }
}

export function validateLeadData(lead) {
  const errors = []
  
  // Validate email
  const emailCheck = validateEmail(lead.email)
  if (!emailCheck.valid) {
    errors.push(emailCheck.error)
  }
  
  // Validate business name
  if (!lead.business_name || typeof lead.business_name !== 'string') {
    errors.push('Business name is required')
  } else if (lead.business_name.trim().length === 0) {
    errors.push('Business name cannot be empty')
  } else if (lead.business_name.length > 200) {
    errors.push('Business name too long (max 200 characters)')
  }
  
  // Validate location (optional but with limits)
  if (lead.location && typeof lead.location === 'string' && lead.location.length > 200) {
    errors.push('Location too long (max 200 characters)')
  }
  
  // Validate notes (optional but with limits)
  if (lead.notes && typeof lead.notes === 'string' && lead.notes.length > 1000) {
    errors.push('Notes too long (max 1000 characters)')
  }
  
  // Validate status
  const validStatuses = ['new', 'contacted', 'replied', 'closed']
  if (lead.status && !validStatuses.includes(lead.status)) {
    errors.push('Invalid status value')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      business_name: lead.business_name?.trim() || '',
      email: emailCheck.valid ? emailCheck.email : '',
      location: lead.location?.trim() || null,
      notes: lead.notes?.trim() || null,
      status: lead.status || 'new'
    }
  }
}

export function sanitizeHtml(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
