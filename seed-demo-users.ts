import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@drishti.cyber" },
    update: {
      passwordHash: hashedPassword,
      name: "Drishti Admin",
      role: "ADMIN"
    },
    create: {
      email: "admin@drishti.cyber",
      name: "Drishti Admin",
      passwordHash: hashedPassword,
      role: "ADMIN"
    }
  });

  const investigator = await prisma.user.upsert({
    where: { email: "investigator@drishti.cyber" },
    update: {
      passwordHash: hashedPassword,
      name: "Drishti Investigator",
      role: "INVESTIGATOR"
    },
    create: {
      email: "investigator@drishti.cyber",
      name: "Drishti Investigator",
      passwordHash: hashedPassword,
      role: "INVESTIGATOR"
    }
  });

  console.log("Demo users created/updated successfully:");
  console.log(admin.email);
  console.log(investigator.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
