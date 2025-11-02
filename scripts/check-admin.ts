#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { hash, verify } from 'argon2';

const prisma = new PrismaClient();

async function checkAdminUser() {
  console.log('🔍 Checking admin user setup...\n');

  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';

  console.log('📧 Looking for admin:', adminEmail);

  try {
    // Check if admin exists
    const admin = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND in database');
      console.log('\n💡 Run: yarn prisma db seed');
      process.exit(1);
    }

    console.log('✅ Admin user found:', admin.email);
    console.log('   ID:', admin.id);
    console.log('   Active:', admin.active);
    console.log('   Created:', admin.createdAt);

    // Test password verification
    console.log('\n🔑 Testing password verification...');
    const isValid = await verify(admin.password, adminPassword);

    if (isValid) {
      console.log('✅ Password verification SUCCESSFUL');
      console.log('\n📝 Login credentials:');
      console.log('   Email:', adminEmail);
      console.log('   Password:', adminPassword);
      console.log('\n✅ Login should work at http://localhost:3000/admin/login');
    } else {
      console.log('❌ Password verification FAILED');
      console.log('\n💡 Password in database does not match ADMIN_SEED_PASSWORD');
      console.log('   Try deleting admin user and re-seeding:');
      console.log('   prisma studio -> delete AdminUser -> yarn prisma db seed');
    }

  } catch (error) {
    console.error('❌ Error checking admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
