# 🚀 Quick Start Guide

## Understanding the Two Passwords

**IMPORTANT:** There are TWO different passwords in this system:

### 1️⃣ LocalLeads Account Password
- **What it's for:** Logging into the CRM application
- **When you create it:** During sign up on `/login` page
- **Example:** `MySecurePassword123`
- ❌ **NOT your email password!**
- ✅ Create a new, secure password just for this CRM

### 2️⃣ Email Sending Credentials  
- **What it's for:** Sending actual emails from Gmail or SendGrid
- **When you configure it:** After login, on `/settings` page
- **Options:**
  - **Gmail:** Your Gmail App Password (16 characters from Google)
  - **SendGrid:** Your SendGrid API Key (starts with `SG.`)

---

## 📋 Step-by-Step Setup

### Step 1: Create Your CRM Account
1. Go to `/login` page
2. Click "Don't have an account? Sign up"
3. Enter your email address (any email you want to use for login)
4. **Create a NEW password** for this CRM (NOT your email password!)
5. Click "Sign Up"
6. Check your email for verification link

### Step 2: Configure Email Credentials
1. After login, go to `/settings` page
2. Choose your email provider:
   - **Gmail (Free SMTP)**
     - Enter your Gmail address
     - Enter your Gmail App Password
     - [How to get Gmail App Password →](https://support.google.com/accounts/answer/185833)
   
   - **SendGrid (100/day free)**
     - Get API key from [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys)
     - Enter your verified sender email
     
3. **(Optional)** Add API keys:
   - **Hunter.io** - Email verification (50 free/month)
   - **Apollo.io** - Lead enrichment (50 free credits/month)

4. Click "Save Credentials"

### Step 3: Start Sending!
1. Go to `/bulk` page
2. Add your leads (or import from `/find` page)
3. Click "Send Bulk Emails"
4. Your credentials from Settings will be used automatically

---

## 🔐 Security Features

✅ **Multi-User:** Each user has their own account and credentials  
✅ **Encrypted Storage:** All credentials stored in Supabase with RLS  
✅ **Row Level Security:** Users can only access their own data  
✅ **No Shared Credentials:** Each team member uses their own email account  
✅ **Works on Vercel:** Credentials stored in database, not .env files  

---

## ❓ Common Questions

### Q: Can I use my Gmail password?
**A:** NO! You need:
1. **Account password** - New password you create for LocalLeads
2. **Gmail App Password** - Special 16-character password from Google (requires 2FA)

### Q: Do I need a Gmail account?
**A:** No. You can use SendGrid (or add other providers). Gmail is just one option.

### Q: Can multiple people use this?
**A:** YES! Each person creates their own account and configures their own email credentials.

### Q: Where are my credentials stored?
**A:** In Supabase database with Row Level Security. Only you can access your credentials.

### Q: What if I forget my account password?
**A:** Use Supabase password reset feature (will be added in future update).

---

## 🎯 Quick Reference

| What | Where | Example |
|------|-------|---------|
| **Create CRM Account** | `/login` → Sign Up | `Password123!` |
| **Configure Email** | `/settings` → Gmail/SendGrid | App Password or API Key |
| **Find Leads** | `/find` → Search by domain | `example.com` |
| **Send Emails** | `/bulk` → Add leads → Send | Uses your Settings credentials |
| **Track Results** | `/analytics` → View metrics | Opens, clicks, replies |

---

## 🆘 Troubleshooting

### "No credentials configured"
→ Go to `/settings` and add your email credentials

### "Invalid Gmail password"
→ You need an **App Password**, not your regular Gmail password  
→ Enable 2FA first, then generate app password

### "SendGrid authentication failed"
→ Verify your API key is correct  
→ Ensure sender email is verified in SendGrid dashboard

### "Not logged in"
→ Go to `/login` and sign in with your LocalLeads account credentials

---

**Ready to start?** 👉 [Sign Up Now](/login)
