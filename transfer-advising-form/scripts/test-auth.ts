#!/usr/bin/env tsx

// Direct test of the NextAuth authorize function

import { PrismaClient } from '@prisma/client';
import { verify } from 'argon2';
import { z } from 'zod';

const prisma = new PrismaClient();

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

async function testAuth() {
  console.log('🧪 Testing NextAuth authorize logic...\n');

  const credentials = {
    email: process.env.ADMIN_SEED_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!',
  };

  console.log('📝 Testing with credentials:');
  console.log('   Email:', credentials.email);
  console.log('   Password:', credentials.password);
  console.log('');

  try {
    // Step 1: Validate input
    console.log('1️⃣ Validating credentials...');
    const validated = adminLoginSchema.parse(credentials);
    console.log('   ✅ Validation passed');
    console.log('   Email (normalized):', validated.email);
    console.log('');

    // Step 2: Find admin user
    console.log('2️⃣ Finding admin user in database...');
    const admin = await prisma.adminUser.findUnique({
      where: { email: validated.email },
    });

    if (!admin) {
      console.log('   ❌ Admin user NOT FOUND');
      console.log('   💡 Run: yarn prisma db seed');
      process.exit(1);
    }

    console.log('   ✅ Admin found:', admin.email);
    console.log('   Active:', admin.active);
    console.log('');

    if (!admin.active) {
      console.log('   ❌ Admin account is INACTIVE');
      process.exit(1);
    }

    // Step 3: Verify password
    console.log('3️⃣ Verifying password...');
    const isValid = await verify(admin.password, validated.password);

    if (!isValid) {
      console.log('   ❌ Password verification FAILED');
      console.log('   💡 Password does not match');
      process.exit(1);
    }

    console.log('   ✅ Password verified');
    console.log('');

    // Step 4: Success
    console.log('✅ AUTH SUCCESSFUL!');
    console.log('');
    console.log('User object that would be returned:');
    console.log({
      id: admin.id,
      email: admin.email,
    });
    console.log('');
    console.log('🎯 If login still fails, check:');
    console.log('   1. Browser console for errors');
    console.log('   2. Network tab for the /api/auth/callback/credentials request');
    console.log('   3. NEXTAUTH_URL and NEXTAUTH_SECRET in .env');
    console.log('   4. Try clearing cookies and cache');

  } catch (error: any) {
    console.error('❌ Error during auth test:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
