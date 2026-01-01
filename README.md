# Lead Generation CRM - Production Ready 🚀

A secure, full-featured lead generation and email outreach system with tracking, analytics, and CRM capabilities.

## ✨ Features

- 📧 **Bulk Email Sending** - Send personalized emails to up to 30 leads at once
- 📊 **Analytics Dashboard** - Track opens, engagement, and conversion rates
- 👥 **CRM Interface** - Manage leads with status tracking and notes
- 🔍 **Email Tracking** - Pixel-based open tracking with IP/user-agent logging
- 🔒 **Enterprise Security** - Rate limiting, input validation, RLS, API auth
- 🎨 **Modern Dark Theme** - Beautiful green/grey/yellow gradient design
- ⚡ **Performance Optimized** - Indexed queries, efficient data fetching

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (React 19) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Email**: Gmail SMTP (nodemailer)
- **Hosting**: Vercel (recommended)
- **Security**: RLS, rate limiting, input validation, CSP headers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or pnpm
- Supabase account
- Gmail account with 2FA + app password
- Vercel account (for deployment)

### Local Development

1. **Clone and install**:
```bash
cd ~/Desktop/crm
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Setup database**:
   - Go to Supabase → SQL Editor
   - Run all queries from `supabase.sql`

4. **Start development server**:
```bash
npm run dev
```

5. **Open browser**: http://localhost:3000

---

## 📦 Production Deployment

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide**

### Quick Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Environment Variables Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `PUBLIC_APP_URL`
- `SEND_EMAIL_FROM`
- `APP_PASSWORD`
- `API_SECRET_KEY`
- `DELAY_SECONDS`
- `ALLOWED_ORIGINS`

**Generate API key**: `openssl rand -base64 32`

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** on all tables  
✅ **API Key Authentication** for write operations  
✅ **Rate Limiting** - 10 bulk sends/hour per IP  
✅ **Input Validation** - All user inputs sanitized  
✅ **SQL Injection Protection** - Parameterized queries  
✅ **XSS Prevention** - HTML escaping + CSP headers  
✅ **CORS Protection** - Configurable allowed origins  
✅ **Security Headers** - HSTS, X-Frame-Options, CSP  
✅ **Email Validation** - RFC 5322 compliant regex  
✅ **HTTPS Only** - Enforced in production  

**See [SECURITY.md](./SECURITY.md) for security audit**

---

## 📂 Project Structure

```
crm/
├── pages/
│   ├── index.js          # Landing page
│   ├── bulk.js           # Bulk email interface
│   ├── leads.js          # CRM table view
│   ├── analytics.js      # Analytics dashboard
│   └── api/
│       ├── bulk-send.js  # Email sending API
│       └── track.js      # Tracking pixel API
├── lib/
│   ├── auth.js           # Authentication & headers
│   ├── validation.js     # Input validation
│   └── rateLimit.js      # Rate limiting
├── supabase.sql          # Database schema + RLS
├── vercel.json           # Vercel configuration
├── DEPLOYMENT.md         # Deployment guide
├── SECURITY.md           # Security documentation
├── CHECKLIST.md          # Pre-deployment checklist
└── .env.example          # Environment template
```

---

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment guide
- **[SECURITY.md](./SECURITY.md)** - Security audit and best practices
- **[CHECKLIST.md](./CHECKLIST.md)** - Pre-deployment checklist

---

## 🎯 Usage

### Send Bulk Emails
1. Go to `/bulk`
2. Enter lead details (name, email, business, location, role)
3. Add up to 30 leads
4. Click "Send All"
5. Monitor real-time results

### View Leads
1. Go to `/leads`
2. Sort by date or opens
3. Filter by status
4. Click status badges to change

### Analytics
1. Go to `/analytics`
2. View total stats (leads, sent, opens, rate)
3. See top engaged leads
4. Monitor status breakdown
5. Check recent activity feed

---

## 🔧 Configuration

### Rate Limiting
Adjust in `.env.local`:
```bash
DELAY_SECONDS=60          # Time between emails (seconds)
```

In `lib/auth.js`:
```javascript
const MAX_REQUESTS_PER_HOUR = 10  # Bulk sends per hour per IP
```

### Email Template
Edit in `pages/api/bulk-send.js`:
```javascript
const html = `
  <p>Hello ${name},</p>
  <p>Your custom message here...</p>
  <img src="${pixel}" width="1" height="1" />
`
```

### Theme Colors
Edit in `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },  // Green shades
  accent: '#a3e635', // Yellow-green
  dark: { ... }      // Dark greys
}
```

---

## 🧪 Testing

### Local Testing
```bash
# Run dev server
npm run dev

# Test email (use your own email)
# Go to /bulk and send test email
```

### Production Testing
```bash
# Check deployment
vercel logs --follow

# Test API endpoint
curl -X POST https://your-app.vercel.app/api/bulk-send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_key" \
  -d '{"leads":[...]}'
```

---

## 📊 Database Schema

### Tables
- **leads**: business_name, email, location, status, notes, last_contacted
- **email_events**: lead_email, event_type, metadata, created_at

### Indexes
- Email lookups (unique)
- Status filtering
- Date sorting
- Event aggregation

**See [supabase.sql](./supabase.sql) for full schema**

---

## 🐛 Troubleshooting

### Emails not sending
- ✅ Check Gmail app password is correct
- ✅ Verify 2FA enabled on Gmail
- ✅ Check Vercel logs: `vercel logs`

### Database errors
- ✅ Verify RLS policies are set
- ✅ Check service key is correct
- ✅ Confirm tables exist in Supabase

### 401 Unauthorized
- ✅ Add API_SECRET_KEY to Vercel env vars
- ✅ Include X-API-Key header in requests
- ✅ Check NODE_ENV is 'production'

**More in [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)**

---

## 🔄 Updates & Maintenance

### Check for vulnerabilities
```bash
npm audit
npm audit fix
```

### Update dependencies
```bash
npm update
```

### Clean old data
```sql
-- Run in Supabase SQL editor
DELETE FROM email_events 
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 📝 License

MIT License - Feel free to use for personal or commercial projects

---

## 🙏 Support

- **Issues**: Open a GitHub issue
- **Security**: See [SECURITY.md](./SECURITY.md)
- **Docs**: Check [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎉 What's Next?

- [ ] Add user authentication (Supabase Auth)
- [ ] Integrate SendGrid/Mailgun for scale
- [ ] Add custom domain
- [ ] Implement A/B testing
- [ ] Add email templates library
- [ ] Create automated follow-up sequences
- [ ] Build Chrome extension for LinkedIn scraping

---

**Built with ❤️ for local business outreach**

**Version**: 1.0.0  
**Last Updated**: January 2026
# crm
