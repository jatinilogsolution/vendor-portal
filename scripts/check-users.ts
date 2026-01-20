
require('dotenv').config();
import { prisma } from "../src/lib/prisma";
import { UserRoleEnum } from "../src/utils/constant";

async function main() {
    const tadmins = await prisma.user.findMany({
        where: { role: UserRoleEnum.TADMIN },
        select: { id: true, name: true, email: true,  }
    });

    const bosses = await prisma.user.findMany({
        where: { role: UserRoleEnum.BOSS },
        select: { id: true, name: true, email: true, }
    });

    console.log("--- TADMINS ---");
    console.table(tadmins);

    console.log("\n--- BOSSES ---");
    console.table(bosses);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
