import { describe, it, expect, vi } from "vitest";
import { topicRepository } from "./topic.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    topic: { findMany: vi.fn() },
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
