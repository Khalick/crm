// Middleware to check API key authentication
export function authenticateRequest(req) {
  const apiKey = req.headers['x-api-key']
  const validApiKey = process.env.API_SECRET_KEY
  
  if (!validApiKey) {
    console.warn('API_SECRET_KEY not configured')
    return { authenticated: true } // Allow in development
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return { 
      authenticated: false, 
      error: 'Unauthorized: Invalid or missing API key' 
    }
  }
  
  return { authenticated: true }
}

// CORS configuration
export function setCorsHeaders(res) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000')
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type, Authorization')
  
  return res
}

// Security headers
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://calendly.com",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  res.setHeader('Content-Security-Policy', csp)
  
  return res
}
