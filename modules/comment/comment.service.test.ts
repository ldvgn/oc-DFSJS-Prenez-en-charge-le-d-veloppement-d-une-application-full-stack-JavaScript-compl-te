import { describe, it, expect, vi } from "vitest";
import { commentService } from "./comment.service";
import { commentRepository } from "./comment.repository";

vi.mock("./comment.repository");

describe("create", () => {
  it("creates the comment with its post ID and author ID", async () => {
    const input = { content: "Un commentaire valide" };
    const comment = {
      id: "comment-1",
      ...input,
      createdAt: new Date("2026-01-01"),
      postId: "post-1",
      authorId: "user-1",
    };
    vi.mocked(commentRepository.create).mockResolvedValue(comment);

    const result = await commentService.create(input, "post-1", "user-1");

    expect(commentRepository.create).toHaveBeenCalledWith({
      ...input,
      postId: "post-1",
      authorId: "user-1",
    });
    expect(result).toBe(comment);
  });

  it("rethrows repository errors", async () => {
    vi.mocked(commentRepository.create).mockRejectedValue(
      new Error("DB down"),
    );

    await expect(
      commentService.create(
        { content: "Un commentaire valide" },
        "post-1",
        "user-1",
      ),
    ).rejects.toThrow("DB down");
  });
});
