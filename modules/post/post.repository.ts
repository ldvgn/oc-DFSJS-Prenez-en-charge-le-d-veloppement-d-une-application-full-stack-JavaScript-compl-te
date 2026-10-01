import { prisma } from "@/lib/prisma";
import { Prisma, type Post } from "@/prisma/generated/prisma/client";
import type { PostDetail, PostWithAuthor, SortOrder } from "./post.schemas";

export class PostRepository {
  /**
   * Returns all posts with their author's username, sorted by creation date.
   *
   * @param order - "desc" (newest first, default) or "asc"
   * @returns All posts.
   */
  async findAll(order: SortOrder = "desc"): Promise<PostWithAuthor[]> {
    return prisma.post.findMany({
      include: {
        author: { select: { username: true } },
      },
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

  /**
   * Creates a post.
   *
   * @param data - The post data and its author's ID
   * @returns The created post.
   */
  async create(data: Prisma.PostUncheckedCreateInput): Promise<Post> {
    return prisma.post.create({ data });
  }
}

export const postRepository = new PostRepository();
