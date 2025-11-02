# Production Deployment Guide

## Pre-Deployment Checklist

### 1. VPS Requirements
- Ubuntu 22.04 LTS or higher
- Minimum 2GB RAM, 2 CPU cores
- 20GB+ storage
- Root or sudo access
- Domain name configured with DNS

### 2. Install Prerequisites on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Install Git
sudo apt install git -y

# Verify installations
docker --version
docker compose version
git --version
```

## Step-by-Step Deployment

### Step 1: Clone Repository on VPS

```bash
# Create application directory
sudo mkdir -p /opt/transfer-advising-form
sudo chown $USER:$USER /opt/transfer-advising-form

# Clone repository
cd /opt
git clone <YOUR_GITHUB_REPO_URL> transfer-advising-form
cd transfer-advising-form
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Critical variables to update**:

```env
# Production database URL
DATABASE_URL=postgresql://app:YOUR_STRONG_DB_PASSWORD@db:5432/transfer_advising?schema=public

# NextAuth configuration
NEXTAUTH_URL=https://your-actual-domain.com
NEXTAUTH_SECRET=<GENERATE_WITH: openssl rand -base64 32>

# Admin credentials
ADMIN_SEED_EMAIL=admin@your-domain.com
ADMIN_SEED_PASSWORD=<STRONG_PASSWORD>

# Security
IP_HASH_SECRET=<GENERATE_WITH: openssl rand -base64 32>

# Optional: Email notifications
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com
```

### Step 3: Update Docker Compose for Production

Edit `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Update database password:
```yaml
  db:
    environment:
      - POSTGRES_PASSWORD=YOUR_STRONG_DB_PASSWORD  # Match DATABASE_URL
```

### Step 4: Configure Nginx

```bash
# Update nginx configuration
nano ops/nginx/app.conf
```

Replace all instances of `your-domain.com` with your actual domain.

### Step 5: Setup SSL Certificates

```bash
# Install certbot
sudo apt install certbot -y

# Stop nginx if running
docker compose down nginx

# Get SSL certificate
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  --email admin@your-domain.com \
  --agree-tos \
  --non-interactive

# Verify certificates
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

### Step 6: Build and Start Services

```bash
# Build Docker images
docker compose build

# Start all services
docker compose up -d

# Check if services are running
docker compose ps

# View logs
docker compose logs -f
```

### Step 7: Initialize Database

```bash
# Run database migrations
docker compose exec web npx prisma migrate deploy

# Seed admin user
docker compose exec web npm run prisma:seed

# Verify admin user was created
docker compose exec web npx prisma studio
# Or check logs
docker compose logs web | grep "Created admin user"
```

### Step 8: Verify Deployment

1. **Check health endpoint**:
   ```bash
   curl https://your-domain.com/api/healthz
   ```
   Should return: `{"status":"ok",...}`

2. **Access the application**:
   - Public form: `https://your-domain.com`
   - Admin login: `https://your-domain.com/admin/login`

3. **Test form submission**:
   - Fill out the quick contact form
   - Check admin dashboard for the submission

### Step 9: Setup SSL Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup automatic renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Or add to crontab
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet --deploy-hook "docker compose -f /opt/transfer-advising-form/docker-compose.yml restart nginx"
```

### Step 10: Configure Firewall

```bash
# Install UFW (if not already installed)
sudo apt install ufw

# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Database Backups

### Automated Daily Backups

```bash
# Create backup directory
mkdir -p /opt/transfer-advising-form/backups

# Create backup script
cat > /opt/transfer-advising-form/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR=/opt/transfer-advising-form/backups
cd /opt/transfer-advising-form

# Create backup
docker compose exec -T db pg_dump -U app -Fc transfer_advising > $BACKUP_DIR/backup-$DATE.dump

# Keep only last 14 days
find $BACKUP_DIR -name "backup-*.dump" -mtime +14 -delete

echo "Backup completed: backup-$DATE.dump"
EOF

# Make executable
chmod +x /opt/transfer-advising-form/backup.sh

# Test backup
/opt/transfer-advising-form/backup.sh

# Add to crontab for daily 2 AM backups
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/transfer-advising-form/backup.sh >> /var/log/backup.log 2>&1") | crontab -
```

