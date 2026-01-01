# Multi-User Setup Guide

## Overview

LocalLeads now supports multiple users! Each user creates their own account and configures their own email credentials.

✅ **Multiple team members** can use the same CRM  
✅ **Each person uses their own email account**  
✅ **Credentials encrypted** in Supabase database  
✅ **No shared passwords** - everyone has own login  
✅ **Works on any device** - credentials sync across browsers  

---

## For Users

### Step 1: Create Your Account
1. Visit the CRM website
2. Click **Sign In** → **Sign Up**
3. Enter email and password (min 6 characters)
4. Confirm your email if required

### Step 2: Configure Email Credentials
1. Click **⚙️ Settings** in navigation
2. Choose **Gmail** or **SendGrid**

**For Gmail:**
1. Enable 2FA on your Gmail account
2. Generate App Password at [Google Account Security](https://myaccount.google.com/security)
3. Enter Gmail address and app password
4. Click **Save Credentials**

**For SendGrid:**
1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Verify sender email
3. Create API key with Mail Send permission
4. Enter API key and verified sender email
5. Click **Save Credentials**

### Step 3: Start Sending
1. Go to **Send Bulk** page
2. Add leads
3. Click **Send Bulk Emails**
4. Your credentials are used automatically!

---

## For Administrators

### Deployment Steps

1. **Run SQL Migration**
   Execute `supabase.sql` in Supabase SQL Editor

2. **Enable Authentication**
   - Supabase → Authentication → Providers
   - Enable **Email** provider
   - Set **Site URL** to your domain

3. **Update Environment Variables**
   Remove:
   - ❌ `SEND_EMAIL_FROM`
   - ❌ `APP_PASSWORD`
   
   Keep:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_KEY`

4. **Deploy**
   ```bash
   vercel --prod
   ```

---

## Security

- **Row Level Security (RLS)**: Users can only access their own credentials
- **HTTPS Only**: All credentials transmitted securely
- **Session Tokens**: JWT authentication for API requests
- **Encrypted at Rest**: Supabase encrypts database

---

## Troubleshooting

**"Please sign in to send emails"**  
→ Not logged in. Click Sign In.

**"No email credentials found"**  
→ Go to Settings and configure your email.

**"Invalid token"**  
→ Session expired. Sign out and back in.

---

## Migration from Single-User

1. Users sign up and configure own credentials
2. Remove `SEND_EMAIL_FROM` and `APP_PASSWORD` from Vercel
3. Run updated `supabase.sql`
4. Enable Supabase Authentication
5. Redeploy

---

**Full documentation in DEPLOYMENT.md**
