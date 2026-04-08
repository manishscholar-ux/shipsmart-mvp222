# 🚀 Quick Start - Get Running in 5 Minutes

## **Step 1: Install Dependencies** (1 minute)

Run this in your terminal:
```bash
pnpm install
```

---

## **Step 2: Set Up Database** (2 minutes)

### **Option A: Use Supabase (Easiest - Recommended) ⭐**

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new project (takes 1 minute)
5. Go to **Settings** → **Database** → **Connection String**
6. Copy the connection string

**Then in `.env.local`, update:**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
```

---

### **Option B: Use Local PostgreSQL**

**Mac (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb shipsmart
```

**Windows (Download installer):**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer, set password
3. Open PowerShell and run:
```bash
psql -U postgres
CREATE DATABASE shipsmart;
\q
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql
sudo service postgresql start
createdb shipsmart
```

**Then in `.env.local`, update:**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/shipsmart"
```

---

## **Step 3: Generate NextAuth Secret** (30 seconds)

Run this command:
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (if OpenSSL installed)
openssl rand -base64 32

# Or use: https://generate-secret.vercel.app/32
```

Copy the output and paste in `.env.local`:
```
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"
```

---

## **Step 4: Initialize Database** (1 minute)

Run these commands:
```bash
# Create database tables
pnpm prisma:push

# Seed with test data
pnpm tsx scripts/seed.ts
```

You should see:
```
✅ Database seeded successfully!
Created user: test@example.com
Created 2 sample orders
```

---

## **Step 5: Start the Server** (30 seconds)

```bash
pnpm dev
```

You should see:
```
  ▲ Next.js 16.2.0
  - Local:        http://localhost:3000
```

---

## **Step 6: Open in Browser** ✅

Visit: **http://localhost:3000**

You'll be redirected to login page.

---

## **🔐 Login with Test Account**

- **Email**: `test@example.com`
- **Password**: `password123`

---

## **📊 What You Can Now Do**

✅ **Dashboard** - View orders and statistics
✅ **Create Labels** - Compare shipping rates
✅ **Manage Orders** - View all orders, filter, search
✅ **Track Shipments** - See order status changes
✅ **Generate Tracking Numbers** - Automatic tracking assignment

---

## **🎯 Next Steps**

1. **Create Your First Label**:
   - Click "Create Label" button
   - Enter from/to addresses
   - Enter package weight & dimensions
   - Click "Compare Rates"
   - Select a carrier/service
   - Generate label!

2. **Explore Dashboard**:
   - View recent orders
   - Check statistics
   - See connected carriers

3. **Create More Orders**:
   - Go to Orders page
   - Search/filter existing orders
   - Import new orders (feature ready)

---

## **❌ Troubleshooting**

### **"Cannot find module" or import errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```

### **"Connection refused" (Database error)**
```bash
# Check PostgreSQL is running
# Mac: brew services list
# Windows: Check Services app
# Linux: sudo service postgresql status

# For Supabase: Verify connection string in .env.local
```

### **"NEXTAUTH_SECRET not set"**
- Generate new secret: `openssl rand -base64 32`
- Add to `.env.local`
- Restart server: `Ctrl+C` then `pnpm dev`

### **"Port 3000 already in use"**
```bash
# Kill process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows: 
netstat -ano | findstr :3000
taskkill /PID PID_NUMBER /F

# Or use different port:
pnpm dev -- -p 3001
# Visit: http://localhost:3001
```

### **Database schema errors**
```bash
# Reset database (loses all data)
pnpm prisma:push --force-reset
pnpm tsx scripts/seed.ts
```

---

## **📈 After Setup**

- **See data in database**: `pnpm prisma:studio`
- **Build for production**: `pnpm build`
- **Run linter**: `pnpm lint`
- **Check type safety**: `pnpm tsc --noEmit`

---

## **✨ Your Platform Features**

| Feature | Status |
|---------|--------|
| User Auth | ✅ Live |
| Order Management | ✅ Live |
| Rate Comparison | ✅ Live (11+ options) |
| Label Generation | ✅ Live |
| Dashboard Stats | ✅ Live |
| Real Database | ✅ Live |
| Full API | ✅ Live |
| Beautiful UI | ✅ Live |

---

## **🎉 Quick Reference**

```bash
# One-time setup
pnpm install
pnpm prisma:push
pnpm tsx scripts/seed.ts

# Daily development
pnpm dev

# Useful commands
pnpm prisma:studio         # View database visually
pnpm build && pnpm start   # Production mode
pnpm lint                  # Check code quality

# Reset everything
pnpm prisma:push --force-reset
pnpm tsx scripts/seed.ts
```

---

## **Need Help?**

1. Check error in terminal - it usually tells you what's wrong
2. Read `.env.local` is properly configured
3. Make sure database is running
4. Check NEXTAUTH_SECRET is set

---

**That's it! You're ready! 🚀**

The platform is fully functional and ready to use. Start creating shipping labels!
