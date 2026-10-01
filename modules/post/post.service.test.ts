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

describe("getById", () => {
  it("returns the post with its author, topic and comments", async () => {
    const post = {
      id: "post-1",
      title: "Bien démarrer avec TypeScript",
      content: "Contenu de l'article",
      createdAt: new Date("2026-01-01"),
      authorId: "user-2",
      topicId: "topic-1",
      author: { username: "bob" },
      topic: { id: "topic-1", name: "TypeScript", description: "Le JS typé" },
      comments: [],
    };
    vi.mocked(postRepository.findById).mockResolvedValue(post);

    const result = await postService.getById("post-1");

    expect(postRepository.findById).toHaveBeenCalledWith("post-1");
    expect(result).toBe(post);
  });

  it("returns null when the post does not exist", async () => {
    vi.mocked(postRepository.findById).mockResolvedValue(null);

    const result = await postService.getById("unknown");

    expect(result).toBeNull();
  });
});

describe("create", () => {
  it("creates the post with its author ID", async () => {
    const input = {
      topicId: "topic-1",
      title: "Mon article",
      content: "Un contenu valide",
    };
    const post = {
      id: "post-1",
      ...input,
      createdAt: new Date("2026-01-01"),
      authorId: "user-1",
    };
    vi.mocked(postRepository.create).mockResolvedValue(post);

    const result = await postService.create(input, "user-1");

    expect(postRepository.create).toHaveBeenCalledWith({
      ...input,
      authorId: "user-1",
    });
    expect(result).toBe(post);
  });

  it("rethrows repository errors", async () => {
    vi.mocked(postRepository.create).mockRejectedValue(new Error("DB down"));

    await expect(
      postService.create(
        {
          topicId: "topic-1",
          title: "Mon article",
          content: "Un contenu valide",
        },
        "user-1",
      ),
    ).rejects.toThrow("DB down");
  });
});
