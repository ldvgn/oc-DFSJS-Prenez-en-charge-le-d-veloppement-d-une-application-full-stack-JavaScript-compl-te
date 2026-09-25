import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await bcrypt.hash("azerty123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@mdd.com" },
    update: {},
    create: {
      email: "test@mdd.com",
      username: "testuser",
      password: hashedPassword,
    },
  });

  const topics = [
    { name: "JavaScript", description: "Tout sur l'écosystème JavaScript." },
    { name: "React", description: "Actualités et bonnes pratiques React." },
    { name: "Node.js", description: "Développement backend avec Node.js." },
    { name: "DevOps", description: "CI/CD, conteneurisation et infra." },
  ];

  const createdTopics = await Promise.all(
    topics.map((topic) =>
      prisma.topic.upsert({
        where: { name: topic.name },
        update: {},
        create: topic,
      }),
    ),
  );

  await prisma.post.create({
    data: {
      title: "Les nouveautés de JavaScript ES2025",
      content: "Un tour d'horizon des dernières fonctionnalités du langage.",
      authorId: user.id,
      topicId: createdTopics.find((t) => t.name === "JavaScript")!.id,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
