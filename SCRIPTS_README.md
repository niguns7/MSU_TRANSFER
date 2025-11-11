# 🚀 Deployment Scripts - Quick Reference

Complete deployment automation for Transfer Advising Form.

---

## 📋 Available Scripts

| Script | Purpose | Use When |
|--------|---------|----------|
| `quick-deploy.sh` | Fast deployment | Regular updates |
| `deploy.sh` | Full deployment with backups | Major releases |
| `rollback.sh` | Emergency rollback | Something breaks |

---

## ⚡ Quick Start

### Deploy Latest Changes

```bash
# SSH to server
ssh root@137.184.223.111

# Navigate to project
cd /opt/transfer-advising-form

# Deploy
sudo ./quick-deploy.sh
```

**That's it!** ✨

---

## 📝 Script Details

### 1. `quick-deploy.sh` - Fast Deployment

**Best for:** Daily/weekly updates, bug fixes, minor changes

**What it does:**
1. Pulls latest code from Git
2. Installs dependencies
3. Runs database migrations
4. Builds application
5. Restarts Docker containers
6. Reloads Nginx

**Time:** 2-3 minutes

```bash
sudo ./quick-deploy.sh
```

---

### 2. `deploy.sh` - Full Deployment

**Best for:** Major releases, first deployment, production updates

**What it does:**
- Everything `quick-deploy.sh` does, plus:
- Creates timestamped backup
- Performs health checks
- Logs to file
- Cleans old backups

**Time:** 3-5 minutes

```bash
sudo ./deploy.sh
```

**Features:**
- Automatic backup before deployment
- Health checks after deployment
- Detailed logging
- Automatic cleanup of old backups

---

### 3. `rollback.sh` - Emergency Rollback

**Best for:** When deployment breaks something

**What it does:**
1. Lists available backups
2. Restores selected backup
3. Rebuilds application
4. Restarts services

**Usage:**

```bash
# List backups
ls -lh /opt/backups/transfer-advising-form/

# Rollback to specific backup
sudo ./rollback.sh /opt/backups/transfer-advising-form/backup_20250111_120000.tar.gz
```

---

## 🎯 Usage Examples

### Regular Update
```bash
cd /opt/transfer-advising-form
sudo ./quick-deploy.sh
```

### Major Release
```bash
cd /opt/transfer-advising-form
sudo ./deploy.sh
```

### Fix Broken Deployment
```bash
cd /opt/transfer-advising-form
sudo ./rollback.sh /opt/backups/transfer-advising-form/backup_LATEST.tar.gz
```

### Check Status
```bash
docker compose ps
docker compose logs -f web
```

---

## 🔧 Prerequisites

### Server Requirements
- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- 2GB+ RAM
- 20GB+ disk space

### Software Required
- Docker & Docker Compose
- Node.js 22 (via nvm)
- Nginx
- Git
- PostgreSQL (remote or local)

### First-Time Setup

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 22
nvm install 22
nvm use 22

# Clone project
git clone https://github.com/niguns7/MSU_TRANSFER.git /opt/transfer-advising-form

# Navigate
cd /opt/transfer-advising-form

# Copy .env file
nano .env  # Paste your environment variables

# Make scripts executable
chmod +x *.sh

# First deployment
sudo ./deploy.sh
```

---

## 🌍 Environment Variables

Required in `.env`:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Transfer Advising Form

# Database (with connection pooling)
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=15&pool_timeout=20&connect_timeout=10"

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET="generate-strong-secret"

# Admin
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=ChangeMe123!

# Rate Limiting
RATE_LIMIT_WINDOW=600000
RATE_LIMIT_MAX=20
IP_HASH_SECRET="generate-secret"

# Email (optional)
SMTP_ENABLED=false
```

---

## 📊 Monitoring

### View Logs
```bash
# Application logs
docker compose logs -f web

# Deployment logs
tail -f /var/log/transfer-advising-form-deploy.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check Performance
```bash
# Response times
docker compose logs web | grep "Total time"

# Rate limit efficiency
docker compose logs web | grep "perf:"

# Database queries
docker compose logs web | grep "prisma:query"
```

### Health Checks
```bash
# Container status
docker compose ps

# Database connection
docker compose exec db pg_isready -U transferuser

# API health
curl http://localhost:3000/api/healthz

