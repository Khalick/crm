import rateLimit from 'express-rate-limit'

// Rate limiting middleware for API routes
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter rate limit for email sending
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Max 50 emails per hour per IP
  message: 'Email rate limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
