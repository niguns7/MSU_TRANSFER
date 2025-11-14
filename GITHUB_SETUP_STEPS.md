# Quick GitHub Setup Steps

Follow these steps to set up CI/CD on GitHub:

## 1. Create Production Branch

```bash
git checkout -b production
git push -u origin production
```

## 2. Add GitHub Secrets

Go to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets (Copy this checklist):

#### Docker Hub
- [ ] `DOCKER_USERNAME` - Your Docker Hub username
- [ ] `DOCKER_PASSWORD` - Your Docker Hub password/token

#### Server Access
- [ ] `SSH_PRIVATE_KEY` - Your SSH private key (entire key including headers)
- [ ] `SERVER_HOST` - Server IP (e.g., 123.45.67.89)
- [ ] `SSH_USER` - SSH username (e.g., root)

#### Application Config
- [ ] `DATABASE_URL` - postgresql://user:pass@postgres:5432/dbname
- [ ] `NEXTAUTH_SECRET` - Generate: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - https://your-domain.com
- [ ] `ADMIN_EMAIL` - admin@example.com
- [ ] `ADMIN_PASSWORD` - Your admin password
- [ ] `SMTP_HOST` - smtp.gmail.com
- [ ] `SMTP_PORT` - 587
- [ ] `SMTP_USER` - your-email@gmail.com
- [ ] `SMTP_PASSWORD` - your-app-password
- [ ] `SMTP_FROM` - noreply@yourdomain.com
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` - Your Meta Pixel ID (optional)
- [ ] `PRODUCTION_DOMAIN` - your-domain.com

## 3. Create Environment

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name: `production`
4. Add protection rules (optional):
   - Required reviewers
   - Wait timer
5. Save

## 4. Generate SSH Key (Local Machine)

```bash
# Generate key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy_key

# View private key (add to GitHub secret SSH_PRIVATE_KEY)
cat ~/.ssh/github_deploy_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub your_user@your_server_ip
```

## 5. Prepare Server

```bash
# SSH to server
ssh your_user@your_server_ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Create deployment directory
mkdir -p /opt/transfer-advising-form
```

## 6. Configure Nginx (Optional)

```bash
# Install Nginx
sudo apt update && sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/transfer-advising
```

Paste this:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/transfer-advising /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 7. Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Select **Allow all actions and reusable workflows**
3. Save

## 8. Test Deployment

```bash
# Make a change and push to production
git checkout production
git add .
git commit -m "Deploy: Initial deployment"
git push origin production
```

## 9. Monitor

1. Go to **Actions** tab on GitHub
2. Watch the workflow run
3. Check logs if any step fails

## 10. Verify Deployment

```bash
# Check app
curl https://your-domain.com/api/healthz

# Or visit in browser
# https://your-domain.com
```

## Quick Reference Commands

```bash
# View logs on server
ssh your_user@your_server_ip
cd /opt/transfer-advising-form
docker-compose logs -f

# Restart app
docker-compose restart

# Pull latest changes
docker-compose pull
docker-compose up -d

# View running containers
docker-compose ps
```

## Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs** - Click on failed step
2. **Check server logs** - `docker-compose logs -f`
3. **Verify secrets** - Make sure all secrets are set correctly
4. **Test SSH** - `ssh -i ~/.ssh/github_deploy_key user@server`
5. **Check server space** - `df -h`

### Common Issues:

- **SSH connection refused**: Check SSH key in GitHub secrets
- **Docker permission denied**: Run `sudo usermod -aG docker $USER`
- **Port 3000 in use**: Check if another service is using the port
- **Database connection failed**: Verify DATABASE_URL format

---

**Need help?** Check the full guide: `CICD_SETUP_GUIDE.md`
