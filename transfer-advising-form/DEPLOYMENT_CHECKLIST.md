# 🚀 Deployment Checklist - MSU Transfer Advising Form

## ✅ System Status Overview

### **COMPLETED** ✓
- [x] Next.js 14 project structure with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS + Mantine UI integration
- [x] Prisma ORM schema with all models (Submission, AdminUser, RateLimit)
- [x] Zod validation schemas (partial/full form modes)
- [x] API routes implemented:
  - `/api/submissions` (POST) - Form submission with rate limiting
  - `/api/admin/submissions` (GET) - List submissions
  - `/api/admin/submissions/[id]` (GET) - View single submission
  - `/api/admin/submissions/export` (GET) - CSV export
  - `/api/auth/[...nextauth]` - Admin authentication
  - `/api/healthz` - Health check
- [x] Frontend components:
  - Homepage with hero section
  - Partial form (inline)
  - Full form wizard (10 steps)
  - Form toggle functionality
- [x] Authentication system (NextAuth + argon2)
- [x] Rate limiting implementation
- [x] Email notification service (nodemailer)
- [x] Logging system (pino)
- [x] MSU brand design implementation

### **PENDING** ⏳ - Required Before Users Can Submit Forms

#### 1. Environment Configuration (CRITICAL)
**Status:** ❌ **NOT DONE**

```bash
# Copy .env.example to .env
cp .env.example .env
```

Then edit `.env` file and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `ADMIN_SEED_EMAIL` - Your admin email
- `ADMIN_SEED_PASSWORD` - Strong admin password
- `IP_HASH_SECRET` - Generate with: `openssl rand -base64 32`
- SMTP settings (if email notifications needed)

**File:** `.env.example` exists ✓, `.env` needs to be created ❌

---

#### 2. Database Setup (CRITICAL)
**Status:** ❌ **NOT DONE**

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb transfer_advising
```

**Option B: Hosted Database** (Recommended for production)
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available
- [Neon](https://neon.tech) - Free tier available

Update `DATABASE_URL` in `.env` with your connection string.

---

#### 3. Run Database Migrations (CRITICAL)
**Status:** ❌ **NOT DONE**

```bash
# Generate Prisma client
yarn prisma:generate

# Create database tables
yarn prisma:migrate

# When prompted for migration name, use: "init"
```

This creates:
- `Submission` table (30+ fields for form data)
- `AdminUser` table (admin authentication)
- `RateLimit` table (rate limiting tracking)

**Verification:** Check migrations folder appears: `prisma/migrations/`

---

#### 4. Seed Admin User (CRITICAL)
**Status:** ❌ **NOT DONE**

```bash
# Create initial admin user
yarn prisma:seed
```

This creates admin user from `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` in `.env`.

**Verification:** 
```bash
# Open Prisma Studio to verify
yarn prisma:studio
# Check AdminUser table has 1 entry
```

---

#### 5. Install Dependencies (CRITICAL)
**Status:** ❌ **NOT DONE** (Based on fresh setup)

```bash
# Install all packages
yarn install

# This installs:
# - Next.js, React
# - Prisma client
# - Mantine UI components
# - Zod validation
# - NextAuth
# - argon2, nodemailer, pino
# - Tailwind CSS
```

---

#### 6. Start Development Server
**Status:** ⏸️ **READY TO TEST**

```bash
yarn dev
# Server: http://localhost:3000
```

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Homepage loads with hero section
- [ ] MSU logo and branding visible
- [ ] Privacy note displays correctly
- [ ] "Fill partial Form" button works
- [ ] "Fill full detail form" button works
- [ ] Forms toggle correctly when buttons clicked
- [ ] Footer info and logo display

### Partial Form Tests
- [ ] All fields render: Name, Email, Phone, DOB, Address, Study Level, Previous College, Term, Major, Country of Birth
- [ ] Required field validation works (red asterisks)
- [ ] Submit button enabled/disabled correctly
- [ ] Clear Form button resets all fields
- [ ] Form submits successfully to `/api/submissions`
- [ ] Success notification appears
- [ ] Form resets after successful submission

### Full Form Tests
- [ ] Wizard shows 10 steps with progress bar
- [ ] Step 1: Personal Information fields work
- [ ] Step 2: Contact & Address fields work
- [ ] Step 3: Academic Background fields work
- [ ] Step 4: Transfer Details fields work
- [ ] Step 5: Academic Performance fields work
- [ ] Step 6: Financial Information fields work
- [ ] Step 7: Transfer Motivation fields work
- [ ] Step 8: Additional Information fields work
- [ ] Step 9: Immigration Status fields work
- [ ] Step 10: Communication Preferences fields work
- [ ] "Next" button validation works (can't proceed with invalid data)
- [ ] "Back" button works
- [ ] Final submit works
- [ ] Success notification appears
- [ ] Wizard resets after submission

### API Tests
```bash
# Test form submission
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formMode": "partial",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "consent": true
  }'

# Expected: 201 Created with submission ID

# Test rate limiting (send 21+ requests quickly)
# Expected: 429 Too Many Requests

