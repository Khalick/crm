# Production Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Gmail Account with App Password** - [Setup Guide](https://support.google.com/accounts/answer/185833)

---

## Step 1: Setup Supabase Database

1. Go to your Supabase dashboard: https://mfnovgaqkoikjomatkrt.supabase.co
2. Navigate to **SQL Editor**
3. Copy the entire content of `supabase.sql` and run it
4. Verify tables were created in **Table Editor**

### Get Your Supabase Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` (e.g., https://mfnovgaqkoikjomatkrt.supabase.co)
   - `anon public` key
   - `service_role` key ⚠️ **Keep this secret!**

---

## Step 2: Setup Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password (remove spaces)

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Click **Deploy**
4. After deployment, go to **Settings** → **Environment Variables**

---

## Step 4: Configure Environment Variables in Vercel

Go to your project → **Settings** → **Environment Variables** and add:

### Required Variables:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mfnovgaqkoikjomatkrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Application URL (replace with your Vercel domain)
PUBLIC_APP_URL=https://your-app.vercel.app

# Email Configuration
SEND_EMAIL_FROM=your_email@gmail.com
APP_PASSWORD=your_gmail_app_password

# Security (generate with: openssl rand -base64 32)
API_SECRET_KEY=generate_strong_random_key

# Rate Limiting
DELAY_SECONDS=60

# CORS (replace with your domain)
ALLOWED_ORIGINS=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

### Generate API Secret Key:
```bash
openssl rand -base64 32
```

---

## Step 5: Update Your Code with API Key

After deploying, protect your bulk send endpoint by adding the API key to requests.

Update `pages/bulk.js` to include the API key:

```javascript
// In the onSend function, add headers:
const response = await fetch('/api/bulk-send', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY // Add this to your env vars
  },
  body: JSON.stringify({ leads: validLeads })
})
```

---

## Step 6: Redeploy After Environment Variables

After adding all environment variables:
1. Go to **Deployments** tab
2. Click **...** on latest deployment → **Redeploy**
3. Check **Use existing Build Cache** → **Redeploy**

---

## Step 7: Test Your Production Site

1. Visit your Vercel URL
2. Test the home page loads
3. Go to `/bulk` and try adding a test lead (use your own email)
4. Check `/leads` to see if it appears
5. Check `/analytics` for stats
6. Check your email for the test message

---

## 🔒 Security Checklist

- ✅ **Row Level Security (RLS)** enabled on Supabase tables
- ✅ **API authentication** with secret key required in production
- ✅ **Rate limiting** - 10 bulk sends per hour per IP
- ✅ **Input validation** - all user inputs sanitized
- ✅ **CORS protection** - only allowed origins
- ✅ **Security headers** - XSS, clickjacking protection
- ✅ **CSP (Content Security Policy)** - prevents script injection
- ✅ **Email validation** - regex + length checks
- ✅ **SQL injection protection** - Supabase parameterized queries
- ✅ **Service role key** never exposed to client
- ✅ **HTTPS only** in production (Vercel default)

---

## 🛡️ Additional Security Recommendations

### 1. Enable Supabase Auth (Future)
If you want user login:
```bash
# Install auth package
npm install @supabase/auth-helpers-nextjs
```

### 2. Add IP Whitelisting in Supabase
1. Go to Supabase → Settings → Database
2. Add your Vercel IPs to allowed list
3. Restrict access to known IPs only

### 3. Monitor Logs
- **Vercel Logs**: Monitor API requests and errors
- **Supabase Logs**: Check for suspicious database activity

### 4. Set Up Alerts
- Configure Vercel to alert on 5xx errors
- Set up Supabase to alert on unusual activity

### 5. Regular Updates
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

---

## 📊 Monitoring & Maintenance

### Check Email Deliverability
- Monitor bounce rates in `/analytics`
- Check Gmail spam folder
- Consider using dedicated email service (SendGrid, Mailgun) for scale

### Database Maintenance
```sql
-- Clean old events (run monthly)
DELETE FROM email_events 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Optimize indexes
REINDEX TABLE leads;
REINDEX TABLE email_events;
```

### Performance Monitoring
- Use Vercel Analytics for page load times
- Monitor API response times
- Set up alerts for slow queries

---

## 🔧 Troubleshooting

### Issue: Emails not sending
- ✅ Check Gmail app password is correct
- ✅ Verify 2FA is enabled on Gmail
- ✅ Check Vercel logs for SMTP errors
- ✅ Ensure SEND_EMAIL_FROM matches Gmail account

### Issue: 401 Unauthorized errors
- ✅ Verify API_SECRET_KEY is set in Vercel
- ✅ Add NEXT_PUBLIC_API_KEY to environment variables
- ✅ Update bulk.js to include X-API-Key header

### Issue: Database connection errors
- ✅ Check Supabase service key is correct
- ✅ Verify RLS policies are set up
- ✅ Check Supabase status page

### Issue: Tracking pixel not working
- ✅ Verify PUBLIC_APP_URL is set correctly
- ✅ Check email HTML includes tracking pixel
- ✅ Test pixel URL directly: `https://your-app.vercel.app/api/track?email=test@example.com`

---

## 📝 Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key (safe to expose) |
| `SUPABASE_SERVICE_KEY` | ✅ Yes | Supabase service role key (SECRET!) |
| `PUBLIC_APP_URL` | ✅ Yes | Your production domain |
| `SEND_EMAIL_FROM` | ✅ Yes | Gmail address |
| `APP_PASSWORD` | ✅ Yes | Gmail app password (not regular password) |
| `API_SECRET_KEY` | ✅ Yes | Random secret for API auth |
| `DELAY_SECONDS` | ⚠️ Recommended | Delay between emails (default: 60) |
| `ALLOWED_ORIGINS` | ⚠️ Recommended | CORS allowed origins |
| `NODE_ENV` | ⚠️ Auto-set | Set to 'production' by Vercel |

---

## 🎯 Next Steps

1. **Custom Domain** - Add your own domain in Vercel settings
2. **Email Service** - Consider SendGrid/Mailgun for higher volume
3. **User Authentication** - Add login system with Supabase Auth
4. **Analytics** - Integrate Google Analytics or Plausible
5. **Backup Strategy** - Set up automated Supabase backups
6. **CDN** - Vercel handles this automatically
7. **Load Testing** - Test with tools like Artillery or k6

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🔐 Security Contacts

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Email: your-security-email@example.com
3. Include: Description, steps to reproduce, impact

---

**Last Updated**: January 2026  
**Version**: 1.0.0
