# Deployment Checklist

## Pre-Deployment

### Local Testing
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Database migrations work: `npx prisma migrate dev`

### Code Review
- [ ] All changes committed to Git
- [ ] Commit messages are clear
- [ ] No sensitive data in code
- [ ] `.env` file not committed
- [ ] Performance optimizations applied

### Environment Files
- [ ] `.env` file ready for server
- [ ] `DATABASE_URL` includes connection pool params
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `NEXTAUTH_URL` points to production domain
- [ ] All required env vars present

---

## Server Preparation

### First-Time Setup (Skip if already done)
- [ ] Server has Docker installed
- [ ] Server has Node.js 22 (via nvm)
- [ ] Server has Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured (80, 443, 22)
- [ ] PostgreSQL database accessible

### Project Setup
- [ ] Project cloned to `/opt/transfer-advising-form`
- [ ] `.env` file uploaded to server
- [ ] Scripts are executable: `chmod +x *.sh`
- [ ] Backup directory created: `/opt/backups/transfer-advising-form`

---

## Deployment Steps

### Method 1: Quick Deploy (Recommended)

```bash
# SSH to server
ssh root@your-server-ip

# Navigate to project
cd /opt/transfer-advising-form

# Run deployment
sudo ./quick-deploy.sh
```

### Method 2: Full Deploy (With Backups)

```bash
sudo ./deploy.sh
```

### Method 3: Manual Deploy

Follow steps in `DEPLOYMENT_SCRIPTS.md`

---

## Post-Deployment Verification

### Health Checks
- [ ] Containers running: `docker compose ps`
- [ ] Web container healthy
- [ ] Database accessible
- [ ] Nginx running: `systemctl status nginx`

### Application Tests
- [ ] Homepage loads: `curl http://your-server/`
- [ ] API responds: `curl http://your-server/api/healthz`
- [ ] Form submission works
- [ ] Admin login works: `https://your-server/admin/login`

### Performance Checks
- [ ] Response time < 500ms
- [ ] No errors in logs: `docker compose logs web`
- [ ] Rate limiting works
- [ ] Database connections stable

---

## Verification Commands

```bash
# Check container status
docker compose ps

# View recent logs
docker compose logs --tail=50 web

# Test health endpoint
curl -i http://localhost:3000/api/healthz

# Check database connection
docker compose exec db psql -U transferuser -d transferdb -c "SELECT NOW();"

# Test form submission
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formMode": "partial",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "consent": true
  }'

# Check nginx status
nginx -t
systemctl status nginx

# Monitor performance
docker compose logs web | grep "perf:"
```

---

## Rollback Plan

If deployment fails:

### Quick Rollback
```bash
# List backups
ls -lh /opt/backups/transfer-advising-form/

# Rollback
sudo ./rollback.sh /opt/backups/transfer-advising-form/backup_TIMESTAMP.tar.gz
```

### Manual Rollback
```bash
# Revert Git changes
git reset --hard HEAD~1

# Rebuild
npm ci
npm run build
docker compose restart
```

---

## Common Issues & Solutions

### Issue: Build fails
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Issue: Database migration fails
```bash
npx prisma migrate status
npx prisma migrate deploy
```

### Issue: Containers won't start
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Issue: Nginx 502 error
```bash
docker compose ps
docker compose logs web
docker compose restart web
systemctl restart nginx
```

---

## Security Checklist

### File Permissions
```bash
chmod 600 .env
chmod 755 *.sh
chown -R www-data:www-data .next
```

### Environment Security
- [ ] Strong passwords (12+ chars)
- [ ] No default credentials
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] CORS configured

### Database Security
- [ ] Strong database password
- [ ] Limited database user permissions
- [ ] Backup encryption enabled
- [ ] Connection over SSL (if applicable)

---

## Performance Monitoring

### After Deployment
```bash
# Check response times
docker compose logs web | grep "Total time"

# Monitor cache efficiency
docker compose logs web | grep "rate limit"

# Database query performance
docker compose logs web | grep "prisma:query"
```

### Baseline Metrics
- API response time: < 300ms
- Rate limit check: < 50ms (cached)
- Database insert: < 150ms
- Page load time: < 2s

---

## Documentation Updates

After successful deployment:

- [ ] Update `DEPLOYMENT.md` with any changes
- [ ] Document any issues encountered
- [ ] Update version number
- [ ] Tag release in Git
- [ ] Notify team of deployment

---

## Backup Verification

### Automatic Backups
- [ ] Backup created before deployment
- [ ] Backup size looks correct
- [ ] Old backups cleaned up (keep 5)

### Manual Backup Test
```bash
# Create backup
tar -czf test_backup.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    .

# Verify backup
tar -tzf test_backup.tar.gz | head -20
```

---

## Emergency Contacts

**Technical Issues:**
- DevOps: [Your contact]
- Database Admin: [Your contact]

**Service Status:**
- Health Check: `https://your-domain.com/api/healthz`
- Status Page: [If available]

---

## Post-Deployment Tasks

### Immediate (0-1 hour)
- [ ] Monitor logs for errors
- [ ] Test critical user flows
- [ ] Verify email notifications
- [ ] Check rate limiting

### Short-term (1-24 hours)
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Verify backups running

### Long-term (1-7 days)
- [ ] Analyze performance logs
- [ ] Review optimization impact
- [ ] Plan next improvements
- [ ] Update documentation

---

## Deployment Sign-off

**Deployed by:** _______________  
**Date:** _______________  
**Time:** _______________  
**Version:** _______________  
**Git Commit:** _______________  

**Status:**
- [ ] ✅ Deployment successful
- [ ] ⚠️  Deployment with warnings (describe): _______________
- [ ] ❌ Deployment failed (rolled back)

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## Quick Reference

```bash
# Deploy
sudo ./quick-deploy.sh

# Rollback
sudo ./rollback.sh /opt/backups/transfer-advising-form/backup_*.tar.gz

# Logs
docker compose logs -f web

# Status
docker compose ps

# Restart
docker compose restart web
systemctl reload nginx

# Health
curl http://localhost:3000/api/healthz
```

---

**Last Updated:** November 11, 2025  
**Maintained by:** Development Team