# Full test
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"formMode":"partial","fullName":"Test","email":"test@test.com","phone":"1234567890","consent":true}'
```

---

## 🐛 Troubleshooting

### Deployment Fails

```bash
# Clear and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
docker compose up -d --build
```

### Database Issues

```bash
# Check migrations
npx prisma migrate status

# Deploy migrations
npx prisma migrate deploy

# Restart database
docker compose restart db
```

### Nginx Issues

```bash
# Test config
nginx -t

# Restart nginx
systemctl restart nginx

# Check logs
tail -f /var/log/nginx/error.log
```

### Container Issues

```bash
# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up -d

# Check logs
docker compose logs web
```

---

## 🔐 Security Notes

### File Permissions
```bash
chmod 600 .env                    # Protect secrets
chmod 755 *.sh                    # Scripts executable
chmod 644 prisma/schema.prisma    # Schema readable
```

### Backup Security
```bash
# Backup directory permissions
chmod 700 /opt/backups/transfer-advising-form
```

### Database Security
- Use strong passwords (20+ characters)
- Limit database user permissions
- Use connection pooling
- Enable SSL for remote connections

---

## 📈 Performance Tips

### Optimize Database Connection

In `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=15&pool_timeout=20&connect_timeout=10"
```

### Monitor Cache Efficiency

```bash
# Check rate limit cache hits
docker compose logs web | grep "cache"
```

### Benchmark Performance

```bash
# Install Apache Bench
apt install apache2-utils

# Test 100 requests
ab -n 100 -c 10 http://localhost:3000/
```

---

## 📁 File Structure

```
/opt/transfer-advising-form/
├── deploy.sh                    # Full deployment script
├── quick-deploy.sh              # Fast deployment script
├── rollback.sh                  # Rollback script
├── .env                         # Environment variables
├── docker-compose.yml           # Docker configuration
├── package.json                 # Dependencies
├── prisma/                      # Database schema
└── app/                         # Application code

/opt/backups/transfer-advising-form/
├── backup_20250111_120000.tar.gz
├── backup_20250111_140000.tar.gz
└── ...

/var/log/
└── transfer-advising-form-deploy.log
```

---

## 🎓 Best Practices

### Before Deployment
1. Test locally first
2. Commit all changes
3. Update documentation
4. Review `.env` file

### During Deployment
1. Use `quick-deploy.sh` for regular updates
2. Use `deploy.sh` for major releases
3. Monitor logs during deployment
4. Test immediately after

### After Deployment
1. Verify health checks pass
2. Test critical user flows
3. Monitor logs for 10-15 minutes
4. Keep backup for 24 hours before cleaning

---

## 📞 Support

### Get Help

```bash
# View deployment log
cat /var/log/transfer-advising-form-deploy.log

# View application logs
docker compose logs web | tail -100

# Check script help
./quick-deploy.sh --help
```

### Contact
- Email: admissions@abroadaxis.com
- GitHub Issues: https://github.com/niguns7/MSU_TRANSFER/issues

---

## 🔄 Update Scripts

To update the deployment scripts themselves:

```bash
# Pull latest scripts
git pull origin main

# Make executable
chmod +x *.sh

# Test
sudo ./quick-deploy.sh
```

---

## ✅ Checklist

Before running deployment:

- [ ] `.env` file configured
- [ ] Database accessible
- [ ] Scripts executable (`chmod +x *.sh`)
- [ ] Backup directory exists
- [ ] Server has enough disk space
- [ ] No active users (if possible)

After deployment:

- [ ] Containers running (`docker compose ps`)
- [ ] Health check passes
- [ ] No errors in logs
- [ ] Forms submitting correctly
- [ ] Admin panel accessible

---

## 🚨 Emergency Procedures

### If Site Goes Down

```bash
# 1. Check containers
docker compose ps

# 2. Restart if needed
docker compose restart

# 3. Check logs
docker compose logs --tail=100 web

# 4. If still down, rollback
sudo ./rollback.sh /opt/backups/transfer-advising-form/backup_LATEST.tar.gz
```

### If Database Corrupted

```bash
# 1. Stop application
docker compose stop web

# 2. Restore database backup
docker compose exec -T db psql -U transferuser transferdb < backup.sql

# 3. Restart
docker compose start web
```

---

**Created:** November 11, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

---

## 📚 Related Documentation

- `DEPLOYMENT_SCRIPTS.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST_V2.md` - Step-by-step checklist
- `PERFORMANCE_OPTIMIZATIONS_V2.md` - Performance improvements
- `DEPLOYMENT.md` - Original deployment docs
