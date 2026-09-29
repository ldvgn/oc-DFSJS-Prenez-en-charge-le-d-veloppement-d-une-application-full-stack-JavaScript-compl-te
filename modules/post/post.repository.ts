import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: { select: { username: true } } };
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
}

export const postRepository = new PostRepository();
