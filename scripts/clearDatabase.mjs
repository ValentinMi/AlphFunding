import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.pool.deleteMany();
}

main()
  .then(() => console.log("Database cleared"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
