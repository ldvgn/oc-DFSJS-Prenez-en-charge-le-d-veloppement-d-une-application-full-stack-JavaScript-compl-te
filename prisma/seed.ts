import "dotenv/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Test users (passwords match the spec rules). */
const USERS = [
  { username: "alice", email: "alice@mdd.dev", password: "Password123!" },
  { username: "bob", email: "bob@mdd.dev", password: "Password123!" },
];

const TOPICS = [
  { name: "JavaScript", description: "Le langage du web." },
  { name: "TypeScript", description: "JavaScript typé." },
  { name: "Python", description: "Polyvalent et lisible." },
];

async function main() {
  // Cleanup: reverse dependency order
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.topic.deleteMany();

  // Users: Better Auth creates User + Account (scrypt hash)
  const createdUsers = [];
  for (const u of USERS) {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: u.username, // name = username (no full name in the specs)
        username: u.username,
        email: u.email,
        password: u.password,
      },
    });
    createdUsers.push(user);
  }

  // Domain data: Prisma directly
  await prisma.topic.createMany({ data: TOPICS });
  const topics = await prisma.topic.findMany();

  const [alice, bob] = createdUsers;

  await prisma.subscription.createMany({
    data: [
      { userId: alice.id, topicId: topics[0].id },
      { userId: alice.id, topicId: topics[1].id },
    ],
  });

  const post = await prisma.post.create({
    data: {
      title: "Bien démarrer avec TypeScript",
      content: "Quelques conseils pour débuter...",
      authorId: bob.id,
      topicId: topics[1].id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Merci, très utile !",
      authorId: alice.id,
      postId: post.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
