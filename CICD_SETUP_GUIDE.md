# CI/CD Setup Guide for Transfer Advising Form

This guide will help you set up automated CI/CD deployment for your application using GitHub Actions.

## Overview

The CI/CD pipeline includes:
- **Automated Testing** on pull requests
- **Docker Image Building** and pushing to Docker Hub
- **Automated Deployment** to production server
- **Health Checks** after deployment
- **Automatic Rollback** on failure

## Prerequisites

1. GitHub repository with `main` and `production` branches
2. Docker Hub account
3. Production server with SSH access
4. Domain name configured

## Step 1: Create Production Branch

```bash
# Create and push production branch
git checkout -b production
git push -u origin production
```

## Step 2: Configure GitHub Repository Settings

### 2.1 Enable GitHub Actions
1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions and reusable workflows**
4. Click **Save**

### 2.2 Create Environment
1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `production`
4. Optionally add protection rules:
   - ✅ Required reviewers (add yourself or team members)
   - ✅ Wait timer (e.g., 5 minutes)
5. Click **Save protection rules**

## Step 3: Add GitHub Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

### Docker Hub Credentials
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

### Server SSH Credentials
- `SSH_PRIVATE_KEY`: Your SSH private key (paste the entire key including headers)
- `SERVER_HOST`: Your server IP address (e.g., `123.45.67.89`)
- `SSH_USER`: SSH username (e.g., `root`)

### Application Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production URL (e.g., `https://transfer.yourdomain.com`)
- `ADMIN_EMAIL`: Admin email for login
- `ADMIN_PASSWORD`: Admin password (hashed)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP port (e.g., `587`)
- `SMTP_USER`: SMTP username
- `SMTP_PASSWORD`: SMTP password
- `SMTP_FROM`: Email sender address
- `NEXT_PUBLIC_META_PIXEL_ID`: Meta Pixel ID (if using)
- `PRODUCTION_DOMAIN`: Your domain (e.g., `transfer.yourdomain.com`)

## Step 4: Generate and Add SSH Key

### 4.1 Generate SSH Key (on your local machine)

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# This creates two files:
# - github_deploy_key (private key - add to GitHub Secrets)
# - github_deploy_key.pub (public key - add to server)
```

### 4.2 Add Public Key to Server

```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub your_user@your_server_ip

# Or manually:
cat ~/.ssh/github_deploy_key.pub
# Then SSH to server and add to ~/.ssh/authorized_keys
```

### 4.3 Add Private Key to GitHub Secrets

```bash
# Display private key
cat ~/.ssh/github_deploy_key

# Copy the entire output including the headers:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

Add this to GitHub as `SSH_PRIVATE_KEY` secret.

## Step 5: Prepare Your Server

### 5.1 Install Docker and Docker Compose

```bash
# SSH to your server
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

# Verify installation
docker --version
docker-compose --version
```

### 5.2 Create Deployment Directory

```bash
sudo mkdir -p /opt/transfer-advising-form
sudo chown $USER:$USER /opt/transfer-advising-form
```

### 5.3 Configure Nginx (if using reverse proxy)

```bash
# Install Nginx
sudo apt update
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/transfer-advising
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/transfer-advising /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.4 Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

## Step 6: Update docker-compose.yml for Production

Make sure your `docker-compose.yml` includes:

```yaml
version: '3.8'

services:
  app:
    image: ${DOCKER_USERNAME}/transfer-advising-form:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres
    networks:
      - app-network

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-transfer_advising}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## Step 7: Workflow Triggers

### Automatic Deployment
Push to `production` branch:

```bash
# Make changes
git add .
git commit -m "Deploy: Updated feature X"
git push origin production
```

### Manual Deployment
1. Go to **Actions** tab on GitHub
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Select `production` branch
5. Click **Run workflow**

## Step 8: Monitor Deployments

### View Deployment Logs
1. Go to **Actions** tab
2. Click on the running/completed workflow
3. Click on individual jobs to see logs

### Check Application Logs on Server

```bash
# SSH to server
ssh your_user@your_server_ip

# View logs
cd /opt/transfer-advising-form
docker-compose logs -f app

# Check container status
docker-compose ps
```

## Deployment Workflow

```
┌─────────────────┐
│  Push to        │
│  production     │
│  branch         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Run Tests      │
│  - Lint         │
│  - Type check   │
│  - Unit tests   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Docker   │
│  Image          │
│  - Build        │
│  - Push to Hub  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy to      │
│  Server         │
│  - SSH connect  │
│  - Pull image   │
│  - Restart app  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Health Check   │
│  - Test /healthz│
│  - Verify status│
└────────┬────────┘
         │
    Success? ──No──► Rollback
         │
        Yes
         │
         ▼
   ✅ Deployed!
```

## Troubleshooting

### SSH Connection Issues
```bash
# Test SSH connection
ssh -i ~/.ssh/github_deploy_key your_user@your_server_ip

# Check SSH key permissions
chmod 600 ~/.ssh/github_deploy_key
```

### Docker Permission Issues
```bash
# On server, add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Database Connection Issues
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:password@postgres:5432/dbname

# Test database connection
docker-compose exec app npx prisma db pull
```

### View Deployment Failures
1. Check GitHub Actions logs
2. SSH to server and check Docker logs:
   ```bash
   docker-compose logs -f
   ```

## Rollback Procedure

### Automatic Rollback
If deployment fails health check, automatic rollback is triggered.

### Manual Rollback

```bash
# SSH to server
ssh your_user@your_server_ip
cd /opt/transfer-advising-form

# View available images
docker images

# Use a specific version
docker-compose down
docker tag yourusername/transfer-advising-form:COMMIT_SHA yourusername/transfer-advising-form:latest
docker-compose up -d
```

## Best Practices

1. **Always test locally first**
   ```bash
   docker-compose build
   docker-compose up
   ```

2. **Use feature branches and PRs**
   - Create feature branch from `main`
   - Open PR to `production`
   - Review and test
   - Merge to deploy

3. **Monitor after deployment**
   - Check application logs
   - Monitor error rates
   - Verify functionality

4. **Keep secrets secure**
   - Never commit secrets to git
   - Rotate secrets regularly
   - Use environment-specific secrets

5. **Database migrations**
   - Test migrations on staging first
   - Backup database before deployment
   - Use Prisma migrations properly

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check server logs: `docker-compose logs -f`
3. Verify all secrets are correctly set
4. Test SSH connection manually
5. Check server firewall rules

---

**Created:** November 14, 2025
**Last Updated:** November 14, 2025
