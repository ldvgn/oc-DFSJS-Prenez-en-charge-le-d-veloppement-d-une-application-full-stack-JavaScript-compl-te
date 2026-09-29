import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: { select: { username: true } } };
}>;

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    author: { select: { username: true } };
    topic: true;
    comments: {
      include: { author: { select: { username: true } } };
      orderBy: { createdAt: "asc" };
    };
  };
}>;

export type SortOrder = "asc" | "desc";

export class PostRepository {
  /**
   * Returns all posts with their author's username, sorted by creation date.
   *
   * @param order - "desc" (newest first, default) or "asc"
   * @returns All posts.
   */
  async findAll(order: SortOrder = "desc"): Promise<PostWithAuthor[]> {
    return prisma.post.findMany({
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: order },
    });
  }

  /**
   * Returns a single post with its author's username, topic and comments.
   *
   * @param id - The post's ID
   * @returns The post, or `null` if not found.
   */
  async findById(id: string): Promise<PostDetail | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        topic: true,
        comments: {
          include: { author: { select: { username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }
}

export const postRepository = new PostRepository();
