import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const yamada = await prisma.user.upsert({
    where: { username: "yamada" },
    update: {},
    create: {
      username: "yamada",
      password: "password01"
    },
  })

  console.log({ yamada })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }
)
