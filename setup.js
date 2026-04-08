#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🚀 ShipSmart Setup Wizard\n');
  console.log('This will set up your shipping label platform in minutes.\n');

  // Step 1: Check if .env.local exists
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local already exists');
  }

  // Step 2: Get database URL
  console.log('\n📦 Database Setup');
  console.log('Options:');
  console.log('  1. Local PostgreSQL (localhost:5432)');
  console.log('  2. Supabase (Cloud - Recommended)');
  console.log('  3. Railway.app');
  console.log('  4. Skip (I already configured .env.local)');
  
  const dbChoice = await question('\nSelect option (1-4): ');
  
  let connectionString = '';
  
  if (dbChoice === '1') {
    const password = await question('PostgreSQL password: ');
    const dbName = await question('Database name (default: shipsmart): ') || 'shipsmart';
    connectionString = `postgresql://postgres:${password}@localhost:5432/${dbName}`;
  } else if (dbChoice === '2') {
    console.log('\n1. Go to https://supabase.com');
    console.log('2. Sign up and create a project');
    console.log('3. Go to Settings > Database > Connection String');
    console.log('4. Copy the connection string\n');
    connectionString = await question('Paste Supabase connection string: ');
  } else if (dbChoice === '3') {
    console.log('\n1. Go to https://railway.app');
    console.log('2. Sign up and create PostgreSQL');
    console.log('3. Copy the DATABASE_URL\n');
    connectionString = await question('Paste Railway connection string: ');
  }

  // Step 3: Generate or use existing secret
  console.log('\n🔐 NextAuth Secret');
  console.log('A secret key is needed for sessions.\n');
  
  const useNewSecret = await question('Generate new secret? (y/n): ');
  let secret = '';
  
  if (useNewSecret.toLowerCase() === 'y') {
    const crypto = require('crypto');
    secret = crypto.randomBytes(32).toString('base64');
    console.log(`✅ Generated secret: ${secret}`);
  } else {
    secret = await question('Paste your secret (or press Enter to generate): ') || 
             require('crypto').randomBytes(32).toString('base64');
  }

  // Step 4: Update .env.local
  if (connectionString) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /DATABASE_URL="[^"]*"/,
      `DATABASE_URL="${connectionString}"`
    );
    envContent = envContent.replace(
      /NEXTAUTH_SECRET="[^"]*"/,
      `NEXTAUTH_SECRET="${secret}"`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.local updated');
  }

  // Step 5: Install dependencies
  console.log('\n📦 Installing dependencies...');
  console.log('(This may take 2-3 minutes)\n');
  
  exec('pnpm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to install dependencies');
      console.error(error.message);
      rl.close();
      return;
    }
    console.log('✅ Dependencies installed\n');

    // Step 6: Setup database
    console.log('🗄️  Setting up database schema...\n');
    exec('pnpm prisma:push', (error) => {
      if (error) {
        console.error('❌ Failed to setup database');
        console.error(error.message);
        rl.close();
        return;
      }
      console.log('✅ Database schema created\n');

      // Step 7: Seed database
      console.log('🌱 Seeding database with test data...\n');
      exec('pnpm tsx scripts/seed.ts', (error) => {
        if (error) {
          console.error('❌ Failed to seed database');
          console.error(error.message);
          rl.close();
          return;
        }
        console.log('✅ Database seeded with test user\n');

        // Final step
        console.log('════════════════════════════════════════\n');
        console.log('🎉 Setup Complete!\n');
        console.log('Now run: pnpm dev\n');
        console.log('Then visit: http://localhost:3000\n');
        console.log('Test Credentials:');
        console.log('  Email: test@example.com');
        console.log('  Password: password123\n');
        console.log('════════════════════════════════════════\n');
        
        rl.close();
      });
    });
  });
}

main().catch(console.error);
