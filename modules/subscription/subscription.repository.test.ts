import { describe, it, expect, vi } from "vitest";
import { subscriptionRepository } from "./subscription.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: { subscription: { upsert: vi.fn(), deleteMany: vi.fn() } },
}));

describe("upsert", () => {
  it("creates the subscription or keeps the existing one", async () => {
    const subscription = { id: "sub-1", userId: "user-1", topicId: "topic-1" };
    vi.mocked(prisma.subscription.upsert).mockResolvedValue(subscription);

    const result = await subscriptionRepository.upsert("user-1", "topic-1");

    expect(prisma.subscription.upsert).toHaveBeenCalledWith({
      where: { userId_topicId: { userId: "user-1", topicId: "topic-1" } },
      create: { userId: "user-1", topicId: "topic-1" },
      update: {},
    });
    expect(result).toBe(subscription);
  });
});

describe("delete", () => {
  it("deletes the user's subscription to the topic", async () => {
    vi.mocked(prisma.subscription.deleteMany).mockResolvedValue({ count: 1 });

    await subscriptionRepository.delete("user-1", "topic-1");

    expect(prisma.subscription.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", topicId: "topic-1" },
    });
  });
});
