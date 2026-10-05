import { describe, it, expect, vi } from "vitest";
import { topicRepository } from "./topic.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    topic: { findMany: vi.fn(), findUnique: vi.fn() },
  },
}));

describe("findAll", () => {
  it("queries all topics sorted by name", async () => {
    const topics = [
      { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
      { id: "topic-2", name: "TypeScript", description: "Le JS typé" },
    ];
    vi.mocked(prisma.topic.findMany).mockResolvedValue(topics);

    const result = await topicRepository.findAll();

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
    });
    expect(result).toBe(topics);
  });
});

describe("findById", () => {
  it("queries a topic by ID", async () => {
    const topic = {
      id: "topic-1",
      name: "JavaScript",
      description: "Le langage du web",
    };
    vi.mocked(prisma.topic.findUnique).mockResolvedValue(topic);

    const result = await topicRepository.findById("topic-1");

    expect(prisma.topic.findUnique).toHaveBeenCalledWith({
      where: { id: "topic-1" },
    });
    expect(result).toBe(topic);
  });
});

describe("findAllWithSubscriptions", () => {
  it("queries all topics sorted by name with the user's subscription", async () => {
    const topics = [
      {
        id: "topic-1",
        name: "JavaScript",
        description: "Le langage du web",
        subscriptions: [{ id: "sub-1" }],
      },
      {
        id: "topic-2",
        name: "TypeScript",
        description: "Le JS typé",
        subscriptions: [],
      },
    ];
    vi.mocked(prisma.topic.findMany).mockResolvedValue(topics);

    const result = await topicRepository.findAllWithSubscriptions("user-1");

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      include: {
        subscriptions: { where: { userId: "user-1" }, select: { id: true } },
      },
      orderBy: { name: "asc" },
    });
    expect(result).toBe(topics);
  });
});

describe("findSubscribedByUser", () => {
  it("queries the topics the user subscribes to, sorted by name", async () => {
    const topics = [
      { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
    ];
    vi.mocked(prisma.topic.findMany).mockResolvedValue(topics);

    const result = await topicRepository.findSubscribedByUser("user-1");

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      where: { subscriptions: { some: { userId: "user-1" } } },
      orderBy: { name: "asc" },
    });
    expect(result).toBe(topics);
  });
});
