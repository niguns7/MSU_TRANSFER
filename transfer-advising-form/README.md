# Transfer Advising Form

A production-ready full-stack web application for capturing Transfer Advising leads with a multi-step form and admin dashboard.

## 🚀 Features

- **Multi-step Form Wizard**: 10-step comprehensive application form
- **Quick Contact Form**: Minimal partial form for quick leads
- **Admin Dashboard**: View, search, filter, and export submissions
- **Rate Limiting**: IP and email-based protection against spam
- **Email Notifications**: Optional SMTP notifications for new submissions
- **PostgreSQL Database**: Robust data persistence with Prisma ORM
- **Secure Authentication**: NextAuth with argon2 password hashing
- **Docker Deployment**: Containerized application with Nginx reverse proxy
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions
- **Responsive Design**: Mobile-friendly UI with Mantine components

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (for deployment)
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd transfer-advising-form
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and update the following critical values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/transfer_advising?schema=public
NEXTAUTH_SECRET=<generate-a-strong-secret-min-32-chars>
ADMIN_SEED_EMAIL=admin@yourdomain.com
ADMIN_SEED_PASSWORD=<strong-password>
IP_HASH_SECRET=<another-strong-secret>
```

### 4. Setup database

```bash
# Run migrations
npx prisma migrate dev

# Seed admin user
npm run prisma:seed
```

### 5. Start development server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Project Structure

```
|--
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── submissions/  # Form submission API
│   │   ├── admin/        # Admin API endpoints
│   │   └── healthz/      # Health check
│   ├── admin/            # Admin pages
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── steps/           # Form wizard steps
│   ├── FullFormWizard.tsx
│   └── PartialFormModal.tsx
├── lib/                  # Utilities & configurations
│   ├── prisma.ts        # Database client
│   ├── validations.ts   # Zod schemas
│   ├── auth.ts          # NextAuth config
│   ├── rate-limit.ts    # Rate limiting logic
│   ├── email.ts         # Email service
│   └── logger.ts        # Pino logger
├── prisma/              # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── ops/                 # Operations & deployment
│   └── nginx/
│       └── app.conf
├── .github/workflows/   # CI/CD pipelines
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🎯 Usage

### Public Form

1. Visit the homepage
2. Choose "Quick Contact Form" for partial submission or "Complete Application" for full form
3. Fill out the required fields
4. Submit and receive confirmation

### Admin Dashboard

1. Navigate to `/admin/login`
2. Log in with admin credentials
3. View all submissions at `/admin/submissions`
4. Use filters and search to find specific submissions
5. Export submissions to CSV

## 🐳 Docker Deployment

### Local Docker Testing

```bash
# Build and run all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Deployment

1. **Setup VPS**:
   - Ubuntu 22.04+ recommended
   - Docker & Docker Compose installed
   - Domain configured with DNS pointing to VPS

2. **Clone repository on VPS**:
   ```bash
   ssh user@your-vps
   cd /opt
   git clone <your-repo-url> transfer-advising-form
   cd transfer-advising-form
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   nano .env  # Update all production values
   ```

4. **Update nginx config**:
   ```bash
   nano ops/nginx/app.conf  # Replace your-domain.com
   ```

5. **Setup SSL with Let's Encrypt**:
   ```bash
   # Install certbot
   sudo apt install certbot

   # Get certificate
   sudo certbot certonly --standalone -d your-domain.com

   # Certificates will be in /etc/letsencrypt/
   ```

6. **Start services**:
   ```bash
   docker compose up -d
   ```

7. **Run migrations and seed**:
   ```bash
   docker compose exec web npx prisma migrate deploy
   docker compose exec web npm run prisma:seed
   ```

## 🔄 CI/CD Setup

### GitHub Secrets

Add these secrets to your GitHub repository:

- `VPS_HOST`: Your VPS IP or hostname
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: Private SSH key for authentication

### Deployment Flow

1. Push to `main` branch
2. GitHub Actions runs lint & typecheck
3. Builds the application
4. Deploys to VPS via SSH
5. Pulls latest code
6. Rebuilds Docker containers
7. Restarts services

## 🔧 Configuration

### Rate Limiting

Edit `.env`:
```env
RATE_LIMIT_WINDOW=600000  # 10 minutes in ms
RATE_LIMIT_MAX=20         # Max requests per window
```

### Email Notifications

To enable email notifications:

```env
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833).

## 📊 Database Backups

Create a backup script (`backup.sh`):

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
docker compose exec -T db pg_dump -U app transfer_advising > backups/backup-$DATE.sql
```

Add to crontab:
```bash
0 2 * * * /opt/transfer-advising-form/backup.sh
```

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Regular security updates (`apt update && apt upgrade`)
- [ ] Monitor logs for suspicious activity
- [ ] Implement database backups
- [ ] Use environment-specific `.env` files

## 📝 API Documentation

### POST /api/submissions

Submit a new transfer advising form.

**Request Body**:
```json
{
  "formMode": "full",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  ...
}
```

**Response** (201):
```json
{
  "success": true,
  "id": "clxxx...",
  "traceId": "1234567890-abc"
}
```

### GET /api/admin/submissions

Get paginated submissions (requires authentication).

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `formMode`: Filter by form mode (partial/full)
- `termSeason`: Filter by term season
- `termYear`: Filter by year
- `from`: Start date filter
- `to`: End date filter

### GET /api/admin/submissions/export

Export submissions as CSV (requires authentication).

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed database
npm run prisma:studio   # Open Prisma Studio
```

### Adding a New Form Field

1. Update `prisma/schema.prisma`:
   ```prisma
   model Submission {
     // ... existing fields
     newField String?
   }
   ```

2. Create migration:
   ```bash
   npx prisma migrate dev --name add_new_field
   ```

3. Update `lib/validations.ts`:
   ```typescript
   export const fullFormSchema = baseSchema.extend({
     // ... existing fields
     newField: z.string().optional(),
   });
   ```

4. Add to form component and API handler

## 🐛 Troubleshooting

### Database connection issues
```bash
# Check if PostgreSQL is running
docker compose ps

# View database logs
docker compose logs db
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

### Migration issues
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Force deploy migrations
npx prisma migrate deploy --force
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@yourdomain.com

## 🙏 Acknowledgments

- Built with Next.js 14, Prisma, Mantine, and TypeScript
- Deployed with Docker and Nginx
- Inspired by modern web application best practices
# MSU_TRANSFER
