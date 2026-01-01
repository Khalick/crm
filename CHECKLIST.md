# Pre-Deployment Checklist

Complete this checklist before deploying to production.

---

## 📋 Database Setup

- [ ] **Create Supabase tables**
  - [ ] Run `supabase.sql` in Supabase SQL Editor
  - [ ] Verify `leads` table exists
  - [ ] Verify `email_events` table exists
  - [ ] Check RLS policies are enabled
  - [ ] Test database connection

---

## 🔑 Environment Variables

- [ ] **Supabase Configuration**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` set
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
  - [ ] `SUPABASE_SERVICE_KEY` set (⚠️ NEVER COMMIT THIS!)

- [ ] **Application Settings**
  - [ ] `PUBLIC_APP_URL` set to production domain
  - [ ] `NODE_ENV` set to `production`

- [ ] **Email Configuration**
  - [ ] `SEND_EMAIL_FROM` set to Gmail address
  - [ ] `APP_PASSWORD` set (Gmail app password, NOT regular password)
  - [ ] 2FA enabled on Gmail account
  - [ ] App password generated successfully

- [ ] **Security**
  - [ ] `API_SECRET_KEY` generated (use: `openssl rand -base64 32`)
  - [ ] `ALLOWED_ORIGINS` set to production domain

- [ ] **Rate Limiting**
  - [ ] `DELAY_SECONDS` set (default: 60)

---

## 🔒 Security Review

- [ ] **Code Security**
  - [ ] No hardcoded secrets in code
  - [ ] No console.log statements with sensitive data
  - [ ] All user inputs validated server-side
  - [ ] SQL injection protection verified
  - [ ] XSS protection verified

- [ ] **API Security**
  - [ ] API key authentication enabled in production
  - [ ] Rate limiting configured
  - [ ] CORS properly configured
  - [ ] Security headers set

- [ ] **Database Security**
  - [ ] RLS policies enabled
  - [ ] Service role used only in API routes
  - [ ] Database constraints in place
  - [ ] Indexes created for performance

---

## 🧪 Testing

- [ ] **Local Testing**
  - [ ] Home page loads
  - [ ] Bulk send page works
  - [ ] Leads page displays data
  - [ ] Analytics page shows stats
  - [ ] Email sending works (test with your own email)
  - [ ] Tracking pixel records opens

- [ ] **Production Testing** (after deployment)
  - [ ] All pages accessible
  - [ ] HTTPS enabled
  - [ ] Email sending works
  - [ ] Rate limiting works (try 11 requests)
  - [ ] Invalid API key rejected (401)
  - [ ] Tracking pixel works

---

## 📦 Vercel Configuration

- [ ] **Project Setup**
  - [ ] Repository connected to Vercel
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `.next`
  - [ ] Install command: `npm install`

- [ ] **Environment Variables**
  - [ ] All variables added in Vercel dashboard
  - [ ] Production environment selected for each variable
  - [ ] Sensitive variables marked as sensitive

- [ ] **Domain Configuration**
  - [ ] Custom domain added (optional)
  - [ ] SSL certificate active
  - [ ] DNS records configured

---

## 📝 Documentation

- [ ] **Update Documentation**
  - [ ] Update `PUBLIC_APP_URL` in DEPLOYMENT.md
  - [ ] Add your production domain to ALLOWED_ORIGINS
  - [ ] Update security contact email in SECURITY.md
  - [ ] Document any custom changes

---

## 🚀 Deployment

- [ ] **Initial Deployment**
  - [ ] Deploy to Vercel
  - [ ] Check build logs for errors
  - [ ] Verify deployment successful

- [ ] **Post-Deployment**
  - [ ] Visit production URL
  - [ ] Test all pages
  - [ ] Send test email
  - [ ] Check Vercel logs
  - [ ] Monitor error rates

---

## 📊 Monitoring Setup

- [ ] **Set Up Monitoring**
  - [ ] Enable Vercel Analytics (optional)
  - [ ] Configure error alerts
  - [ ] Set up uptime monitoring (e.g., UptimeRobot)
  - [ ] Monitor Supabase usage

---

## 🔧 Final Checks

- [ ] **Code Quality**
  - [ ] No npm audit vulnerabilities (high/critical)
  - [ ] No TypeScript/ESLint errors
  - [ ] Code formatted consistently

- [ ] **Git Repository**
  - [ ] `.env.local` NOT committed
  - [ ] `.gitignore` includes all sensitive files
  - [ ] All changes committed
  - [ ] Repository pushed to remote

- [ ] **Backup Strategy**
  - [ ] Supabase automatic backups enabled
  - [ ] Database export tested
  - [ ] Recovery process documented

---

## ✅ Ready for Production!

Once all items are checked, you're ready to go live!

### Quick Start Commands:
```bash
# Test locally first
npm run dev

# Deploy to Vercel
vercel --prod

# Monitor logs
vercel logs --follow
```

---

## 🆘 Rollback Plan

If something goes wrong:

1. **Revert deployment**: 
   - Go to Vercel → Deployments
   - Find previous working deployment
   - Click "..." → Promote to Production

2. **Check logs**:
   ```bash
   vercel logs
   ```

3. **Disable feature**:
   - Set `API_SECRET_KEY` to temporary value
   - Redeploy

4. **Database rollback**:
   - Restore from Supabase backup
   - Go to Supabase → Backups → Restore

---

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Gmail Support**: https://support.google.com/mail

---

**Last Updated**: January 1, 2026
