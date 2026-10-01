import { describe, it, expect, vi } from "vitest";
import { postService } from "./post.service";
import { postRepository } from "./post.repository";

vi.mock("./post.repository");

describe("getFeed", () => {
  it("returns the posts of the user's subscribed topics", async () => {
    const userId = "user-1";
    const posts = [
      {
        id: "post-1",
        title: "Bien démarrer avec TypeScript",
        content: "Contenu de l'article",
        createdAt: new Date("2026-01-01"),
        authorId: "user-2",
        topicId: "topic-1",
        author: { username: "bob" },
      },
    ];
    vi.mocked(postRepository.findAllBySubscriber).mockResolvedValue(posts);

    const result = await postService.getFeed(userId, "asc");

    expect(postRepository.findAllBySubscriber).toHaveBeenCalledWith(
      userId,
      "asc",
    );
    expect(result).toBe(posts);
  });
});