### Restore from Backup

```bash
# List available backups
ls -lh /opt/transfer-advising-form/backups/

# Restore specific backup
cd /opt/transfer-advising-form
docker compose exec -T db pg_restore -U app -d transfer_advising -c < backups/backup-2024-XX-XX.dump
```

## GitHub Actions CI/CD Setup

### 1. Generate SSH Key for Deployment

```bash
# On your VPS
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # Copy this private key
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: Your SSH username (usually your username, not root)
- `VPS_SSH_KEY`: The private key from `~/.ssh/github_deploy`

### 3. Test Automatic Deployment

```bash
# Make a small change
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test CI/CD deployment"
git push origin main

# Watch GitHub Actions
# Go to: https://github.com/<your-repo>/actions
```

## Monitoring & Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f web
docker compose logs -f db
docker compose logs -f nginx

# Last 100 lines
docker compose logs --tail=100 web
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart web

# Rebuild and restart
docker compose up -d --build web
```

### Update Application

```bash
cd /opt/transfer-advising-form

# Pull latest code
git pull origin main

# Rebuild containers
docker compose build web

# Restart with new version
docker compose up -d

# Run migrations if needed
docker compose exec web npx prisma migrate deploy
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker compose logs web

# Check if database is ready
docker compose exec db pg_isready -U app

# Verify environment variables
docker compose exec web env | grep DATABASE_URL
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Restart nginx
docker compose restart nginx
```

### Database Connection Issues

```bash
# Check if database is running
docker compose ps db

# Access database directly
docker compose exec db psql -U app -d transfer_advising

# Reset database (⚠️ deletes all data!)
docker compose down -v
docker compose up -d
docker compose exec web npx prisma migrate deploy
docker compose exec web npm run prisma:seed
```

### High Memory Usage

```bash
# Restart services one by one
docker compose restart web
docker compose restart db

# Check for memory leaks in logs
docker compose logs web | grep -i "memory\|heap"
```

## Security Best Practices

1. **Change default passwords immediately after deployment**
2. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **Monitor logs regularly**
4. **Setup fail2ban** for SSH protection:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```
5. **Enable automatic security updates**:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

## Performance Optimization

### Enable Response Compression

Already configured in Nginx, but verify:
```bash
docker compose exec nginx nginx -T | grep gzip
```

### Database Query Optimization

```bash
# Access Prisma Studio
docker compose exec web npx prisma studio

# Analyze slow queries
docker compose exec db psql -U app -d transfer_advising -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

## Scaling Considerations

For high traffic:
1. Add Redis for rate limiting (replace in-database solution)
2. Use external PostgreSQL service (AWS RDS, DigitalOcean Managed DB)
3. Deploy multiple web containers behind load balancer
4. Use CDN for static assets
5. Implement database connection pooling

## Support & Rollback

### Rollback to Previous Version

```bash
cd /opt/transfer-advising-form

# Find previous commit
git log --oneline -5

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and restart
docker compose up -d --build
```

### Emergency Shutdown

```bash
docker compose down
```

### Emergency Restore

```bash
# Stop services
docker compose down

# Restore from backup
docker compose up -d db
sleep 10
docker compose exec -T db pg_restore -U app -d transfer_advising -c < backups/latest-backup.dump

# Start all services
docker compose up -d
```

---

## Quick Commands Reference

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Logs
docker compose logs -f web

# Restart
docker compose restart web

# Rebuild
docker compose up -d --build web

# Backup
/opt/transfer-advising-form/backup.sh

# Update
git pull && docker compose up -d --build
```

---

**Deployment completed!** 🎉

Your Transfer Advising Form is now live at `https://your-domain.com`
