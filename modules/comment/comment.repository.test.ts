import { describe, it, expect, vi } from "vitest";
import { commentRepository } from "./comment.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: { comment: { create: vi.fn() } },
}));

describe("create", () => {
  it("creates the comment with the given data", async () => {
    const data = {
      content: "Un commentaire valide",
      postId: "post-1",
      authorId: "user-1",
    };
    const comment = {
      id: "comment-1",
      ...data,
      createdAt: new Date("2026-01-01"),
    };
    vi.mocked(prisma.comment.create).mockResolvedValue(comment);

    const result = await commentRepository.create(data);

    expect(prisma.comment.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(comment);
  });
});
