# ShipSmart Setup Guide

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database
Create a PostgreSQL database or use an online provider:
```bash
# Using local PostgreSQL
createdb shipsmart

# Or use a cloud provider like:
# - Supabase (free tier)
# - Railway (free tier)
# - Neon (free tier)
```

### 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/shipsmart"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
```

### 4. Initialize Database
```bash
pnpm prisma:push
```

### 5. Seed with Test Data
```bash
pnpm tsx scripts/seed.ts
```

### 6. Start Development Server
```bash
pnpm dev
```

Visit: `http://localhost:3000`

## 🔐 Login Credentials

After seeding:
- **Email**: `test@example.com`
- **Password**: `password123`

## 📋 What You Can Do Now

✅ Create shipping labels with live rate comparison
✅ View and manage orders
✅ Compare shipping rates from 4 carriers
✅ Generate tracking numbers
✅ Filter and search orders
✅ View billing and subscription info

## 🚀 Production Deployment

### 1. Deploy Database
```bash
# Railway, Supabase, or Railway
# Get your production connection string
```

### 2. Set Environment Variables
On your hosting platform (Vercel, Railway, etc.):
```
DATABASE_URL=your_production_db_url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_generated_secret
```

### 3. Deploy Code
```bash
# Vercel (recommended for Next.js)
vercel deploy

# Or any other Node.js hosting
```

### 4. Run Migrations
```bash
pnpm prisma:migrate deploy
```

## 🔧 Useful Commands

```bash
# View database
pnpm prisma:studio

# Create migration
pnpm prisma:migrate

# Generate Prisma client
pnpm prisma:generate

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 📁 Project Structure

```
├── app/api/          # API endpoints
├── app/dashboard/    # Protected pages
├── components/       # Reusable components
├── lib/              # Core libraries
├── prisma/           # Database schema
├── scripts/          # Utility scripts
└── public/           # Static files
```

## 🐛 Troubleshooting

### "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Run `pnpm prisma:push` to sync schema

### "NEXTAUTH_SECRET not configured"
- Generate with: `openssl rand -base64 32`
- Add to .env.local

### "Port 3000 already in use"
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use different port: `pnpm dev -- -p 3001`

### Components not updated
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

## 📚 Next Steps

1. **Read the README.md** for full feature documentation
2. **Explore API docs** - check `/api/*` route files
3. **Customize branding** - update colors in Tailwind config
4. **Add auth pages** - create signin/signup pages
5. **Connect real carriers** - integrate carrier APIs

## 💡 Tips

- Use Prisma Studio to visualize data: `pnpm prisma:studio`
- Check network tab in browser DevTools for API calls
- Use test email credentials for development
- Keep `.env.local` in .gitignore (never commit secrets)

## 🆘 Need Help?

1. Check error logs in console
2. Review `/app/api/*` files for endpoint documentation
3. Check Prisma schema in `/prisma/schema.prisma`
4. Review component props and interfaces

---

**You're all set! Happy shipping! 🚀**
