#!/bin/bash
# Production Build & Security Test Script

set -e  # Exit on error

echo "🚀 Starting Production Build Test..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js 20+ required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK: $(node -v)${NC}"
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    exit 1
fi

REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_KEY"
    "PUBLIC_APP_URL"
    "SEND_EMAIL_FROM"
    "APP_PASSWORD"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi
echo -e "${GREEN}✓ All required environment variables present${NC}"
echo ""

# Check for secrets in code
echo "🔍 Scanning for hardcoded secrets..."
if grep -r -i "password\|secret\|api[_-]key" pages/ --exclude-dir=node_modules --include="*.js" | grep -v "process.env" | grep -v "^//" | grep -v "example" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Potential hardcoded secrets found:${NC}"
    grep -r -i "password\|secret\|api[_-]key" pages/ --exclude-dir=node_modules --include="*.js" | grep -v "process.env" | grep -v "^//" | grep -v "example" || true
    echo ""
else
    echo -e "${GREEN}✓ No hardcoded secrets detected${NC}"
fi
echo ""

# Check .gitignore
echo "📝 Checking .gitignore..."
if ! grep -q ".env.local" .gitignore; then
    echo -e "${RED}❌ .env.local not in .gitignore${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .gitignore configured correctly${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Check for vulnerabilities
echo "🔒 Checking for security vulnerabilities..."
if npm audit --audit-level=high > /dev/null 2>&1; then
    echo -e "${GREEN}✓ No high/critical vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️  Vulnerabilities found:${NC}"
    npm audit --audit-level=high || true
    echo ""
    echo "Run 'npm audit fix' to attempt automatic fixes"
fi
echo ""

# Test build
echo "🏗️  Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Check build size
echo "📊 Checking build size..."
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "Build size: $BUILD_SIZE"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Production Build Test Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Review CHECKLIST.md for deployment requirements"
echo "2. Run 'vercel --prod' to deploy"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Test production deployment"
echo ""
echo "Documentation:"
echo "• DEPLOYMENT.md - Deployment guide"
echo "• SECURITY.md - Security audit"
echo "• CHECKLIST.md - Pre-deployment checklist"
echo ""
