import { describe, it, expect, vi } from "vitest";
import { postRepository } from "./post.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  },
}));

describe("findAllBySubscriber", () => {
  it("queries the posts of the subscribed topics, newest first by default", async () => {
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
    vi.mocked(prisma.post.findMany).mockResolvedValue(posts);

    const result = await postRepository.findAllBySubscriber("user-1");

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: { topic: { subscriptions: { some: { userId: "user-1" } } } },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toBe(posts);
  });

  it("sorts by the given order", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([]);

    await postRepository.findAllBySubscriber("user-1", "asc");

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } }),
    );
  });
});

describe("findById", () => {
  it("queries the post with its author, topic and sorted comments", async () => {
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
    vi.mocked(prisma.post.findUnique).mockResolvedValue(post);

    const result = await postRepository.findById("post-1");

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: "post-1" },
      include: {
        author: { select: { username: true } },
        topic: true,
        comments: {
          include: { author: { select: { username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    expect(result).toBe(post);
  });

  it("returns null when the post does not exist", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

    const result = await postRepository.findById("unknown");

    expect(result).toBeNull();
  });
});

describe("create", () => {
  it("creates the post with the given data", async () => {
    const data = {
      topicId: "topic-1",
      title: "Mon article",
      content: "Un contenu valide",
      authorId: "user-1",
    };
    const post = { id: "post-1", ...data, createdAt: new Date("2026-01-01") };
    vi.mocked(prisma.post.create).mockResolvedValue(post);

    const result = await postRepository.create(data);

    expect(prisma.post.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(post);
  });
});
