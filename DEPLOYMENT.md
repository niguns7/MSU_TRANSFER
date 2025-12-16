# Transfer Advising Form - Deployment Guide

## Prerequisites
- Ubuntu/Debian server (Digital Ocean, AWS, etc.)
- Domain name configured
- Server with at least 2GB RAM, 20GB disk
- Root/sudo access to the server

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 1.3 Install Git & Node.js (for building)
```bash
sudo apt install git -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step 2: Deploy Application

### 2.1 Clone Repository
```bash
cd /opt
sudo git clone YOUR_REPOSITORY_URL transfer-advising-form
sudo chown -R $USER:$USER transfer-advising-form
cd transfer-advising-form
```

### 2.2 Install Dependencies & Build
```bash
npm install --production
npm run build
```

### 2.3 Configure Environment
Edit docker-compose.yml if needed:
```bash
nano docker-compose.yml
```

Update these values in the environment section:
- `NEXTAUTH_URL`: Your domain URL
- `DATABASE_URL`: Your database connection string
- `SMTP_*`: Email configuration

### 2.4 Start Services
```bash
# Start in background
docker-compose up -d

# Check logs
docker-compose logs -f web
```

## Step 3: Database Setup

### 3.1 Run Database Migrations
```bash
# Connect to the web container
docker-compose exec web npx prisma migrate deploy

# Generate Prisma client
docker-compose exec web npx prisma generate

# Seed admin user (optional)
docker-compose exec web npx prisma db seed
```

### 3.2 Verify Database Connection
```bash
docker-compose exec web npx prisma studio --port 5555 --browser none
```

## Step 4: SSL & Reverse Proxy Setup

### 4.1 Install Nginx
```bash
sudo apt install nginx -y
```

### 4.2 Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/transfer-form
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name midwesternstateuniversity.transfer-advising-form.abroadinst.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.3 Enable Site & Install SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/transfer-form /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d midwesternstateuniversity.transfer-advising-form.abroadinst.com
```

## Step 5: Firewall Configuration
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Step 6: Process Management

### 6.1 Auto-restart on Boot
```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Create systemd service for the app
sudo nano /etc/systemd/system/transfer-form.service
```

Add this content:
```ini
[Unit]
Description=Transfer Advising Form
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/transfer-advising-form
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable transfer-form.service
sudo systemctl start transfer-form.service
```

## Step 7: Monitoring & Logs

### 7.1 Log Management
```bash
# View application logs
docker-compose logs -f web

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 7.2 Health Checks
```bash
# Check container status
docker-compose ps

# Check application health
curl -f http://localhost:3000/api/healthz
```

## Step 8: Backup Strategy

### 8.1 Database Backup
```bash
# Create backup script
nano ~/backup-db.sh
```

Add this content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U transferuser transferdb > /opt/backups/db_backup_$DATE.sql
find /opt/backups -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable and schedule
chmod +x ~/backup-db.sh
sudo mkdir -p /opt/backups

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup-db.sh") | crontab -
```

## Step 9: Post-Deployment Verification

### 9.1 Test Application
1. Visit: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com
2. Submit initial form
3. Check email delivery
4. Access admin panel: /admin/login
5. Verify database entries: /admin/submissions

### 9.2 Performance Optimization
```bash
# Monitor resource usage
docker stats

# Optimize if needed
docker-compose down
docker-compose up -d --scale web=2  # Scale if needed
```

## Maintenance Commands

```bash
# Update application
cd /opt/transfer-advising-form
git pull origin main
npm run build

# Build and start containers
docker-compose build
docker-compose up -d

# IMPORTANT: Run database migrations for schema changes
docker-compose exec web npx prisma migrate deploy

# Generate Prisma client (if needed)
docker-compose exec web npx prisma generate

# Restart web container to ensure latest code is loaded
docker-compose restart web

# View logs
docker-compose logs -f web

# Restart services
docker-compose restart

# Clean up unused Docker resources
docker system prune -a
```

## Troubleshooting

### Common Issues:
1. **502 Bad Gateway**: Check if app is running (`docker-compose ps`)
2. **Database Connection**: Verify DATABASE_URL in docker-compose.yml
3. **Email Not Sending**: Check SMTP credentials and firewall
4. **SSL Issues**: Renew certificate (`sudo certbot renew`)

### Debug Commands:
```bash
# Check container logs
docker-compose logs web

# Enter container shell
docker-compose exec web bash

# Check database connection
docker-compose exec web npx prisma studio
```

## Security Checklist
- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (UFW)
- [ ] Strong passwords for database and admin
- [ ] Regular security updates
- [ ] Database backups scheduled
- [ ] Log monitoring in place