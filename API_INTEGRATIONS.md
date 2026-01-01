# 🚀 API Integrations Guide

Your CRM now supports powerful free-tier integrations for email verification, lead finding, and professional email sending.

---

## 📧 **SendGrid Integration** (Recommended)

**Why use SendGrid?**
- ✅ Free: 100 emails/day forever (vs Gmail's 500/day)
- ✅ Better deliverability (dedicated infrastructure)
- ✅ Professional sender reputation
- ✅ Real click tracking (not just opens)
- ✅ No 2FA or app passwords needed
- ✅ Scales easily to paid plans

### Setup (5 minutes)

1. **Sign up** → https://signup.sendgrid.com/

2. **Verify your sender email**:
   ```
   SendGrid Dashboard → Settings → Sender Authentication
   → Single Sender Verification → Add email address
   → Check your email and verify
   ```

3. **Create API key**:
   ```
   SendGrid Dashboard → Settings → API Keys
   → Create API Key → Full Access
   → Copy the key (starts with SG.)
   ```

4. **Add to `.env.local`**:
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxx
   SENDGRID_FROM_EMAIL=your-verified@email.com
   ```

5. **Done!** Your bulk emails will now use SendGrid automatically.

---

## 🔍 **Hunter.io Email Verification**

**Why verify emails?**
- ✅ Reduce bounce rates (protect sender reputation)
- ✅ Save money (don't send to invalid addresses)
- ✅ Improve deliverability
- ✅ Free: 25 verifications/month

### Setup (3 minutes)

1. **Sign up** → https://hunter.io/users/sign_up

2. **Get API key**:
   ```
   Hunter Dashboard → API → Your API Key
   → Copy the key
   ```

3. **Add to `.env.local`**:
   ```bash
   HUNTER_API_KEY=your_hunter_api_key_here
   ```

4. **Done!** Emails will be auto-verified before sending.

### What it does:
- Checks if email is deliverable before sending
- Returns confidence score (0-100)
- Detects disposable emails
- Identifies catch-all domains
- Skips undeliverable emails automatically

### API Endpoint:
```bash
POST /api/verify-email
Body: { "email": "test@example.com" }

Response:
{
  "valid": true,
  "score": 95,
  "result": "deliverable",
  "disposable": false,
  "provider": "hunter"
}
```

---

## 🎯 **Apollo.io Lead Finding**

**Why use Apollo?**
- ✅ 270M+ contact database
- ✅ Find emails by company domain
- ✅ Enrich leads with job titles, LinkedIn, phone
- ✅ Free: 50 credits/month
- ✅ B2B focused data

### Setup (3 minutes)

1. **Sign up** → https://app.apollo.io/#/sign-up

2. **Get API key**:
   ```
   Apollo Dashboard → Settings → Integrations
   → API → Your API Keys → Create New Key
   → Copy the key
   ```

3. **Add to `.env.local`**:
   ```bash
   APOLLO_API_KEY=your_apollo_api_key_here
   ```

4. **Done!** Use the Find Leads page to search companies.

### Features:

#### **Find Leads by Company**
Go to `/find` page:
1. Enter company domain (e.g., "stripe.com")
2. Choose how many leads (5-50)
3. Click "Search Apollo.io"
4. Click "Import to Bulk Send"

#### **Enrich Existing Leads**
```bash
POST /api/enrich-lead
Body: { "email": "john@stripe.com" }

Response:
{
  "enriched": true,
  "data": {
    "name": "John Doe",
    "title": "Head of Growth",
    "company": "Stripe",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "phone": "+1234567890"
  }
}
```

---

## 💰 **Cost Comparison**

### Without Integrations:
```
Gmail SMTP: Free (500/day limit)
Manual lead finding: Free but time-consuming
No email verification: 5-10% bounce rate
```

### With Free Tier Integrations:
```
SendGrid: 100/day free (better deliverability)
Apollo.io: 50 lead finds/month
Hunter.io: 25 verifications/month
Total: $0/month

Benefits:
✅ Professional email infrastructure
✅ Automatic lead finding
✅ Email verification (lower bounces)
✅ Better sender reputation
```

### Upgrade Path (if needed):
```
SendGrid Pro: $19.95/mo (50k emails)
Apollo.io Basic: $49/mo (900 credits)
Hunter.io Starter: $49/mo (1,000 verifications)

Total: ~$120/month for serious volume
```

---

## 🔄 **How It Works**

### Email Sending Flow:
```
1. User adds leads in /bulk page
2. IF Hunter.io configured → Verify each email
3. IF email undeliverable → Skip and log
4. IF SendGrid configured → Use SendGrid
   ELSE → Use Gmail SMTP
5. Record 'sent' event in database
6. Add tracking pixel to email
7. Wait DELAY_SECONDS before next email
```

### Lead Finding Flow:
```
1. User goes to /find page
2. Enters company domain (e.g., "shopify.com")
3. Apollo.io searches its 270M contact database
4. Returns: name, email, title, location, LinkedIn
5. User clicks "Import to Bulk Send"
6. Leads auto-populate in /bulk page
7. Ready to send campaign!
```

---

## 🧪 **Testing**

### Test Email Verification:
```bash
curl -X POST http://localhost:3000/api/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'
```

### Test Lead Finding:
```bash
curl -X POST http://localhost:3000/api/find-leads \
  -H "Content-Type: application/json" \
  -d '{"domain":"stripe.com","limit":5}'
```

### Test SendGrid Sending:
1. Add SendGrid keys to `.env.local`
2. Go to `/bulk`
3. Add a lead with your own email
4. Send campaign
5. Check result shows `"provider": "sendgrid"`

---

## ⚠️ **Important Notes**

### Rate Limits:
```
Hunter.io: 10 requests/second
Apollo.io: No documented limit (be reasonable)
SendGrid: 100/day on free plan
```

### Credits:
- **Hunter**: 25/month reset on billing date
- **Apollo**: 50/month (includes finds + enrichments)
- **SendGrid**: 100/day (never expires)

### Best Practices:
1. **Always verify emails** before sending (if Hunter configured)
2. **Use SendGrid** for better deliverability
3. **Start slow** - 10-20 emails/day, gradually increase
4. **Monitor bounces** - high bounce rate hurts reputation
5. **Personalize emails** - better response rates

---

## 🚀 **Quick Start (All Free)**

1. **Sign up for all three**:
   - SendGrid: https://signup.sendgrid.com/
   - Hunter.io: https://hunter.io/users/sign_up
   - Apollo.io: https://app.apollo.io/#/sign-up

2. **Get API keys** from each dashboard

3. **Add to `.env.local`**:
   ```bash
   # SendGrid
   SENDGRID_API_KEY=SG.xxxxxxxxx
   SENDGRID_FROM_EMAIL=your@email.com
   
   # Hunter.io
   HUNTER_API_KEY=xxxxxxxxx
   
   # Apollo.io
   APOLLO_API_KEY=xxxxxxxxx
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

5. **Test the flow**:
   - Go to `/find` → Search for leads
   - Click "Import to Bulk Send"
   - Emails auto-verified
   - Sent via SendGrid
   - Track opens in `/analytics`

---

## 📊 **Monthly Free Tier Summary**

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **SendGrid** | 100/day (3,000/mo) | Professional email sending |
| **Hunter.io** | 25/month | Email verification |
| **Apollo.io** | 50/month | Lead finding & enrichment |
| **Gmail SMTP** | 500/day (15,000/mo) | Fallback option |

**Total Capacity (Free):**
- Find: 50 new leads/month
- Verify: 25 emails/month
- Send: 3,000 emails/month (SendGrid) or 15,000/month (Gmail)

**Perfect for:**
- Freelancers
- Consultants
- Small agencies
- Testing campaigns
- Learning email marketing

---

## 🔧 **Troubleshooting**

### SendGrid emails not sending:
- ✅ Verified sender email in SendGrid?
- ✅ API key has "Full Access"?
- ✅ Check SendGrid Dashboard → Activity for errors

### Hunter verification not working:
- ✅ API key correct?
- ✅ Not exceeded 25/month limit?
- ✅ Check browser console for errors

### Apollo lead search failing:
- ✅ API key correct?
- ✅ Not exceeded 50/month limit?
- ✅ Try different company domain
- ✅ Some companies have more data than others

---

## 📈 **Upgrade When You Need To**

### Signs you need paid plans:
- Sending >100 emails/day (SendGrid)
- Need >25 verifications/month (Hunter)
- Need >50 lead finds/month (Apollo)
- Want dedicated IP address (SendGrid)
- Need higher success rates (all)

### Recommended upgrade order:
1. **SendGrid** ($19.95/mo) - Better deliverability
2. **Apollo** ($49/mo) - More lead finding
3. **Hunter** ($49/mo) - More verifications

---

**Ready to use free APIs?** Just add the keys to `.env.local` and restart! 🚀
