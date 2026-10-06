import { prisma } from "@/lib/prisma";
import { Prisma, type Post } from "@/prisma/generated/prisma/client";
import type { PostDetail, PostWithAuthor, SortOrder } from "./post.definitions";

export class PostRepository {
  /**
   * Returns the posts of the topics a user subscribes to, sorted by creation date.
   *
   * @param userId - Subscriber ID
   * @param order - "desc" (newest first, default) or "asc"
   * @returns The posts with their author
   */
  async findAllBySubscriber(
    userId: string,
    order: SortOrder = "desc",
  ): Promise<PostWithAuthor[]> {
    return prisma.post.findMany({
      where: { topic: { subscriptions: { some: { userId } } } },
      include: {
        author: { select: { username: true } },
      },
      orderBy: { createdAt: order },
    });
  }

  /**
   * Returns a single post with its author's username, topic and comments.
   *
   * @param id - Post ID
   * @returns The post, or `null` if not found
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

  /**
   * Creates a post.
   *
   * @param data - Post data with author ID
   * @returns The created post
   */
  async create(data: Prisma.PostUncheckedCreateInput): Promise<Post> {
    return prisma.post.create({ data });
  }
}

export const postRepository = new PostRepository();
