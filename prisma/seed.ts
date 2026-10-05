import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@cyber',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN' as const,
    },
    {
      email: 'investigator@cyber',
      name: 'Investigating Officer',
      passwordHash,
      role: 'INVESTIGATOR' as const,
    },
    {
      email: 'analyst@cyber',
      name: 'Data Analyst',
      passwordHash,
      role: 'ANALYST' as const,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Database seeded with users:', users.map(u => u.email).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
