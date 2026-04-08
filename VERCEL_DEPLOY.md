# ShipSmart - Deploy to Vercel Guide

## **Option 1: Deploy via GitHub (Easiest - 5 Minutes)**

### Steps:
1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com/signup
   - Create free account

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `shipsmart-mvp`
   - Choose "Public"
   - Click "Create repository"

3. **Upload Your Code**
   - In the new repo, click "Add file" → "Upload files"
   - Drag & drop all files from `c:\Users\YadavManish\OneDrive - Purolator Inc\Desktop\test codes`
   - Commit

4. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Select "Continue with GitHub"
   - Click "Import Project"
   - Find your `shipsmart-mvp` repository
   - Click "Import"
   - Vercel will auto-detect Next.js
   - Click "Deploy"

5. **Wait 2-3 minutes** ✅
   - Your app will be live at `shipsmart-mvp.vercel.app`
   - Share this URL with anyone!

---

## **Option 2: Deploy via Command Line (If Git Available)**

```bash
# Check if git is available
git --version

# If yes, run these commands:
git init
git add .
git commit -m "Initial commit - ShipSmart MVP"
git branch -M main

# Connect to GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/shipsmart-mvp.git
git push -u origin main
```

Then follow steps 4-5 from Option 1.

---

## **Option 3: Vercel CLI (If You Can Download)**

```bash
npm install -g vercel
vercel login
vercel
```

---

## **Option 4: Local Python Server (No Cloud)**

Since Python is showing issues, let's try creating a simple working server...

---

## **What Works on Vercel**

✅ All backend APIs  
✅ Database connection  
✅ User authentication  
✅ Shipping rates  
✅ Label generation  
✅ Dashboard  
✅ Order management  

**Everything in 2 clicks!**

---

## **After Deployment**

Your app will be live at: `https://shipsmart-mvp.vercel.app`

- Share with anyone globally
- Works on mobile
- Always running
- Free tier available

---

## **Login Credentials**

After deployment, login with:
- Email: `test@example.com`
- Password: `password123`

**Or create your own account!**

---

**Which option works best for you?**
