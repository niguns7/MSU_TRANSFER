# Deployment Guide - Fixed Prisma v7 Issue

## What Was Fixed

1. **Dockerfile Line 28**: Changed `npx prisma generate` → `yarn prisma:generate`
2. **Dockerfile Line 60**: Added `node_modules/prisma` and `package.json` to runner
3. **Dockerfile Line 69**: Changed `npx prisma migrate deploy` → `node_modules/.bin/prisma migrate deploy`
4. **package.json**: Updated Prisma from v5.20.0 to v6.8.0

## Deployment Options

### Option 1: Use Quick Fix Script (Recommended)

```bash
./quick-fix.sh
```

This will:
- Commit all changes
- Push to GitHub
- Deploy to server
- Show logs

### Option 2: Use Full Deployment Script

```bash
./deploy-fixed.sh
```

This includes:
- Interactive commit prompts
- Health checks
- Detailed status
- Verification steps

### Option 3: Manual Deployment

#### On Local Machine:

```bash
cd "/Users/nirgunsubedi/Desktop/Work/Abroad /MSU_TRANSFER"

# Commit changes
git add Dockerfile package.json yarn.lock deploy-fixed.sh quick-fix.sh
git commit -m "Fix: Pin Prisma to v6.8.0 and update Dockerfile"
git push origin main
```

#### On Server:

```bash
# SSH to server
ssh root@abroadinst

# Navigate to project
cd /opt/transfer-advising-form/MSU_TRANSFER

# Pull latest
git stash
git pull origin main

# Stop containers
docker compose down

# Remove old image
docker rmi transfer-form-web -f

# Clear build cache
docker builder prune -f

# Rebuild with no cache
docker compose build --no-cache web

# Start services
docker compose up -d

# Wait 30 seconds
sleep 30

# Check logs
docker logs transfer-form-web --tail 50

# Check status
docker compose ps
```

## Verification

After deployment, verify:

1. **Container is running**:
   ```bash
   ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose ps'
   ```

2. **No Prisma errors in logs**:
   ```bash
   ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker logs transfer-form-web --tail 100'
   ```
   - Should NOT see "prisma@7.0.1"
   - Should NOT see "url is no longer supported"
   - Should see "Ready" or "server started"

3. **Website is accessible**:
   ```bash
   curl -I https://midwesternstateuniversity.transfer-advising-form.abroadinst.com
   ```
   - Should return HTTP 200

4. **API works**:
   ```bash
   curl https://midwesternstateuniversity.transfer-advising-form.abroadinst.com/api/healthz
   ```
   - Should return `{"status":"ok"}`

## Troubleshooting

### If container keeps restarting:

```bash
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker logs transfer-form-web'
```

### If 502 Bad Gateway persists:

```bash
# Check if port 3000 is accessible
ssh root@abroadinst 'curl http://localhost:3000/api/healthz'

# Check nginx logs
ssh root@abroadinst 'tail -50 /var/log/nginx/error.log'
```

### If database connection fails:

```bash
# Check database is running
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose ps db'

# Test database connection
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose exec db psql -U transferuser -d transferdb -c "SELECT 1;"'
```

## Expected Log Output

After successful deployment, logs should show:

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "transferdb"
...
The database is already in sync with the Prisma schema.
✓ Compiled successfully
- Local:        http://0.0.0.0:3000
- Network:      http://0.0.0.0:3000
Ready in X ms
```

## Quick Commands Reference

```bash
# View logs
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker logs -f transfer-form-web'

# Restart service
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose restart web'

# Full restart
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose down && docker compose up -d'

# Check status
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose ps'

# Access container shell
ssh root@abroadinst 'cd /opt/transfer-advising-form/MSU_TRANSFER && docker compose exec web sh'
```

## URLs

- 🌐 **Website**: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com
- 🏥 **Health Check**: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com/api/healthz
- 👤 **Admin Login**: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com/admin/login

## Success Indicators

✅ Container status shows "running" (not "restarting")
✅ Logs show no Prisma v7 errors
✅ Website loads without 502 error
✅ Form submissions work
✅ Health check returns OK
