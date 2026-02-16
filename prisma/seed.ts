import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({adapter})
async function main() {
    const Confidence = await prisma.user.upsert({
        where: {email: "ndu4chicon@gmsil.com"},
        update: {},
        create: {
            name: "Confidence Ndubuisi",
            email: "ndu4chicon@gmail.com",   
        },
    })
    const Theophilus = await prisma.user.upsert({
      where: {email: "theophilussolomo@gmail.com"},
      update: {},
      create: {
        name: "Thephilus Solomon",
        email: "theophilussolomon@gmail.com"
      }
    })
    const createPost = await prisma.post.upsert({
      where: { id: Number() },
      update: {},
      create:{
        title: "First Post",
        content: "This is my first Post of the Year on this site thanks for listenimg amd reading",
        authorId: Confidence.id,
      }
    })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });