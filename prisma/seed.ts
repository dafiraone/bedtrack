import { prisma } from '../src/lib/server/prisma';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to DB');

    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: 'admin', // Note: Use proper hashing in production
        role: 'admin'
      }
    });
    
    console.log('✅ Admin seeded: admin/admin');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