# Test health check
curl http://localhost:3000/api/healthz
# Expected: {"status":"healthy"}
```

### Database Tests
```bash
# Open Prisma Studio
yarn prisma:studio

# Verify:
# 1. Submission table has entries after form submission
# 2. Email, phone, name fields populated correctly
# 3. formMode is "partial" or "full"
# 4. ipHash is stored (not raw IP - privacy!)
# 5. Timestamps are correct
```

### Admin Authentication Tests
- [ ] Navigate to `/admin/login`
- [ ] Login with admin credentials from `.env`
- [ ] Dashboard loads successfully
- [ ] Can view submissions list
- [ ] Can filter/search submissions
- [ ] Can export to CSV
- [ ] Logout works

### Rate Limiting Tests
- [ ] Submit form 20 times from same IP - should succeed
- [ ] Submit 21st time - should return 429 error
- [ ] Wait 10 minutes - should work again
- [ ] Submit from different email 20 times - should succeed
- [ ] Submit from same email 21st time - should return 429 error

### Email Notification Tests (if SMTP enabled)
- [ ] Submit form
- [ ] Admin receives email notification with:
  - Submission ID
  - User's full name
  - User's email
  - Form mode (partial/full)
  - Link to view in admin dashboard

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Test connection
psql -d transfer_advising -U app

# Verify DATABASE_URL format:
# postgresql://username:password@host:port/database?schema=public
```

### Issue: "Prisma Client not generated"
**Solution:**
```bash
yarn prisma:generate
# Restart dev server
```

### Issue: "NextAuth URL mismatch"
**Solution:**
Check `NEXTAUTH_URL` in `.env` matches your dev server URL (http://localhost:3000)

### Issue: "Admin login fails"
**Solution:**
```bash
# Re-run seed
yarn prisma:seed

# Or manually reset admin password in Prisma Studio
yarn prisma:studio
# Navigate to AdminUser table, delete entry, re-seed
```

### Issue: "Images not showing"
**Solution:**
Place actual image files in `public/images/`:
- `hero.png` - Hero background image
- `logos.png` - MSU logo (200x70px recommended)
- `msu-footer-logo.png` - Footer logo (150x50px recommended)

### Issue: "Form validation errors"
**Solution:**
Check browser console for Zod validation errors. Common issues:
- Email format invalid
- Phone number format
- Required fields missing
- Date format incorrect (use YYYY-MM-DD)

---

## 📊 Database Schema Reference

### Submission Table
- `id` - UUID (auto-generated)
- `formMode` - "partial" | "full"
- `fullName` - String (required)
- `email` - String (required)
- `phone` - String (required)
- `dateOfBirth` - Date (full form only)
- `address` - String (full form only)
- `studyLevel` - Enum (full form only)
- `major` - String
- ... (30+ total fields)
- `createdAt` - DateTime
- `ipHash` - String (privacy-protected IP)

### AdminUser Table
- `id` - UUID
- `email` - Unique string
- `password` - Argon2 hashed
- `name` - String
- `createdAt` - DateTime

### RateLimit Table
- `id` - UUID
- `identifier` - String (hashed IP or email)
- `type` - "ip" | "email"
- `count` - Int
- `resetAt` - DateTime

---

## 🚀 Quick Start Commands

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your values

# 2. Install dependencies
yarn install

# 3. Setup database
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed

# 4. Start development
yarn dev

# 5. Open in browser
# http://localhost:3000
```

---

## ✅ System Ready Criteria

Your system is **READY** when:
1. ✅ `.env` file created and configured
2. ✅ PostgreSQL database running and connected
3. ✅ Prisma migrations completed (tables created)
4. ✅ Admin user seeded
5. ✅ `yarn dev` runs without errors
6. ✅ Homepage loads at http://localhost:3000
7. ✅ Both forms (partial/full) can be submitted
8. ✅ Submissions appear in database (verify with Prisma Studio)
9. ✅ Admin can login at `/admin/login`
10. ✅ Rate limiting works (test with 21+ requests)

---

## 📝 Current Status

**Can users fill out the form?** 
**❌ NO** - System needs database setup first

**What's blocking?**
1. No `.env` file (database connection undefined)
2. Database not initialized (no tables exist)
3. No admin user seeded (can't access admin panel)

**Time to ready:** ~10 minutes
1. Create `.env` file (2 min)
2. Setup PostgreSQL (3 min)
3. Run migrations + seed (2 min)
4. Test submission (3 min)

**Next Steps:**
Run the Quick Start Commands above ⬆️

---

## 🎯 Production Deployment Checklist

When ready for production:
- [ ] Setup production database (Supabase/Railway/Neon)
- [ ] Configure production environment variables
- [ ] Run `yarn prisma:deploy` (not migrate dev)
- [ ] Setup SMTP for email notifications
- [ ] Configure domain and SSL
- [ ] Deploy to Vercel/Railway/your VPS
- [ ] Test all endpoints in production
- [ ] Setup monitoring (Sentry/LogRocket)
- [ ] Configure backup strategy for database
- [ ] Setup admin user in production
- [ ] Test rate limiting in production

