import { prisma } from "@/lib/prisma";
import { Prisma, type Comment } from "@/prisma/generated/prisma/client";

export class CommentRepository {
  /**
   * Creates a comment.
   *
   * @param data - Comment data with post and author IDs
   * @returns The created comment
   */
  async create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    return prisma.comment.create({ data });
  }
}

export const commentRepository = new CommentRepository();
