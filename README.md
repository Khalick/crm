# Lead Generation CRM - Production Ready 🚀

A secure, multi-user lead generation and email outreach system with tracking, analytics, and CRM capabilities.

## 🔑 Two Different Passwords Explained

**IMPORTANT:** This system uses two separate passwords:

```
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  ACCOUNT PASSWORD (Sign Up/Login)                      │
│  • Created during sign up at /login                         │
│  • Used to access the CRM application                       │
│  • Example: "MySecurePassword123"                           │
│  • ❌ NOT your email password!                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2️⃣  EMAIL CREDENTIALS (Settings Page)                     │
│  • Configured after login in /settings                      │
│  • Used for actually sending emails                         │
│  • Options:                                                  │
│    - Gmail App Password (16 chars from Google)              │
│    - SendGrid API Key (starts with "SG.")                   │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

- 👥 **Multi-User Support** - Each team member has their own account and email credentials
- 🔐 **Secure Authentication** - Supabase Auth with JWT tokens and Row Level Security
- 📧 **Bulk Email Sending** - Send personalized emails to up to 30 leads at once
- 🔍 **Lead Finding** - Apollo.io integration for company-based lead discovery
- ✉️ **Email Verification** - Hunter.io integration to validate email addresses
- 📊 **Analytics Dashboard** - Track opens, engagement, and conversion rates
- 💼 **CRM Interface** - Manage leads with status tracking and notes
- 📈 **Open Tracking** - Pixel-based tracking with IP/user-agent logging
- 🔒 **Enterprise Security** - Rate limiting, input validation, RLS, API auth
- 🎨 **Modern Dark Theme** - Beautiful green/grey/yellow gradient design
- ⚡ **Performance Optimized** - Indexed queries, efficient data fetching

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (React 19) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Email**: Gmail SMTP (nodemailer) + SendGrid
- **Integrations**: Hunter.io (verification) + Apollo.io (lead finding)
- **Hosting**: Vercel (recommended)
- **Security**: RLS, JWT auth, rate limiting, input validation, CSP headers

---

## 🚀 Quick Start

### Setup Workflow

```
Step 1: Deploy & Configure
├── Deploy to Vercel
├── Setup Supabase database (run supabase.sql)
└── Add environment variables

Step 2: Create Your Account  
├── Visit /login
├── Sign up with email + NEW password (for CRM access)
└── Verify email

Step 3: Configure Email Credentials
├── Login and go to /settings
├── Choose provider (Gmail or SendGrid)
├── Add Gmail App Password OR SendGrid API Key
└── Save credentials

Step 4: Start Sending!
├── Find leads at /find (Apollo.io search)
├── Import to /bulk
└── Send campaigns using YOUR credentials
```

### Prerequisites
- Node.js 20+ 
- npm or pnpm
- Supabase account (**with Authentication enabled**)
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
# Edit .env.local with your Supabase credentials
# Note: Email credentials are now per-user in Settings, not in .env
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
- `SEND_EMAIL_FROM` (default, users can override in Settings)
- `APP_PASSWORD` (default, users can override in Settings)
- `SENDGRID_API_KEY` (optional, for SendGrid users)
- `SENDGRID_FROM` (optional, for SendGrid users)
- `HUNTER_API_KEY` (optional, for email verification)
- `APOLLO_API_KEY` (optional, for lead finding)
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
│   ├── index.js            # Landing page
│   ├── bulk.js             # Bulk email interface
│   ├── find.js             # Lead finder (Apollo.io)
│   ├── settings.js         # User credential management
│   ├── leads.js            # CRM table view
│   ├── analytics.js        # Analytics dashboard
│   └── api/
│       ├── bulk-send.js    # Email sending API
│       ├── verify-email.js # Hunter.io verification
│       ├── enrich-lead.js  # Apollo.io enrichment
│       ├── find-leads.js   # Apollo.io search
│       └── track.js        # Tracking pixel API
├── lib/
│   ├── auth.js             # Authentication & headers
│   ├── validation.js       # Input validation
│   ├── rateLimit.js        # Rate limiting
│   └── integrations.js     # Hunter/SendGrid/Apollo
├── supabase.sql            # Database schema + RLS
├── vercel.json             # Vercel configuration
├── DEPLOYMENT.md           # Deployment guide
├── SECURITY.md             # Security documentation
├── API_INTEGRATIONS.md     # API setup guide
├── MULTI_USER_GUIDE.md     # Multi-user setup guide
├── CHECKLIST.md            # Pre-deployment checklist
└── .env.example            # Environment template
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

## 👥 Multi-User Setup

### For Team Use:

1. **Admin Setup** (one-time):
   - Deploy to Vercel with default credentials in environment variables
   - Optional: Configure default Hunter/SendGrid/Apollo keys

2. **Each User**:
   - Navigate to **⚙️ Settings** page
   - Choose email provider (Gmail or SendGrid)
   - Enter their email credentials
   - Save (stored in browser localStorage)
   - Credentials used for all their campaigns

3. **Benefits**:
   - Each user sends from their own email
   - Independent rate limits per user
   - Better deliverability
   - Personalized sender addresses
   - No shared credentials

**See [MULTI_USER_GUIDE.md](./MULTI_USER_GUIDE.md) for complete setup instructions**

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

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide (400+ lines)
- **[SECURITY.md](./SECURITY.md)** - Security audit & best practices
- **[API_INTEGRATIONS.md](./API_INTEGRATIONS.md)** - Hunter/SendGrid/Apollo setup
- **[MULTI_USER_GUIDE.md](./MULTI_USER_GUIDE.md)** - Team member onboarding
- **[CHECKLIST.md](./CHECKLIST.md)** - Pre-deployment checklist
- **[START_HERE.md](./START_HERE.md)** - Quick start guide

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
